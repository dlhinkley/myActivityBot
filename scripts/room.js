function Room(id,walls,canvas) {

    var walls, wallCanvas, roomDim;
   
    function init() {
    
		var g = new Geometry();
        roomDim = getRoomDim(walls);
        
        console.log('init roomDim=', roomDim);
        
        wallCanvas		= new Canvas("roomWallCanvas", roomDim.width, roomDim.height);
        
        drawWalls();
             
    }
    function drawWalls() {
        
		for (var m = 0; m < walls.length; m++ ) {
			
			///console.log('plotWalls start=' , lineArray[m].start);
			//console.log('plotWalls end=' , lineArray[m].end);
			 
			wallCanvas.drawLine( walls[m].start.x, walls[m].start.y, walls[m].end.x,  walls[m].end.y, 'black' );
			
			wallCanvas.drawSquare( walls[m].start.x, walls[m].start.y, 8, 'black' );
			wallCanvas.drawSquare( walls[m].end.x,   walls[m].end.y,   8, 'black' );
		}
    }
	/**
	* Given X y coordinates, return true if the dimensions will hit the wall
	*/
	this.isHitWall = function(dim) {
		
		console.log('isHitWall dim=',dim);
		
		var g = new Geometry();
		
		var hit = false;
		
		var box = [ 
		            g.line( g.point( dim.tr.x, dim.tr.y ), g.point( dim.tl.x, dim.tl.y ) ),
		            g.line( g.point( dim.tl.x, dim.tl.y ), g.point( dim.bl.x, dim.bl.y ) ),
		            g.line( g.point( dim.bl.x, dim.bl.y ), g.point( dim.br.x, dim.br.y ) ),
		            g.line( g.point( dim.br.x, dim.br.y ), g.point( dim.tr.x, dim.tr.y ) )
		];

    	var ptr = 0;
		console.log('isHitWall walls.length=',walls.length);
    	
		while ( ! hit && ptr < walls.length ) {
		
		    for (var m = 0; m < box.length; m ++ ) {
		
                var line = box[m];
                
                console.log('walls[ptr]=', walls[ptr]);
                console.log('box[m]=', box[m]);
                
    		    if ( line.intersection( walls[ptr] ) !== null ) {
        		    
        		    hit = true;
        			console.log("bang!!!",dim);
    		    }
		    }
            ptr++;
    	}
		return hit;
	}


	/**
	* Given a x, y coordinate and degree, returns the distance to the an obstacal
	* degree is based on 0 being up;
	*/
	this.getWallDistance = function(x,y,deg) {

		var distance    = null;
		var g           = new Geometry();
		var dim         = this.calcBeamDestination(x,y,deg);

		var beamStart 	= g.point(x,y);
		var beamEnd 	= g.point(dim.x, dim.y);		
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

				var wallStartDist  = robotVector.distanceFrom( Vector.create([ walls[m].start.x, walls[m].start.y ] ) );
				var wallEndDist    = robotVector.distanceFrom( Vector.create([ walls[m].end.x,   walls[m].end.y   ] ) );			

			
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
			console.log('canvas=',canvas);
			if (canvas ) canvas.drawLine( x, y, dim.x, dim.y, 'blue');
			
			return dim;
	}	
	
	init();
}