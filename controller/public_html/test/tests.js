'use strict';

QUnit.test("Command", function(assert) {
    
    var text = "command=update,x=100.000,y=250.000,heading=180.00,ping=15,turet=25,scan=65\n";
    
    var cmd = new Command(text);
    
    assert.equal( cmd.x, 100, 'x');
    assert.equal( cmd.y, 250, 'x');
    assert.equal( cmd.heading, 180, 'x');
    assert.equal( cmd.ping, 15, 'x');
    assert.equal( cmd.turet, 25, 'x');
    
});


QUnit.test( "room.isHitWall right on", function( assert ) {

    var g = new Geometry();

    var width = 200;
    var height = 300;
    var walls = [
		g.line(  g.point( 0,     0),            g.point(width, 0)		), // Top wall
    	g.line(  g.point( width, 0),            g.point(width, height)	), // Left wall
		g.line(  g.point( width, height),       g.point(0,     height)		), // right wall
		g.line(  g.point( 0,     height),       g.point(0,     0)			),  // bottom wall
];	

    var room = new Room(null,walls, null);
    
    
    // Detect any hit
    var dim =  {
                "tl": { "x": 10, "y": 0 },
                "tr": { "x": 15, "y": 0 },
                "bl": { "x": 10, "y": 10 },
                "br": { "x": 15, "y": 10 },
    };
    assert.ok( room.isHitWall(dim), "All Zeros");
    
    // Detect no hit
    var dim =  {
                "tl": { "x": 50, "y": 25 },
                "tr": { "x": 50, "y": 50 },
                "bl": { "x": 100, "y": 25 },
                "br": { "x": 100, "y": 50 },
    };
    assert.ok( ! room.isHitWall(dim), "Middle of room" );
    

    
    var dim =  {
                "tl": { "x": 50, "y": 25 },
                "tr": { "x": width, "y": 50 },
                "bl": { "x": 100, "y": 25 },
                "br": { "x": 100, "y": 50 },
    };
    assert.ok( room.isHitWall(dim), "Top Right x Hit" );
    
    var dim =  {
                "tl": { "x": 50, "y": 25 },
                "tr": { "x": 50, "y": height },
                "bl": { "x": 100, "y": 25 },
                "br": { "x": 100, "y": 50 },
    };
    assert.ok( room.isHitWall(dim), "Top Right y Hit" );
    
    var dim =  {
                "tl": { "x": 50, "y": 25 },
                "tr": { "x": 50, "y": 50 },
                "bl": { "x": width, "y": 25 },
                "br": { "x": 100, "y": 50 },
    };
    assert.ok( room.isHitWall(dim), "Bottom Left x Hit" );
    
    var dim =  {
                "tl": { "x": 50, "y": 25 },
                "tr": { "x": 50, "y": 50 },
                "bl": { "x": 100, "y": height },
                "br": { "x": 100, "y": 50 },
    };
    assert.ok( room.isHitWall(dim), "Bottom Left y Hit" );
    
    
    var dim =  {
                "tl": { "x": 50, "y": 25 },
                "tr": { "x": 50, "y": 50 },
                "bl": { "x": 100, "y": 25 },
                "br": { "x": 100, "y": height },
    };
    assert.ok( room.isHitWall(dim), "Bottom right y Hit" );
      
    
    var dim =  {
                "tl": { "x": 50, "y": 25 },
                "tr": { "x": 50, "y": 50 },
                "bl": { "x": 100, "y": 25 },
                "br": { "x": width, "y": 50 },
    };
    assert.ok( room.isHitWall(dim), "Bottom right x Hit" );
    
});


QUnit.test( "room.isHitWall past wall", function( assert ) {

    var width = 200;
    var height = 300;
    var g = new Geometry();
    var walls = [
		g.line(  g.point( 0,     0),            g.point(width, 0)		), // Top wall
    	g.line(  g.point( width, 0),            g.point(width, height)	), // Left wall
		g.line(  g.point( width, height),       g.point(0,     height)		), // right wall
		g.line(  g.point( 0,     height),       g.point(0,     0)			),  // bottom wall
];	
    var room = new Room(null,walls, null);
    
    width += 50;
    height += 50;
    
    // Detect any hit
    var dim =  {
                "tl": { "x": 10, "y": 0 },
                "tr": { "x": 15, "y": 0 },
                "bl": { "x": 10, "y": 10 },
                "br": { "x": 15, "y": 10 },
    };
    assert.ok( room.isHitWall(dim), "All Zeros");
    
    // Detect no hit
    var dim =  {
                "tl": { "x": 50, "y": 25 },
                "tr": { "x": 50, "y": 50 },
                "bl": { "x": 100, "y": 25 },
                "br": { "x": 100, "y": 50 },
    };
    assert.ok( ! room.isHitWall(dim), "Middle of room" );
    
    
    var dim =  {
                "tl": { "x": 50, "y": 25 },
                "tr": { "x": width, "y": 50 },
                "bl": { "x": 100, "y": 25 },
                "br": { "x": 100, "y": 50 },
    };
    assert.ok( room.isHitWall(dim), "Top Right x Hit" );
    
    var dim =  {
                "tl": { "x": 50, "y": 25 },
                "tr": { "x": 50, "y": height },
                "bl": { "x": 100, "y": 25 },
                "br": { "x": 100, "y": 50 },
    };
    assert.ok( room.isHitWall(dim), "Top Right y Hit" );
    
    var dim =  {
                "tl": { "x": 50, "y": 25 },
                "tr": { "x": 50, "y": 50 },
                "bl": { "x": width, "y": 25 },
                "br": { "x": 100, "y": 50 },
    };
    assert.ok( room.isHitWall(dim), "Bottom Left x Hit" );
    
    var dim =  {
                "tl": { "x": 50, "y": 25 },
                "tr": { "x": 50, "y": 50 },
                "bl": { "x": 100, "y": height },
                "br": { "x": 100, "y": 50 },
    };
    assert.ok( room.isHitWall(dim), "Bottom Left y Hit" );
    
    
    var dim =  {
                "tl": { "x": 50, "y": 25 },
                "tr": { "x": 50, "y": 50 },
                "bl": { "x": 100, "y": 25 },
                "br": { "x": 100, "y": height },
    };
    assert.ok( room.isHitWall(dim), "Bottom right y Hit" );
      
    
    var dim =  {
                "tl": { "x": 50, "y": 25 },
                "tr": { "x": 50, "y": 50 },
                "bl": { "x": 100, "y": 25 },
                "br": { "x": width, "y": 50 },
    };
    assert.ok( room.isHitWall(dim), "Bottom right x Hit" );
    
});






QUnit.test( "room.calcBeamDestination", function( assert ) {

    var width = 200;
    var height = 200;
    var g = new Geometry();
    var walls = [
		g.line(  g.point( 0,     0),            g.point(width, 0)		), // Top wall
    	g.line(  g.point( width, 0),            g.point(width, height)	), // Left wall
		g.line(  g.point( width, height),       g.point(0,     height)		), // right wall
		g.line(  g.point( 0,     height),       g.point(0,     0)			),  // bottom wall
        ];	
    var room = new Room(null,walls, null);
     
    
    assert.equal( Math.round( room.calcBeamDestination(100,100,0).x ), 100, "Middle of room north x" );
    assert.equal( Math.round( room.calcBeamDestination(100,100,0).y ), -223, "Middle of room north y" );
    assert.equal( Math.round( room.calcBeamDestination(100,100,360).x ), 100, "Middle of room north x" );
    assert.equal( Math.round( room.calcBeamDestination(100,100,360).y ), -223, "Middle of room north y" );
    
    assert.equal( Math.round( room.calcBeamDestination(100,100,90).x ), 423, "Middle of room east x" );
    assert.equal( Math.round( room.calcBeamDestination(100,100,90).y ), 100, "Middle of room east y" );
    
    assert.equal( Math.round( room.calcBeamDestination(100,100,180).x ), 100, "Middle of room south x" );
    assert.equal( Math.round( room.calcBeamDestination(100,100,180).y ), 423, "Middle of room south y" );
    
    assert.equal( Math.round( room.calcBeamDestination(100,100,270).x ), -223, "Middle of room west x" );
    assert.equal( Math.round( room.calcBeamDestination(100,100,270).y ), 100, "Middle of room west y" );
});



QUnit.test( "room.getWallDistance", function( assert ) {

    var width = 200;
    var height = 200;
    var g = new Geometry();
    var walls = [
		g.line(  g.point( 0,     0),            g.point(width, 0)		), // Top wall
    	g.line(  g.point( width, 0),            g.point(width, height)	), // Left wall
		g.line(  g.point( width, height),       g.point(0,     height)		), // right wall
		g.line(  g.point( 0,     height),       g.point(0,     0)			),  // bottom wall
];	
    var room = new Room(null,walls, null);
     
    assert.equal( Math.round( room.getWallDistance(100,100,0) ), 100, "Middle of room north" );
    assert.equal( Math.round( room.getWallDistance(100,100,360) ), 100, "Middle of room north" );
    assert.equal( Math.round( room.getWallDistance(100,100,90) ), 100, "Middle of room east" );
    assert.equal( Math.round( room.getWallDistance(100,100,180) ), 100, "Middle of room south" );
    assert.equal( Math.round( room.getWallDistance(100,100,270) ), 100, "Middle of room west" );
    
    width = 300;
    height = 500;
    var walls = [
		g.line(  g.point( 0,     0),            g.point(width, 0)		), // Top wall
    	g.line(  g.point( width, 0),            g.point(width, height)	), // Left wall
		g.line(  g.point( width, height),       g.point(0,     height)		), // right wall
		g.line(  g.point( 0,     height),       g.point(0,     0)			),  // bottom wall
];	
    var room = new Room(null,walls, null);
    
    assert.equal( Math.round( room.getWallDistance(150, 200,0) ), 200, "Middle of room north" );
    assert.equal( Math.round( room.getWallDistance(150, 200,360) ), 200, "Middle of room north" );
    assert.equal( Math.round( room.getWallDistance(150, 200,90) ), 150, "Middle of room east" );
    assert.equal( Math.round( room.getWallDistance(150, 200,180) ), 300, "Middle of room south" );
    assert.equal( Math.round( room.getWallDistance(150, 200,270) ), 150, "Middle of room west" ); 
    
});




QUnit.test( "mapRoom", function( assert ) {

    var width = 400;
    var height = 400;
    var g = new Geometry();
    
    var walls = [
		g.line(  g.point( 0,     0),            g.point(width, 0)		), // Top wall
    	g.line(  g.point( width, 0),            g.point(width, height)	), // Left wall
		g.line(  g.point( width, height),       g.point(0,     height)		), // right wall
		g.line(  g.point( 0,     height),       g.point(0,     0)			),  // bottom wall
];	
    var room    = new Room(null,walls, null);
    var robot   = new SimulatedRobot(null,room);
    var mapRoom = new MapRoom(robot,null);
    
    robot.setPosition(200,200);
    robot.setSize(25, 50);

    assert.ok( typeof room     === "object", "Room defined");
    assert.ok( typeof robot    === "object", "SimulatedRobot defined");
    assert.ok( typeof mapRoom  === "object", "MapRoom defined");
    
    while ( ! mapRoom.complete ) {
		
		mapRoom.scanInitial();
	}
    assert.equal(mapRoom.getWalls().length() , 36, "Wall length");
/*
    	
    assert.equal( Math.round( mapRoom.getWalls().get(0).start.x ), 231, "Wall 0 start x");
    assert.equal( Math.round( mapRoom.getWalls().get(0).start.y ), 0, "Wall 0 start y");
    assert.equal( Math.round( mapRoom.getWalls().get(0).end.x ), 362, "Wall 0 end x");
    assert.equal( Math.round( mapRoom.getWalls().get(0).end.y ), 0, "Wall 0 end y");
    	
    assert.equal( Math.round( mapRoom.getWalls().get(1).start.x ), 362, "Wall 1 start x");
    assert.equal( Math.round( mapRoom.getWalls().get(1).start.y ), 0, "Wall 1 start y");
    assert.equal( Math.round( mapRoom.getWalls().get(1).end.x ), 400, "Wall 1 end x");
    assert.equal( Math.round( mapRoom.getWalls().get(1).end.y ), 27, "Wall 1 end y");   	
    	
    assert.equal( Math.round( mapRoom.getWalls().get(2).start.x ), 400, "Wall 2 start x");
    assert.equal( Math.round( mapRoom.getWalls().get(2).start.y ), 27, "Wall 2 start y");
    assert.equal( Math.round( mapRoom.getWalls().get(2).end.x ), 400, "Wall 2 end x");
    assert.equal( Math.round( mapRoom.getWalls().get(2).end.y ), 362, "Wall 2 end y");
    	
    assert.equal( Math.round( mapRoom.getWalls().get(3).start.x ), 400, "Wall 3 start x");
    assert.equal( Math.round( mapRoom.getWalls().get(3).start.y ), 362, "Wall 3 start y");
    assert.equal( Math.round( mapRoom.getWalls().get(3).end.x ), 373, "Wall 3 end x");
    assert.equal( Math.round( mapRoom.getWalls().get(3).end.y ), 400, "Wall 3 end y");
    	
    assert.equal( Math.round( mapRoom.getWalls().get(4).start.x ), 373, "Wall 4 start x");
    assert.equal( Math.round( mapRoom.getWalls().get(4).start.y ), 400, "Wall 4 start y");
    assert.equal( Math.round( mapRoom.getWalls().get(4).end.x ), 38, "Wall 4 end x");
    assert.equal( Math.round( mapRoom.getWalls().get(4).end.y ), 400, "Wall 4 end y");
    	
    assert.equal( Math.round( mapRoom.getWalls().get(5).start.x ), 38, "Wall 5 start x");
    assert.equal( Math.round( mapRoom.getWalls().get(5).start.y ), 400, "Wall 5 start y");
    assert.equal( Math.round( mapRoom.getWalls().get(5).end.x ), 0, "Wall 5 end x");
    assert.equal( Math.round( mapRoom.getWalls().get(5).end.y ), 373, "Wall 5 end y");
    	
    assert.equal( Math.round( mapRoom.getWalls().get(6).start.x ), 0, "Wall 6 start x");
    assert.equal( Math.round( mapRoom.getWalls().get(6).start.y ), 373, "Wall 6 start y");
    assert.equal( Math.round( mapRoom.getWalls().get(6).end.x ), 0, "Wall 6 end x");
    assert.equal( Math.round( mapRoom.getWalls().get(6).end.y ), 38, "Wall 6 end y");
    	
    assert.equal( Math.round( mapRoom.getWalls().get(7).start.x ), 0, "Wall 7 start x");
    assert.equal( Math.round( mapRoom.getWalls().get(7).start.y ), 38, "Wall 7 start y");
    assert.equal( Math.round( mapRoom.getWalls().get(7).end.x ), 27, "Wall 7 end x");
    assert.equal( Math.round( mapRoom.getWalls().get(7).end.y ), 0, "Wall 7 end y");
    	
    assert.equal( Math.round( mapRoom.getWalls().get(8).start.x ), 27, "Wall 8 start x");
    assert.equal( Math.round( mapRoom.getWalls().get(8).start.y ), 0, "Wall 8 start y");
    assert.equal( Math.round( mapRoom.getWalls().get(8).end.x ), 231, "Wall 8 end x");
    assert.equal( Math.round( mapRoom.getWalls().get(8).end.y ), 0, "Wall 8 end y");
    	
*/
});


QUnit.test( "lineAngleDeg", function( assert ) {

    //var canvas = new Canvas("graph",400, 400);

	var g = new Geometry();


	var line = g.line( g.point(100, 100), g.point(100, 50));
	assert.equal( lineAngleDeg(line) , 0, "line north angle");
	
	
	assert.equal(line.length(), 50, "line length");	


	var line = g.line(  g.point(50, 100), g.point(100, 50));
	assert.equal( lineAngleDeg(line) , 45, "line north east angle");

	var line = g.line( g.point(50, 50), g.point(100, 50));
	assert.equal( lineAngleDeg(line) , 90, "line east angle");

	var line = g.line( g.point(50, 50), g.point(100, 100));
	assert.equal( lineAngleDeg(line) , 135, "line south east angle");
		
	var line = g.line( g.point(100,50), g.point(100,100));		
	assert.equal( lineAngleDeg(line) , 180, "line south angle");

	var line = g.line(g.point(100, 50),  g.point(50, 100));
	assert.equal( lineAngleDeg(line) , 225, "line south west angle");

	var line = g.line(g.point(100, 50), g.point(50, 50));
	assert.equal( lineAngleDeg(line) , 270, "line west angle");
	
	var line = g.line(g.point(100, 100),  g.point(50, 50));
	assert.equal( lineAngleDeg(line) , 315, "line north west angle");


	var line = g.line( g.point(100, 100), g.point(90, 50));
	assert.equal( Math.round( lineAngleDeg(line) ) , 349, "line short of north angle");


	var line = g.line( g.point(100, 100), g.point(95, 50));
	assert.equal( Math.round( lineAngleDeg(line) ), 354, "line short of north angle");

});



QUnit.test( "MapGrid", function( assert ) {

    var mapGrid = new MapGrid(1,2,2);
    
    assert.equal( mapGrid.cells.length, 2, "x size of grid");
    assert.equal( mapGrid.cells[1].length, 2, "y size of grid");
    
    var upperLeftCorner =  new MapCell(0,0,1);
    var upperRightCorner =  new MapCell(1,0,1);
    var lowerLeftCorner =  new MapCell(0,1,1);
    var lowerRightCorner =  new MapCell(1,1,1);
    
    mapGrid.addCell(upperRightCorner);
    mapGrid.addCell(upperLeftCorner);
    mapGrid.addCell(lowerRightCorner);
    mapGrid.addCell(lowerLeftCorner);
    
    assert.equal( mapGrid.cellNorth( upperLeftCorner ), null, 'upperLeftCorner north');
    assert.equal( mapGrid.cellEast( upperLeftCorner ).x, 1, 'upperLeftCorner east x');
    assert.equal( mapGrid.cellEast( upperLeftCorner ).y, 0, 'upperLeftCorner east y');
    assert.equal( mapGrid.cellSouth( upperLeftCorner ).x, 0, 'upperLeftCorner south x');
    assert.equal( mapGrid.cellSouth( upperLeftCorner ).y, 1, 'upperLeftCorner south y');
    assert.equal( mapGrid.cellWest( upperLeftCorner ), null, 'upperLeftCorner west');
    
    
    assert.equal( mapGrid.cellNorth( upperRightCorner ), null, 'upperRightCorner north');
    assert.equal( mapGrid.cellEast( upperRightCorner ), null, 'upperRightCorner east');
    assert.equal( mapGrid.cellSouth( upperRightCorner ).y, 1, 'upperRightCorner south y');
    assert.equal( mapGrid.cellSouth( upperRightCorner ).x, 1, 'upperRightCorner south x');
    assert.equal( mapGrid.cellWest( upperRightCorner ).x, 0, 'upperRightCorner west x');
    assert.equal( mapGrid.cellWest( upperRightCorner ).y, 0, 'upperRightCorner west y');
    
    assert.equal( mapGrid.cellNorth( lowerLeftCorner ).x, 0, 'lowerLeftCorner north x');
    assert.equal( mapGrid.cellNorth( lowerLeftCorner ).y, 0, 'lowerLeftCorner north y');
    assert.equal( mapGrid.cellEast( lowerLeftCorner ).x, 1, 'lowerLeftCorner east x');
    assert.equal( mapGrid.cellEast( lowerLeftCorner ).y, 1, 'lowerLeftCorner east y');
    assert.equal( mapGrid.cellSouth( lowerLeftCorner ), null, 'lowerLeftCorner south');
    assert.equal( mapGrid.cellWest( lowerLeftCorner ), null, 'lowerLeftCorner west');
    
    
    assert.equal( mapGrid.cellNorth( lowerRightCorner ).x, 1, 'lowerRightCorner north x');
    assert.equal( mapGrid.cellNorth( lowerRightCorner ).y, 0, 'lowerRightCorner north y');
    assert.equal( mapGrid.cellEast( lowerRightCorner ), null, 'lowerRightCorner east');
    assert.equal( mapGrid.cellSouth( lowerRightCorner ), null, 'lowerRightCorner south');
    assert.equal( mapGrid.cellWest( lowerRightCorner ).x, 0, 'lowerRightCorner west x');
    assert.equal( mapGrid.cellWest( lowerRightCorner ).y, 1, 'lowerRightCorner west y');
    
    mapGrid.clearAllPathStep();
    
    assert.equal( upperLeftCorner.pathStep, null, 'upperLeftCorner pathStep');
    assert.equal( lowerRightCorner.pathStep, null, 'lowerRightCorner pathStep');
    assert.equal( lowerLeftCorner.pathStep, null, 'lowerLeftCorner pathStep');
    assert.equal( upperRightCorner.pathStep, null, 'upperRightCorner pathStep');

   
});



QUnit.test( "maproom.calcScanRoute 200x200", function( assert ) {

    var width = 200;
    var height = 200;
    var g = new Geometry();
    
    var walls = [
		g.line(  g.point( 0,     0),            g.point(width, 0)		), // Top wall
    	g.line(  g.point( width, 0),            g.point(width, height)	), // Left wall
		g.line(  g.point( width, height),       g.point(0,     height)		), // right wall
		g.line(  g.point( 0,     height),       g.point(0,     0)			),  // bottom wall
    ];	
            
    var room  		= new Room(null, walls,null);
    var robot 		= new SimulatedRobot(null,room);
    robot.setPosition(100,100);
    robot.setSize(25, 50);
    
    var mapRoom = new MapRoom(robot,null);

    var route = null;

	while ( ! mapRoom.complete ) {
		
		mapRoom.scanInitial();
	}
	
	assert.ok(mapRoom.complete  , "Room navigation complete");

	var robotCell = mapRoom.calcScanRoute();
	var mapGrid = mapRoom.getMapGrid();
	
	console.log('robotCell=',robotCell);
	
	assert.equal( robotCell.x , 100, "SimulatedRobot cell x");
	assert.equal( robotCell.y , 100, "SimulatedRobot cell y");
	
	// Cells around robot
	var cellEast = mapGrid.cellEast(robotCell);
	assert.equal( cellEast.x , 150, "Cell to east of robot x");
	assert.equal( cellEast.y , 100, "Cell to east of robot y");

    var cellWest =  mapGrid.cellWest(robotCell);
	assert.equal( cellWest.x , 50, "Cell to west of robot x");
	assert.equal( cellWest.y , 100, "Cell to west of robot y");

    var cellNorth =  mapGrid.cellNorth(robotCell);
	assert.equal( cellNorth.x , 100, "Cell to north of robot x");
	assert.equal( cellNorth.y , 50, "Cell to north of robot y");

    var cellSouth = mapGrid.cellSouth(robotCell);
	assert.equal( cellSouth.x , 100, "Cell to south of robot x");
	assert.equal( cellSouth.y , 150, "Cell to south of robot y");

    // Walls around robot
    var cellEastEast = mapGrid.cellEast( cellEast );
	assert.equal( cellEastEast.x , 200, "Cell to east east of robot x");
	assert.equal( cellEastEast.y , 100, "Cell to east east of robot y");
	assert.ok(    cellEastEast.isWall() , "Cell to east east of robot wall");

    var cellWestWest = mapGrid.cellWest( cellWest );
	assert.equal( cellWestWest.x , 0, "Cell to west west of robot x");
	assert.equal( cellWestWest.y , 100, "Cell to west west of robot y");
	assert.ok(    cellWestWest.isWall() , "Cell to west west of robot wall");

	assert.equal( mapGrid.cellNorth( mapGrid.cellNorth(robotCell)).x , 100, "Cell to north north of robot x");
	assert.equal( mapGrid.cellNorth( mapGrid.cellNorth(robotCell)).y , 0, "Cell to north north of robot y");
	assert.ok( mapGrid.cellNorth( mapGrid.cellNorth(robotCell)).isWall() , "Cell to north north of robot wall");

	assert.equal( mapGrid.cellSouth( mapGrid.cellSouth(robotCell)).x , 100, "Cell to south south of robot x");
	assert.equal( mapGrid.cellSouth( mapGrid.cellSouth(robotCell)).y , 200, "Cell to south south of robot y");
	assert.ok( mapGrid.cellSouth( mapGrid.cellSouth(robotCell)).isWall() , "Cell to south south of robot wall");


    var wallSearch = new WallSearch(robotCell, mapGrid);
    var longestWallCell = wallSearch.getLongestWall();

    
	assert.ok( longestWallCell.x > 0 && longestWallCell.x < 500, "Longest wall x");
	assert.equal( longestWallCell.y , 0, "Longest wall y");
    
    var getMaxLength = wallSearch.getMaxLength();
    assert.equal( getMaxLength , 3, "Longest wall length");

    // Find the route
    var findRoute = new FindRoute(mapGrid);
    var route = findRoute.getRoute(robotCell, longestWallCell);
    
    console.log('mapGrid.dump()=' + mapGrid.dump());

    assert.equal( route.length , 1, "route.length");
    assert.equal( route[0].x , 100, "route x");
    assert.equal( route[0].y , 50, "route y");
    
});


QUnit.test( "maproom.calcScanRoute 400x500", function( assert ) {

    var g = new Geometry();
    
    var walls = [
    		g.line(  g.point( 0, 0),                g.point(500/3,0)		), // Top wall left of door
    		g.line(  g.point( 500 - 500/3, 0), g.point(500,0)		), // Top wall right of door
        	g.line(  g.point( 500, 0),            g.point(500,400)	), // Left wall
    		g.line(  g.point( 500, 400),       g.point(0,400)		), // right wall
    		g.line(  g.point( 0, 400),           g.point(0,0)			),  // bottom wall
    ];		
            
    var room  		= new Room(null, walls,null);
    var robot 		= new SimulatedRobot(null,room);
    robot.setPosition(200,200);
    robot.setSize(25, 50);

    
    var mapRoom = new MapRoom(robot,null);

    var route = null;

	while ( ! mapRoom.complete ) {
		
		mapRoom.scanInitial();
	}
	
	assert.ok(mapRoom.complete  , "Room navigation complete");

	var robotCell = mapRoom.calcScanRoute();
	var mapGrid = mapRoom.getMapGrid();
	
    // Get longest wall
    var wallSearch = new WallSearch(robotCell, mapGrid);
    var longestWallCell = wallSearch.getLongestWall();

    
	assert.ok( longestWallCell.x > 0 && longestWallCell.x < 500, "Longest wall x");
	assert.equal( longestWallCell.y , 400, "Longest wall y");
    
    var getMaxLength = wallSearch.getMaxLength();
    assert.equal( getMaxLength , 9, "Longest wall length");

    // Find the route
    var findRoute = new FindRoute(mapGrid);
    var route = findRoute.getRoute(robotCell, longestWallCell);
    
    console.log('mapGrid.dump()=' + mapGrid.dump());

    assert.equal( route.length , 3, "route.length");
    assert.equal( route[0].x , 200, "route x");
    assert.equal( route[0].y , 250, "route y");

    assert.equal( route[1].x , 200, "route x");
    assert.equal( route[1].y , 300, "route y");

    assert.equal( route[2].x , 200, "route x");
    assert.equal( route[2].y , 350, "route y");

});

