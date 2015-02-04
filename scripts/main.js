
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


var canvas		= new Canvas("roomCanvas",400, 400);
var g = new Geometry();

var walls = [
		g.line(  g.point( 0, 0),                g.point(400/3,0)		), // Top wall left of door
		g.line(  g.point( 400 - 400/3, 0), g.point(400,0)		), // Top wall right of door
    	g.line(  g.point( 400, 0),            g.point(400,400)	), // Left wall
		g.line(  g.point( 400, 400),       g.point(0,400)		), // right wall
		g.line(  g.point( 0, 400),           g.point(0,0)			),  // bottom wall
		
		g.line(  g.point( 80, 80),           g.point(100, 80)			),  // box inside room top
		g.line(  g.point( 100, 80),           g.point(100, 100)			),  // box inside room left
		g.line(  g.point( 100, 100),           g.point(80, 100)			),  // box inside room bottom
		g.line(  g.point( 80, 100),           g.point(80, 80)			),  // box inside room right
];	
        
var room  		= new Room("room", walls,canvas);
var gridPaper  	= new GridPaper(400,400);
var robot 		= new Robot("robot",room);
robot.setPosition(200,200);
robot.setSize(25, 50);



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


function Navigator() {
	
	var self = this;
	
	/**
	* Given a x,y point, drive to that point
	*/
	self.driveToPoint = function(robot, destPoint) {
	
		console.log('Robot.driveToPoint destPoint=', destPoint);
		
		var robotLocPoint = Vector.create([robot.x,robot.y]);
		var robotProjectedPoint = calcPoint(robot.x, robot.y,robot.getHeadingDeg(), 200);
		
		var robotProjectedLine = Line.create(robotLocPoint,robotProjectedPoint);
		
		
		// Get angle of line
		var routeLine = Line.create( destPoint, Vector.create([robot.x, robot.y]) );
		
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
			
			return Vector.create([x2,y2]);
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
var mapRoom = new MapRoom(robot,canvas);
	robot.setPosition(200,200);
var nav = new Navigator();

var route = null;

//function completeMission() {


	// Get a map of the room until complete
	//
	while ( ! mapRoom.complete ) {
		
		mapRoom.scanInitial();
	}

	// if no route, get the route

	//else if ( route === null  ) {
		
		// Draw wall
		canvas.clear();
		
		route = mapRoom.calcScanRoute();
		
		console.log('got route',route);
		
	//}


/*
	// If there's more places to drive, drive there
	else if ( route.length > 0 ) {
		
		nav.driveToPoint(robot, route.pop() );
		
	}
*/

/*
	else {
    	canvas.clear(); 
		
		stopDriving();
	}
*/
	
//}


//var intRef = setInterval(completeMission,50);
//var intRef = setInterval(drive,1000);




