function Room(id,width,height,canvas) {

    var walls, wallCanvas;
   
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
        
        wallCanvas		= new Canvas("roomWallCanvas",width, height);
        
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
	* Given a x, y coordinate and degree, returns the distance to the wall
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
		canvas.drawLine(beamLine.start.x, beamLine.start.y, beamLine.end.x, beamLine.end.y ,"#ff0000");

		
		for (var m = 0; m < walls.length; m ++ ) {
		
/*
    		var lTop 	= g.line(  g.point( 0, 0), 			g.point(width,0)		);
    		var lRight 	= g.line(  g.point( width, 0), 		g.point(width,height)	);
    		var lBottom = g.line(  g.point( width, height), g.point(0,height)		);
    		var lLeft 	= g.line(  g.point( 0, height), 	g.point(0,0)			);
*/

    		
    		var wallDist 	= walls[m].intersection( beamLine );
/*
    		var lRightDist 	= lRight.intersection( beamLine);
    		var lBottomDist = lBottom.intersection( beamLine);
    		var lLeftDist 	= lLeft.intersection( beamLine );
*/
    		
    				
    		//console.log('intersection=', lTopDist		);
    		//console.log('intersection=', lRightDist 	);
    		//console.log('intersection=', lBottomDist 	);
    		//console.log('intersection=', lLeftDist 	);
    		
    		if ( wallDist ) {
    			
    			if (canvas) canvas.drawSquare( wallDist.x, wallDist.y, 8, "green" );
    			distance = beamStart.distance( wallDist );
    		}
/*
    		else if ( lRightDist ) {
    			
    			if (canvas) canvas.drawSquare( lRightDist.x, lRightDist.y, 8, "green" );
    			distance = beamStart.distance( lRightDist );
    		}
    		else if ( lBottomDist ) {
    			
    			if (canvas) canvas.drawSquare( lBottomDist.x, lBottomDist.y, 8, "green" );
    			distance = beamStart.distance( lBottomDist );
    		}
    		else if ( lLeftDist ) {
    			
    			if (canvas) canvas.drawSquare( lLeftDist.x, lLeftDist.y, 8, "green" );
    			distance = beamStart.distance( lLeftDist );
    		}
*/
        }
		console.log('distance=' + distance 	);

		return distance;
		
	}
    this.calcBeamDestination = function(x, y, deg) {
		
			var x10 = x
			var y10 = y
			
			// Max distance we can go is the greater of the distance to any of the 
			// corners
			var robotVector = Vector.create([x,y]);
			
			var topLeftDist  = robotVector.distanceFrom(  Vector.create([ 0, 0]) );
			var topRightDist = robotVector.distanceFrom( Vector.create([ 0, width]) );
			var botRightDist = robotVector.distanceFrom( Vector.create([ height, 0]) );
			var botLeftDist  = robotVector.distanceFrom( Vector.create([ height, width]) );
			
			var maxDistance = 0;
			
            if ( topLeftDist > maxDistance ) {
                
                maxDistance = topLeftDist;
            }			
            else if ( topRightDist > maxDistance ) {
                
                maxDistance = topRightDist;
            }			
            else if ( botRightDist > maxDistance ) {
                
                maxDistance = botRightDist;
            }			
            else if ( botLeftDist > maxDistance ) {
                
                maxDistance = botLeftDist;
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