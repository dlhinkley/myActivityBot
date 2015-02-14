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
    		if (canvas) canvas.clear();
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
    	var centerX = robot.x;
    	var centerY = robot.y;
    	 
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

	/**
	* Map Grid object
	*/
    function MapGrid( gridSizeIn ) {
        
        var self = this;
        var gridSize = gridSizeIn;
        var maxX  = 20;
        var maxY  = 20;
        this.cells = new Array(maxX);
        

        // Init grid
        for (var x = 0; x < maxX; x++) {
                
            self.cells[x] = new Array(maxY);
        }
        function adjX(x) {
            
            return (x / gridSize);
        }
        function adjY(y) {
            
            return (y / gridSize);
        }
        
        self.addCell = function( mapCell ) {
            
            this.cells[ adjX(mapCell.x) ][ adjY(mapCell.y) ] = mapCell;
        }
        
        self.cellWest = function(cell) {
            
            var x = adjX(cell.x) - 1;
            var y = adjY(cell.y);
            
            return getCell(x, y);
        }
        self.cellEast = function(cell) {
            
            var x = adjX(cell.x) + 1;
            var y = adjY(cell.y);
            
            return getCell(x, y);
        }
        self.cellSouth = function(cell) {
            
            var x = adjX(cell.x);
            var y = adjY(cell.y) + 1;
            
            return getCell(x, y);
        }
        function getCell(x, y) {
            
            console.log('MapGrid.getCell x=' + x + ' y=' + y + ' cells=',self.cells);
            var cellOut = null;
            
            if ( x > 0 && x < self.cells.length && y > 0 && y < self.cells[x].length ) {
            
                cellOut = self.cells[ x ][ y ];
            }
            return cellOut;             
            
        }
        self.cellNorth = function(cell) {
            
            var x = adjX(cell.x);
            var y = adjY(cell.y) - 1;
            
            return getCell(x, y);
        }
        self.clearAllPathStep = function() {
            
            for (var x = 0; x < maxX; x++ ) {
                
                for (var y = 0; y < maxY; y++ ) {
                    
                    self.cells[x][y].pathStep = null;
                }
            }
        }
        
        
        self.get = function( x, y) {
            
            console.log('MapGrid.get x=' + x + ' y=' + y + ' x/gridSize=' + x / gridSize + ' y/gridSize=' + y/gridSize );
    
            return self.cells[ adjX( x ) ][ adjY( y ) ];
        }
    }
    /**
    * Map Cell object
    */
    function MapCell(x, y, size ) {
        
    	console.log('MapCell start x=' + x + ' y=' + y);

        var isWall = false;
        var isDoorway = false;
        
        this.pathStep = null;
        this.x = x;
        this.y = y;

        
        this.directions = ['cellNorth','cellSouth','cellWest','cellEast'];

        
                // Define the points of the cell
        this.lowerLeftCorner  = g.point( x - (gridSize/2), y + (gridSize/2) );
        this.lowerRightCorner = g.point( x + (gridSize/2), y + (gridSize/2) );
        this.upperLeftCorner  = g.point( x - (gridSize/2), y - (gridSize/2) );
        this.upperRightCorner = g.point( x + (gridSize/2), y - (gridSize/2) );
        
        // Get the lines of the cell
        this.upperLine = g.line( this.upperLeftCorner, this.upperRightCorner );
        this.leftLine  = g.line( this.upperLeftCorner, this.lowerLeftCorner  );
        this.lowerLine = g.line( this.lowerLeftCorner, this.lowerRightCorner );
        this.rightLine = g.line( this.upperRightCorner,this.lowerRightCorner );
        
        // Li
        this.borders = [this.upperLine, this.leftLine, this.lowerLine, this.rightLine ];
        
        if (canvas) canvas.drawBox(x, y, gridSize, '#00FF00');
        
        /**
        * Flag as Doorway
        */
        this.flagAsDoorway = function() {
                      
            clearFlags();           
            isDoorway = true;
            if (canvas) canvas.drawSquare(this.x, this.y, gridSize, '#999999');
        };
        this.isDoorway = function() {
            
            return isDoorway;
        }
        
        this.flagAsWall = function() {
                      
            clearFlags();           
            isWall = true;
          if (canvas) canvas.drawSquare(this.x, this.y, gridSize, '#FF0000');
        };
        this.isWall = function() {
            
            return isWall;
        }
        function clearFlags() {
            
            isWall = false;
            isDoorway = false;
        }
        this.flagAsPath = function(step) {
            
            this.pathStep = step;
            if (canvas) canvas.drawSquare(this.x, this.y, gridSize, '#0000FF');
            if (canvas) canvas.writeText(this.x, this.y, step,'#FFFFFF', '30px');
            
            console.log('Canvas.flagAsPath this.x=' + this.x + ' this.y=' + this.y);
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

function FindRoute(beginCell, endCell, mapGrid) {
    
    
}
/**
* object for searchin for wall
*/
function WallSearch(beginCell, mapGrid, canvas) {
  
  var self = this;
  var maxLength = 0;
  var longWallCell = null;
  self.beginCell = beginCell;
  self.mapGrid = mapGrid;
  
  
  /**
  * Recusively search for longest wall and return a cell next to the wall
  */
  self.getLongestWall = function() {
  	
      maxLength = 0;
      longWallCell = null;
      
  	searchWall(self.beginCell);
  	
  	return longWallCell;
  }
  self.getMaxLength = function() {
      
      return maxLength;
  }

  /**
   * Recursivly search for wall
   */
  function searchWall(cellIn) {

    console.log('WallSearch.searchWall start cell=',cellIn);
  
    var queue = [];
    queue.push(cellIn); // Initialize que
    
      
    while ( queue.length > 0 ) {
        
        // Get current cell to check
        var cell = queue.shift();
        
        console.log('WallSearch.searchWall loop cell=',cell);
        
        // Save the children of cell
        var northCell = self.mapGrid.cellNorth( cell );
        var eastCell  = self.mapGrid.cellEast(  cell );
        var southCell = self.mapGrid.cellSouth( cell );
        var westCell  = self.mapGrid.cellWest(  cell );   
        
        if ( northCell && northCell.pathStep === null )  queue.push( northCell );
        if ( eastCell  && eastCell.pathStep  === null )  queue.push( eastCell );
        if ( southCell && southCell.pathStep === null )  queue.push( southCell );
        if ( westCell  && westCell.pathStep  === null )  queue.push( westCell );

        cell.pathStep = 1;
          
          
        if ( cell.isWall() ) {
          
          checkWallLength( cell );
        }
    }
  }
  function inQueue(queue, cell) {
      
      var found = false;
      var m = 0;
      
      while ( ! found && m < queue.length ) {

          if ( queue[m].x === cell.x && queue[m].y === cell.y ) {
              
              found = true;
          }
          
          m++;
      }
      return found;
  }

  /**
   * Given a cell that is a wall, return how many cell long it is
   */
  function checkWallLength(cell) {
      
      console.log('WallSearch.checkWallLength start cell=' , cell);
      var length = 1;
      
      // It's a North South Wall
      if ( self.mapGrid.cellNorth(cell) && self.mapGrid.cellNorth(cell).isWall() && self.mapGrid.cellSouth(cell) && self.mapGrid.cellSouth(cell).isWall() ) {
          
          length += getNorthLength( self.mapGrid.cellNorth(cell) );
          length += getSouthLength( self.mapGrid.cellSouth(cell) );
          
          if ( length > maxLength ) {
              
              maxLength = length;
              longWallCell = cell;
          }
      }
      // It's a East West Wall
      if ( self.mapGrid.cellEast(cell) && self.mapGrid.cellEast(cell).isWall() && self.mapGrid.cellWest(cell) && self.mapGrid.cellWest(cell).isWall() ) {
          
          length += getEastLength( self.mapGrid.cellEast(cell) );
          length += getWestLength( self.mapGrid.cellWest(cell) );
          
          if ( length > maxLength ) {
              
              maxLength = length;
              longWallCell = cell;
          }
      }
  }
  function getNorthLength(cell) {
       
      var length = 1;
      
      if ( self.mapGrid.cellNorth(cell) && self.mapGrid.cellNorth(cell).isWall() ) {
          
          length += getNorthLength( self.mapGrid.cellNorth(cell) );
      }
      return length;
  }
  function getSouthLength(cell) {
       
      var length = 1;
      
      if ( self.mapGrid.cellSouth(cell) && self.mapGrid.cellSouth(cell).isWall() ) {
          
          length += getSouthLength( self.mapGrid.cellSouth(cell) );
      }
      return length;
  }
  function getEastLength(cell) {
       
      var length = 1;
      
      if ( self.mapGrid.cellEast(cell) && self.mapGrid.cellEast(cell).isWall() ) {
          
          length += getEastLength( self.mapGrid.cellEast(cell) );
      }
      return length;
  }
  function getWestLength(cell) {
       
      var length = 1;
      
      if ( self.mapGrid.cellWest(cell) && self.mapGrid.cellWest(cell).isWall() ) {
          
          length += getWestLength( self.mapGrid.cellWest(cell) );
      }
      return length;
  }


}
