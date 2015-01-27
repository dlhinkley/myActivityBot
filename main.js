
// http://www.helixsoft.nl/articles/circle/sincos.htm

// http://forums.coronalabs.com/topic/39094-code-for-rotated-rectangle-collision-detection/





/*

int main()                                    // main function
{
  drive_setRampStep(10);                      // 10 ticks/sec / 20 ms

  drive_ramp(128, 128);                       // Forward 2 RPS

  // While disatance greater than or equal
  // to 20 cm, wait 5 ms & recheck.
  while(ping_cm(8) >= 20) pause(5);           // Wait until object in range

  drive_ramp(0, 0);                           // Then stop

  // Turn in a random direction
  turn = rand() % 2;                          // Random val, odd = 1, even = 0

  if(turn == 1)                               // If turn is odd
    drive_speed(64, -64);                     // rotate right
  else                                        // else (if turn is even)
    drive_speed(-64, 64);                     // rotate left

  // Keep turning while object is in view
  while(ping_cm(8) < 20);                     // Turn till object leaves view

  drive_ramp(0, 0);                           // Stop & let program end
}

*/

var room  		= new Room("room", 400, 400);
var gridPaper  	= new GridPaper(room);
var robot 		= new Robot("robot",room);
robot.setPosition(200,200);
robot.setSize(25, 50);

var canvas		= new Canvas("roomCanvas",400, 400);


function pushForward() {
  
  robot.moveForward(1);
}

function pushBackward() {

  robot.moveBack(1);
}

function turnLeft() {

  robot.turn(-10);
}

function turnRight() {

  robot.turn(10);
}
function rad(deg) {
	
	return deg * Math.PI / 180;
}
/**
* returns true if all points are straight line
*/
function collinear( x1,  y1,  x2,  y2,  x3,  y3) {

	x1 = Math.round(x1);
	y1 = Math.round(y1);
	x2 = Math.round(x2);
	y2 = Math.round(y2);
	x3 = Math.round(x3);
	y3 = Math.round(y3);
	
  return (y1 - y2) * (x1 - x3) == (y1 - y3) * (x1 - x2);
}

function stopDriving() {

    clearInterval(intRef);
    
    console.log('stopDriving');
}


function drive() {
	
	console.log('drive start');
	
	robot.moveForward(5);
	var dist = robot.getWallDistance();
	
	if ( robot.hit  ) {
	
		console.log('drive hit');
		
		robot.moveBack(5);
		robot.turn(45);	
	}
	else if ( dist < 30 ) {
		
		console.log('drive turn');
		
		var maxDist = 0;
		var maxTurn = 0;
		
		canvas.clear();
		
		for (var m = 0; m < 360; m = m + 10 ) {
			
			robot.turn(10);	
			dist = robot.getWallDistance();		
			
			if ( dist > maxDist ) {
				
				maxDist = dist;
				maxTurn = m + 10;	
			}
			console.log('dist=' + dist + ' maxDist=' + maxDist + ' maxTurn=' + maxTurn);
		}
			
		robot.turn(maxTurn);

	}
	
	console.log('drive end');
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
		
		if ( lineArray.length > 2 ) {
		
			var last 	= lineArray[ lineArray.length - 1 ];
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
			 
			canvas.drawLine( lineArray[m].start.x, lineArray[m].start.y, lineArray[m].end.x,  lineArray[m].end.y, 'pink' );
			
			canvas.drawSquare( lineArray[m].start.x, lineArray[m].start.y, 8, 'pink' );
			canvas.drawSquare( lineArray[m].end.x, lineArray[m].end.y, 8, 'pink' );
			
		}
	}

}


function MapRoom() {
	
	var self = this;
	var wallBuffer = 100; // Distance new routes will stay from wall
	var g = new Geometry();
	
	this.complete = false;
	var walls = new Walls();
	var turnDeg = 0;	
	
	robot.setPosition(200,200);
	
	/*
	* Scans room from initial position
	*/
	self.scanInitial = function() {
		
		var wallDist = null;

		if ( turnDeg < 360 ) {
			
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
		canvas.distanceEnd( newPoint.x, newPoint.y);

		return newPoint;
	}
	
	self.calcScanRoute = function() {
		
		var routePointArray = [];
		var robotCtrPoint = g.point( robot.x, robot.y);
		
		canvas.drawCircle(robot.x, robot.y, 16,'magenta');
		
		for (var m = 0; m < walls.length(); m++ ) {
			
			// Get the next line
			var line = walls.get(m);
			
			// Make a new line to from the robot to the starting point on the line
			// get length of line
			
			var routePoint = calcRoutePoint(robotCtrPoint,line.start,wallBuffer);

			routePointArray.push(routePoint);
		}
		console.log('MapRoom.calcScanRoute end routePointArray=',routePointArray);

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
function Navigator() {
	
	var g = new Geometry();
	var self = this;
	
	/**
	* Given a x,y point, drive to that point
	*/
	self.driveToPoint = function(robot, destPoint) {
	
		console.log('Robot.driveToPoint destPoint=', destPoint);
		
		var robotLocPoint = g.point(robot.x,robot.y);
		var robotProjectedPoint = calcPoint(robot.x, robot.y,robot.getHeadingDeg(), 200);
		
		var robotProjectedLine = g.line(robotLocPoint,robotProjectedPoint);
		
		
		// Get angle of line
		var routeLine = g.line( destPoint, g.point(robot.x, robot.y) );
		
		var angleDeg = 180 + angleBetween2Lines(routeLine, robotProjectedLine );
		
		console.log('driveToPoint angleDeg=' + angleDeg );
		
		robot.turn(angleDeg);
		
		var driveLen = routeLine.length();
		
		console.log('driveToPoint driveLen=' + driveLen );
		
		robot.moveForward( driveLen );
		//var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
/*
		var lineAngle = routeLine.angle();
		var robotAngle = loc.heading.deg;
		var turnAngle = robotAngle + lineAngle;
*/
		
		//console.log('driveToPoint LineAngle=' + lineAngle + " robotAngle=" + robotAngle + " turnAngle=" + turnAngle);
		
		
		//self.turn( 
		
		// Calculate angle from current direction and turn
		
		// Calculate length of line and drive that length
		
		
	}
	function calcPoint(x,y,deg,distance) {
		
			var x10 = x
			var y10 = y

			var halfHeight = distance / 2;
			var halfWidth  = 0
			
			var radRotate = rad(deg)

			var radius = distance / 2;

			var angle = Math.asin( halfHeight / radius )


			x2 = x10 - radius * Math.cos(radRotate + angle); 
			y2 = y10 - radius * Math.sin(radRotate + angle);
			
			return g.point(x2,y2);
	}
	function angleBetween2Lines( line1,  line2)
    {
    	canvas.drawLine(line1.start.x,line1.start.y,line1.end.x, line1.end.y, 'red');
    	canvas.drawLine(line2.start.x,line2.start.y,line2.end.x, line2.end.y, 'red');
    	
        var angle1 = Math.atan2(line1.start.y - line1.end.y,
                                   line1.start.x - line1.end.x);
        var angle2 = Math.atan2(line2.start.y - line2.end.y,
                                   line2.start.x - line2.end.x);
        return (angle1 - angle2) * 180 / Math.PI;
    }
}

//var intRef = setInterval(drive,1000);
var mapRoom = new MapRoom();
var nav = new Navigator();

var route = null;

function completeMission() {

	var g = new Geometry();

	
	// Get a map of the room until complete
	//
	if ( ! mapRoom.complete ) {
		
		mapRoom.scanInitial();
	}
	// if no route, get the route
	else if ( route === null  ) {
		
		console.log('route=' + route);
		// Draw wall
		canvas.clear();
		mapRoom.getWalls().plotWalls();
		
		route = mapRoom.calcScanRoute();
		
		console.log('got route',route);
		
	}

	// If there's more places to drive, drive there
	else if ( route.length > 0 ) {
		
		nav.driveToPoint(robot, route.pop() );
		
	}

	else {
		
		stopDriving();
	}
	
}


//var intRef = setInterval(completeMission,50);
var intRef = setInterval(drive,1000);




