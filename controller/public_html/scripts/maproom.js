'use strict'

function MapRoom(robot, canvas) {

	var self    = this;
	var g       = new Geometry();
	var walls   = new Walls(canvas);
	var turnDeg = 0;	
	var gridSize = 50;
	var mapGrid = null;
	
	this.complete = false;
	
	self.getMapGrid = function() {
	    
	    return mapGrid;
	}
	/*
	* Scans room from initial position
	*/
	self.scanInitial = function() {
	
		console.log('MapRoom.scanInitial start');	
		
		var point, wallDist = null;

		if ( turnDeg <= 360 ) {
			
			turnDeg += 30;
			
			robot.sendCommand('right 30');
		
			wallDist = robot.getCommand().ping;
			console.log('MapRoom.scanInitial turnDeg=' + turnDeg + ' wallDist = ' + wallDist);	
			
			if ( wallDist !== null ) {
                point = calcPoint(robot.getCommand().x ,robot.getCommand().y, wallDist, turnDeg);
    			
    			// Save wall location
    			walls.addLine( point );
			}
			else {
    			
    			walls.addGap();
			}
		}
		else {
			
			this.complete = true;
    		if (canvas) canvas.clear();
    		walls.plotWalls();
		}		
		console.log('MapRoom.scanInitial end');	
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

		console.log("MapRoom.calcPoint x=" + x + " y=" + y + " distance=" + distance + " degree=" + degree + " adjDeg=" + adjDeg);
		
		var angle = rad(adjDeg);
		var o = g.point(x,y );
		
		var newPoint = g.point.fromPolar(distance, angle, o);
		
		console.log('MapRoom.calcPoint newPoint=',newPoint);
		
		
		if (canvas)
		    canvas.drawCircle(newPoint.x, newPoint.y,4,'purple');

		return newPoint;
	}

	self.calcScanRoute = function() {
	
	    var rootCell = createMapGrid();
	    
	    console.log('calcScanRoute');
	    
	    var longestWall = getLongestWall(rootCell);

        return rootCell;
	}
	/**
	 * Given the root cell to start at, search the room for the longest wall
	 * @param MapCell
	 * @returns Point
	 */
    function getLongestWall(rootCell) {
        
        var wallSearch = new WallSearch(rootCell, mapGrid);
        var longestWall = wallSearch.getLongestWall();
        
        return longestWall;
    
    }
	function calcRoutePoint(robotCtrPoint, endPoint, distance) {
						
		var measureLine = g.line(robotCtrPoint, endPoint );
		var routePoint  = calcDistFromEndPoint(measureLine, distance);
		
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
    	var centerX = robot.getCommand().x;
    	var centerY = robot.getCommand().y;
    	 
        mapGrid = new MapGrid(gridSize);
    	
    	// recursively create cells for whole room
    	//
        return createCell(centerX, centerY, 'main',0);
	}
	/**
	* recursively create cells for whole room
	*/
	function createCell(x, y, direction, level) {
    	
    	console.log('createCell start direction=' + direction + ' level=' + level + ' x=' + x + ' y=' + y);
	
        var mapCell = new MapCell( x, y, gridSize ); // Create mapCell object
        

        mapGrid.addCell( mapCell );
    	    	
        // Change color touching at south

        // If the cell corners goes beyond the room
        if ( ! walls.containsPoint( mapCell.lowerLeftCorner ) || ! walls.containsPoint( mapCell.lowerRightCorner ) ) {
        
            // If the square intesects with a wall, it's a wall
            if ( walls.intersects(mapCell.borders)  ) {
                mapCell.flagAsWall(); // Flag it as a wall cell
            }
            else {
                
                mapCell.flagAsDoorway();
            }
        }
        // If the cell already exists, use it
        else if ( mapGrid.get( x, y + gridSize )  ) {
        
            //mapmapGrid.cellSouth(cell) = mapGrid.get( x, y + gridSize );
        }
        else {
                
            createCell( x, y + gridSize, 'south', level + 1); // Create cell to south
        }
        
        
        // Change color touching at north
        if ( ! walls.containsPoint(mapCell.upperLeftCorner) || ! walls.containsPoint(mapCell.upperRightCorner) ) {
            
            // If the square intesects with a wall, it's a wall
            if ( walls.intersects(mapCell.borders)  ) {
            
                mapCell.flagAsWall(); // Flag it as a wall cell
            }
            else {
                
                mapCell.flagAsDoorway();
            }
        }
        // If the cell already exists, use it
        else if ( mapGrid.get( x, y - gridSize )  ) {
        
            //mapmapGrid.cellNorth(cell) = mapGrid.get( x, y - gridSize );
        }
        else {
            
            createCell( x, y - gridSize, 'north', level + 1); // Create cell to north
        }
        

        
        // Change color touching at east
        if ( ! walls.containsPoint(mapCell.upperRightCorner) || ! walls.containsPoint(mapCell.lowerRightCorner) ) {
            
            // If the square intesects with a wall, it's a wall
            if ( walls.intersects(mapCell.borders)  ) {
            
                mapCell.flagAsWall(); // Flag it as a wall cell
            }
            else {
                
                mapCell.flagAsDoorway();
            }
        }
        // If the cell already exists, use it
        else if ( mapGrid.get( x + gridSize, y ) ) {
        
            //mapmapGrid.cellEast(cell) = mapGrid.get( x + gridSize, y );
        }
        else {
            
            createCell( x + gridSize, y , 'east', level + 1); // Create cell east
        }
        

        
        // Change color touching at west
        if ( ! walls.containsPoint(mapCell.upperLeftCorner) || ! walls.containsPoint(mapCell.lowerLeftCorner) ) {
            
            if ( walls.intersects(mapCell.borders)  ) {
            
                mapCell.flagAsWall(); // Flag it as a wall cell
            }
            else {
                
                mapCell.flagAsDoorway();
            }
        }
        // If the cell already exists, use it
        else if ( mapGrid.get( x - gridSize, y ) ) {
        
            //mapmapGrid.cellWest(cell) = mapGrid.get( x - gridSize, y );
        }
        else {
            
            createCell( x - gridSize, y , 'west', level + 1); // Create cell east
        }
        
    	console.log('createCell end direction=' + direction + ' level=' + level + ' x=' + x + ' y=' + y + ' mapCell=',mapCell);

        return mapCell;
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
