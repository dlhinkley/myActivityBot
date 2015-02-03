function Room(id,width,height,canvas) {

    var walls, wallCanvas, roomDim;
   
    function init() {
    
		var g = new Geometry();
        
        walls = [
        		g.line(  g.point( 0, 0),                g.point(width/3,0)		), // Top wall left of door
        		g.line(  g.point( width - width/3, 0), g.point(width,0)		), // Top wall right of door
            	g.line(  g.point( width, 0),            g.point(width,height)	), // Left wall
        		g.line(  g.point( width, height),       g.point(0,height)		), // right wall
        		g.line(  g.point( 0, height),           g.point(0,0)			),  // bottom wall
        		
        		g.line(  g.point( 80, 80),           g.point(100, 80)			),  // box inside room top
        		g.line(  g.point( 100, 80),           g.point(100, 100)			),  // box inside room left
        		g.line(  g.point( 100, 100),           g.point(80, 100)			),  // box inside room bottom
        		g.line(  g.point( 80, 100),           g.point(80, 80)			),  // box inside room right
        ];	  
        roomDim = getRoomDim(walls);
        
        console.log('init roomDim=',roomDim);
        
        wallCanvas		= new Canvas("roomWallCanvas",roomDim.width, roomDim.height);
        
        drawWalls();
             
    }
    function drawWalls() {
        
		for (var m = 0; m < walls.length; m++ ) {
			
			///console.log('plotWalls start=' , lineArray[m].start);
			//console.log('plotWalls end=' , lineArray[m].end);
			 
			wallCanvas.drawLine( walls[m].start.x, walls[m].start.y, walls[m].end.x,  walls[m].end.y, 'black' );
			
			wallCanvas.drawSquare( walls[m].start.x, walls[m].start.y, 8, 'black' );
			wallCanvas.drawSquare( walls[m].end.x, walls[m].end.y, 8, 'black' );
		}
    }
	/**
	* Given X y coordinates, return true if the dimensions will hit the wall
	*/
	this.isHitWall = function(dim) {
		
		//console.log('isHitWall dim=',dim);
		
		var hit = false;
		
		if ( isHit( dim.tr ) ||isHit( dim.tl ) || isHit( dim.br ) || isHit( dim.bl ) ) {
			
			hit = true;
			console.log("bang!!!",dim);
		}
		
		return hit;
	}
	function isHit(cornerDim) {
		
		var hit = false;
		
		if ( cornerDim.x <= 0 || cornerDim.y <= 0 || cornerDim.x >= width || cornerDim.x >= height || cornerDim.y >= width || cornerDim.y >= height ) {
			
			
			hit = true;
		}
		return hit;
		
	}

	/**
	* Given a x, y coordinate and degree, returns the distance to the an obstacal
	* degree is based on 0 being up;
	*/
	this.getWallDistance = function(x,y,deg) {

		var distance = null;
		
		var g = new Geometry();
		
		var dim = this.calcBeamDestination(x,y,deg);

		
		var beamStart 	= g.point(x,y);
		var beamEnd 	= g.point(dim.x, dim.y);
		
		//console.log('beamStart=',beamStart);
		
		var beamLine 	= g.line(beamStart, beamEnd);
		if (canvas) canvas.drawLine(beamLine.start.x, beamLine.start.y, beamLine.end.x, beamLine.end.y ,"#ff0000");

		
		for (var m = 0; m < walls.length; m ++ ) {
    		
    		var wallDist 	= walls[m].intersection( beamLine );

    		if ( wallDist ) {
    			
    			if (canvas) canvas.drawSquare( wallDist.x, wallDist.y, 8, "green" );
    			
    			distance = beamStart.distance( wallDist );
    		}

    }
		console.log('distance=' + distance 	);

		return distance;
		
	}
	/**
	 * Given an array of wall lines, return an object containing the max x and y
	 * coordinates
	 */
	function getRoomDim(walls) {
		
		var roomDim = {
						'width': 0,
						'height': 0,
						'min': {
								'x': 0,
								'y': 0
						},
						'max': {
								'x': 0,
								'y': 0
						}
		};
		
		for (var m = 0; m < walls.length; m ++ ) {
    		
    		if ( walls[m].start.x > roomDim.max.x ) roomDim.max.x = walls[m].start.x;
    		if ( walls[m].start.y > roomDim.max.y ) roomDim.max.y = walls[m].start.y;
    		if ( walls[m].end.x   > roomDim.max.x ) roomDim.max.x = walls[m].end.x;
    		if ( walls[m].end.y   > roomDim.max.y ) roomDim.max.y = walls[m].end.y;
    		
    		if ( walls[m].start.x < roomDim.min.x ) roomDim.min.x = walls[m].start.x;
    		if ( walls[m].start.y < roomDim.min.y ) roomDim.min.y = walls[m].start.y;
    		if ( walls[m].end.x   < roomDim.min.x ) roomDim.min.x = walls[m].end.x;
    		if ( walls[m].end.y   < roomDim.min.y ) roomDim.min.y = walls[m].end.y;
    		
		}
		roomDim.width  = roomDim.max.x - roomDim.min.x;
		roomDim.height = roomDim.max.y - roomDim.min.y;
		
		return roomDim;
	}
    this.calcBeamDestination = function(x, y, deg) {
		
			var x10 = x
			var y10 = y
			
			// Max distance we can go is the greater of the distance to any of the 
			// corners
			var robotVector = Vector.create([x,y]);
			
			var maxDistance = 0;
			
            // Loop through all walls and find the max distance from the robot
            //
			for (var m = 0; m < walls.length; m ++ ) {

				var wallStartDist  = robotVector.distanceFrom(  Vector.create([ walls[m].start.x, walls[m].start.y]) );
				var wallEndDist = robotVector.distanceFrom( Vector.create([  walls[m].end.x, walls[m].end.y]) );			

			
	            if ( wallStartDist > maxDistance ) {
	                
	                maxDistance = wallStartDist;
	            }			
	            else if ( wallEndDist > maxDistance ) {
	                
	                maxDistance = wallEndDist;
	            }			
			}
			
            var distance = maxDistance + 20; // Add 20 to make sure goes beyond wall
            
			var halfHeight = distance * 2;
			var halfWidth  = 0
			
			var radRotate = rad(deg)

			var radius = distance * 2;

			var angle = Math.asin( halfHeight / radius );

			var dim = {"x": 0, "y": 0};
			
			dim.x = x10 - radius * Math.cos(radRotate + angle); 
			dim.y = y10 - radius * Math.sin(radRotate + angle);
			

			console.log('calcBeamDestination distance=' + distance + ' dim=',dim);
			
			if (canvas ) canvas.drawLine( x, y, dim.x, dim.y, 'blue');
			
			return dim;
	}	
	
	init();
}