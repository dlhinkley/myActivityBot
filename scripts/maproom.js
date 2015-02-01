
function MapRoom(robot) {

    var canvas  = new Canvas("roomMapCanvas",400, 400);
	var self    = this;
	var g       = new Geometry();
	var walls   = new Walls(canvas);
	var turnDeg = 0;	
	var gridSize = 50;
	var mapGrid = null;
	
	this.complete = false;
	
	
	/*
	* Scans room from initial position
	*/
	self.scanInitial = function() {
		
		var point, wallDist = null;

		if ( turnDeg <= 360 ) {
			
			turnDeg += 10;
			
			robot.turn(10);
		
			wallDist = robot.getWallDistance();
			console.log('wallDist = ' + wallDist);	
			
			if ( wallDist !== null ) {
                point = calcPoint(robot.getPoint().x ,robot.getPoint().y, wallDist, turnDeg);
    			
    			// Save wall location
    			walls.addLine( point );
			}
			else {
    			
    			walls.addGap();
			}
			
		}
		else {
			
			
			this.complete = true;
    		canvas.clear();
    		walls.plotWalls();
		}		
	}
	/*
	* Returns the array of walls
	*/
	self.getWalls = function() {
		
		return walls;
	}
	/**
	* Using the present robot position, turn angle and distance, return the point 
	* that distance away
	*/
	function calcPoint(x, y, distance,degree) {
		
				
		// Take away 90 to adjust for our north
		var adjDeg = 90 - degree;

		console.log("degree=" + degree + " adjDeg=" + adjDeg);
		
		var angle = rad(adjDeg);
		var o = g.point(x,y );
		
		var newPoint = g.point.fromPolar(distance, angle, o);
		
		console.log('calcPoint newPoint=',newPoint);
		
		
		if (canvas)
		    canvas.drawCircle(newPoint.x, newPoint.y,4,'purple');

		return newPoint;
	}

	self.calcScanRoute = function() {
	
	    var myMapCell = createMapGrid();
	    
	    console.log('calcScanRoute myMapCell=',myMapCell);
	    routeWest(myMapCell);
		

		return true;
	}
    function routeWest(cell) {
        
	    console.log('routeWest start cell=',cell);
        if ( ! cell.isWall() ) {
            
            cell.cellWest.flagAsPath();
            routeWest(cell.cellWest);

        }
	    console.log('routeWest end cell=',cell);
    }
	function calcRoutePoint(robotCtrPoint, endPoint, distance) {
							
			var measureLine = g.line(robotCtrPoint, endPoint );

			var routePoint = calcDistFromEndPoint(measureLine, distance);
			
			// Draw original line
			canvas.drawLine( measureLine.end.x, measureLine.end.y, measureLine.start.x,  measureLine.start.y, 'orange' );
			canvas.drawSquare(measureLine.end.x, measureLine.end.y, 16, 'orange');
			
			
			// Draw shortened line
			canvas.drawLine( robotCtrPoint.x, robotCtrPoint.y, routePoint.x,  routePoint.y, 'blue' );
			canvas.drawSquare(routePoint.x, routePoint.y, 8, 'blue');
			
			return routePoint;
	}
	/**
	* Given a line, calculate the point on the line the given distance away
	* and return the point
	*/
	function calcDistFromEndPoint(line, distance) {
		
		//First you calculate the vector from x1y1 to x2y2:
		
		var vx = line.end.x - line.start.x;
		var vy = line.end.y - line.start.y;
		
		// Then calculate the length:
		
		var mag = Math.sqrt(vx * vx + vy * vy);
		
		// Normalize the vector to unit length:
		
		vx /= mag;
		vy /= mag;
		
		//Finally calculate the new vector, which is x2y2 + vxvy * (mag + distance).
		
		var px = line.start.x + vx * (mag - distance);
		var py = line.start.y + vy * (mag - distance);
		
		return g.point(px,py);		
		
	}
	
	function createMapGrid() {
    	
    	// Start at robot position, go right
    	var centerX = robot.x;
    	var centerY = robot.y;
    	 
        mapGrid = new MapGrid();
    	
    	
    	// Go north to wall until touching wall
    	//
        return createCell(centerX, centerY, 'main',0);
	}
	function createCell(x, y, direction, level) {
    	
    	console.log('createCell start direction=' + direction + ' level=' + level + ' x=' + x + ' y=' + y);

	
        var mapCell = new MapCell( x, y, gridSize ); // Create mapCell object
        var lowerLeftPoint  = g.point( x - (gridSize/2), y + (gridSize/2) );
        var lowerRightPoint = g.point( x + (gridSize/2), y + (gridSize/2) );
        var upperLeftPoint  = g.point( x - (gridSize/2), y - (gridSize/2) );
        var upperRightPoint = g.point( x + (gridSize/2), y - (gridSize/2) );
        
        var upperLine = g.line( upperLeftPoint, upperRightPoint );
        var leftLine  = g.line( upperLeftPoint, lowerLeftPoint  );
        var lowerLine = g.line( lowerLeftPoint, lowerRightPoint );
        var rightLine = g.line( upperRightPoint,lowerRightPoint );
        
        var box = [upperLine, leftLine, lowerLine, rightLine ];
        
        mapGrid.addCell( mapCell );
    	    	
        // Change color touching at south

        // If the cell goes beyond the room
        if ( ! walls.containsPoint(lowerLeftPoint) || ! walls.containsPoint(lowerRightPoint) ) {
        
            // If the square intesects with a wall, it's a wall
            if ( walls.intersects(box)  ) {
                mapCell.flagAsWall(); // Flag it as a wall cell
            }
            else {
                
                mapCell.flagAsDoorway();
            }
        }
        else if ( mapGrid.get( x, y + gridSize )  ) {
        
            mapCell.cellSouth = mapGrid.get( x, y + gridSize );
        }
        else {
                
            mapCell.cellSouth = createCell( x, y + gridSize, 'south', level + 1); // Create cell to south
        }
        
        
        // Change color touching at north
        if ( ! walls.containsPoint(upperLeftPoint) || ! walls.containsPoint(upperRightPoint) ) {
            
            // If the square intesects with a wall, it's a wall
            if ( walls.intersects(box)  ) {
                mapCell.flagAsWall(); // Flag it as a wall cell
            }
            else {
                
                mapCell.flagAsDoorway();
            }
        }
        else if ( mapGrid.get( x, y - gridSize )  ) {
        
            mapCell.cellNorth = mapGrid.get( x, y - gridSize );
        }
        else {
            
            mapCell.cellNorth = createCell( x, y - gridSize, 'north', level + 1); // Create cell to north
        }
        

        
        // Change color touching at east
        if ( ! walls.containsPoint(upperRightPoint) || ! walls.containsPoint(lowerRightPoint) ) {
            
            // If the square intesects with a wall, it's a wall
            if ( walls.intersects(box)  ) {
                mapCell.flagAsWall(); // Flag it as a wall cell
            }
            else {
                
                mapCell.flagAsDoorway();
            }
        }
        else if ( mapGrid.get( x + gridSize, y ) ) {
        
            mapCell.cellWest = mapGrid.get( x + gridSize, y );
        }
        else {
            
            mapCell.cellWest = createCell( x + gridSize, y , 'east', level + 1); // Create cell east
        }
        

        
        // Change color touching at west
        if ( ! walls.containsPoint(upperLeftPoint) || ! walls.containsPoint(lowerLeftPoint) ) {
            
            if ( walls.intersects(box)  ) {
                mapCell.flagAsWall(); // Flag it as a wall cell
            }
            else {
                
                mapCell.flagAsDoorway();
            }
        }
        else if ( mapGrid.get( x - gridSize, y ) ) {
        
            mapCell.cellEast = mapGrid.get( x - gridSize, y );
        }
        else {
            
            mapCell.cellEast = createCell( x - gridSize, y , 'west', level + 1); // Create cell east
        }
        
    	console.log('createCell end direction=' + direction + ' level=' + level + ' x=' + x + ' y=' + y);
        
        return mapCell;
	}

	/**
	* Given the robot's x, y position, fill all the boxes north until hitting the wall
	* when the wall is hit, mark that box as containing the wall
	*/
/*

	function squareTouchesWall(x, y) {
    	
    	
    	return ! walls.containsPoint(x - (gridSize/2), y - (gridSize/2))
    	    || ! walls.containsPoint(x + (gridSize/2), y - (gridSize/2))
    	    || ! walls.containsPoint(x - (gridSize/2), y + (gridSize/2))
    	    || ! walls.containsPoint(x + (gridSize/2), y + (gridSize/2))
	}
*/
	
	/**
	* Map Grid object
	*/
    function MapGrid() {
        
        var cells = [];
        var xPtr = 0;
        var yPtr = 0;
        
        this.addCell = function(mapCell) {
            
            cells.push( mapCell );
        }
        
        
        this.get = function(x,y) {
            
            var cell = null;
            ctr = 0;
            while (cell === null && ctr < cells.length ) {
                
                if ( cells[ctr].x === x && cells[ctr].y === y ) {
                    
                    cell = cells[ctr];
                }
                ctr++;
            }
            return cell;
        }
    }
    /**
    * Map Cell object
    */
    function MapCell(x, y, size ) {
        
    	console.log('MapCell start x=' + x + ' y=' + y);

        var isWall = false;
        var isDoorway = false;
        
        this.x = x;
        this.y = y;
        
        this.cellNorth = null;
        this.cellSouth = null;
        this.cellEast = null;
        this.cellWest = null;
        
        canvas.drawBox(x, y, gridSize, '#00FF00');
        
        /**
        * Flag as Doorway
        */
        this.flagAsDoorway = function() {
                      
            clearFlags();           
            isDoorway = true;
            canvas.drawSquare(this.x, this.y, gridSize, '#999999');
        };
        this.isDoorway = function() {
            
            return isDoorway;
        }
        
        this.flagAsWall = function() {
                      
            clearFlags();           
            isWall = true;
            canvas.drawSquare(this.x, this.y, gridSize, '#FF0000');
        };
        this.isWall = function() {
            
            return isWall;
        }
        function clearFlags() {
            
            isWall = false;
            isDoorway = false;
        }
        this.flagAsPath = function() {
            
            canvas.drawSquare(this.x, this.y, gridSize, '#0000FF');
        };
    }
}




function Walls(canvas) {
	
	var lineArray 	= [];
	var prevPoint 	= null;
	var g 			= new Geometry();
	
	/**
	* Add a point on the wall to the array, adding a new line to wall
	*/
	this.addLine = function( point ) {
		
		if ( ! prevPoint ) {
			
			prevPoint = point;
		}
		else {
			
			lineArray.push( g.line(prevPoint, point) );
			prevPoint = point;			
		}
	}
	/**
	* Called if there's a gap in the wall (ex. doorway).  Set's the prev point to 
	* null so the lines are unconnected and represent the door
	*/
    this.addGap = function() {
        
        prevPoint = null;
    }

	/**
	* Removes the previous point.  Done since lines needed to be added in sets of points
	* instead of one point
	*/
	this.clearPrevious = function() {
		
		prevPoint = null;
	}
	this.length = function() {
		
		return lineArray.length;
	}
	this.get = function(ptr) {
		
		
		return lineArray[ptr];
	}
	/*
	* Draws all the walls on a canvas
	*/
	this.plotWalls = function() {
		
		for (var m = 0; m < lineArray.length; m++ ) {
			
			///console.log('plotWalls start=' , lineArray[m].start);
			//console.log('plotWalls end=' , lineArray[m].end);
			 
			if (canvas) canvas.drawLine( lineArray[m].start.x, lineArray[m].start.y, lineArray[m].end.x,  lineArray[m].end.y, 'pink' );
			
			if (canvas) canvas.drawSquare( lineArray[m].start.x, lineArray[m].start.y, 8, 'pink' );
			if (canvas) canvas.drawSquare( lineArray[m].end.x, lineArray[m].end.y, 8, 'pink' );
			
		}
	}
	/**
	* Given the location of a point, return true if point is inside the walls
	*/
	this.containsPoint = function(point) {
    	
    	var pointArray = [];
    	
		for (var m = 0; m < lineArray.length; m++ ) {
		
		    pointArray.push( lineArray[m].start.x );
		    pointArray.push( lineArray[m].start.y );
		    pointArray.push( lineArray[m].end.x );
		    pointArray.push( lineArray[m].end.y );
		    
		}
    	return PolyK.ContainsPoint( pointArray, point.x, point.y );
	}
	/**
	* Given an array of lines that make a box, returns true if that line 
	* intersects with a wall
	*/
	this.intersects = function( box ) {
    	
    	var ptr = 0;
    	var intersects = false;
    	
		while ( ! intersects && ptr < lineArray.length ) {
		
		    for (var m = 0; m < box.length; m ++ ) {
		
                var line = box[m];
                
    		    if ( line.intersection( lineArray[ptr] ) !== null ) {
        		    
        		    intersects = true;
    		    }
		    }
    	
            ptr++;
    	}
    	return intersects;
	}

}
