
function MapRoom(robot,canvas) {
	
	var self = this;
	var wallBuffer = 100; // Distance new routes will stay from wall
	var g = new Geometry();
	
	this.complete = false;
	var walls = new Walls();
	var turnDeg = 0;	
	
	
	/*
	* Scans room from initial position
	*/
	self.scanInitial = function() {
		
		var wallDist = null;

		if ( turnDeg <= 360 ) {
			
			turnDeg += 10;
			
			robot.turn(10);
		
			wallDist = robot.getWallDistance();
			console.log('wallDist = ' + wallDist);	
			
			var point = calcPoint(robot.getPoint().x ,robot.getPoint().y, wallDist, turnDeg);
			
			// Save wall location
			walls.addLine( point );
		}
		else {
			
			
			this.complete = true;
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
		
		//canvas.writeCoords( newPoint.x, newPoint.y);
		if (canvas) canvas.distanceEnd( newPoint.x, newPoint.y);

		return newPoint;
	}

	self.calcScanRoute = function() {
		
		var routePointArray = [];
		var robotCtrPoint = g.point( robot.x, robot.y);
		
		canvas.drawCircle(robot.x, robot.y, 16,'magenta');
		
		var polygonPad = new PolygonPad(walls);
		var paddingPolygon = polygonPad.getPaddingPolygon();
		

		for (var m = 0; m < paddingPolygon.en.length - 1; m +=2 ) {
			
			// Get the next line
			var start =  paddingPolygon.vertices[m];
			var end =  paddingPolygon.vertices[m + 1];
			
            console.log('MapRoom.calcScanRoute start=',start);
            console.log('MapRoom.calcScanRoute end=',end);
			
			canvas.drawLine( start.x, start.y, end.x,  end.y, 'blue' );

			//routePointArray.push(routePoint);
		}

		console.log('MapRoom.calcScanRoute end paddingPolygon=',paddingPolygon);

		return routePointArray;
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
}





function Walls() {
	
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
			
			combineLastTwo();
		}
	}
	/**
	* Check the last two entries, if they in a a strait line, combine into one
	* This reduces the number of points
	*/
	function combineLastTwo() {
		
		if ( lineArray.length > 1 ) {
		
			var last 	 = lineArray[ lineArray.length - 1 ];
			var previous = lineArray[ lineArray.length - 2 ];
			
			// If the starting point of the last line, and the ending point of the previous
			// are the same, combine into one line
			//
			
			if ( last.start.x === previous.end.x && last.start.y === previous.end.y && collinear( previous.start.x, previous.start.y, previous.end.x, previous.end.y, last.end.x, last.end.y) ) {
				
				
				previous.end.x = last.end.x;
				previous.end.y = last.end.y;
				
				lineArray.pop();
			}
		}
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

}
