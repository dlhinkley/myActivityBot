function Room(id,width,height,canvas) {

	
	this.width = width;		
	this.height = height;
	
	if ( id ) { 
    	this.div = document.getElementById(id);
    	this.div.style.width  = width + "px";
    	this.div.style.height = height + "px";
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
	function plotLine(line,color) {
		
/*
		ctx.beginPath();
		ctx.moveTo(line.start.x,line.start.y);
		ctx.lineTo(line.end.x, line.end.y);
		ctx.strokeStyle = color;

		ctx.stroke();	
*/	
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
		plotLine(beamLine,"#ff0000");

		
		var lTop 	= g.line(  g.point( 0, 0), 			g.point(width,0)		);
		var lRight 	= g.line(  g.point( width, 0), 		g.point(width,height)	);
		var lBottom = g.line(  g.point( width, height), g.point(0,height)		);
		var lLeft 	= g.line(  g.point( 0, height), 	g.point(0,0)			);
		
		plotLine(lTop,"#0000ff");
		plotLine(lRight,"#00ff00");
		plotLine(lBottom,"#666666");
		plotLine(lLeft,"#996600");
		
		var lTopDist 	= lTop.intersection( beamLine );
		var lRightDist 	= lRight.intersection( beamLine);
		var lBottomDist = lBottom.intersection( beamLine);
		var lLeftDist 	= lLeft.intersection( beamLine );
		
				
		//console.log('intersection=', lTopDist		);
		//console.log('intersection=', lRightDist 	);
		//console.log('intersection=', lBottomDist 	);
		//console.log('intersection=', lLeftDist 	);
		
		if ( lTopDist ) {
			
			if (canvas) canvas.beamDestination(lTopDist);
			distance = beamStart.distance( lTopDist );
		}
		else if ( lRightDist ) {
			
			if (canvas) canvas.beamDestination(lRightDist);
			distance = beamStart.distance( lRightDist );
		}
		else if ( lBottomDist ) {
			
			if (canvas) canvas.beamDestination(lBottomDist);
			distance = beamStart.distance( lBottomDist );
		}
		else if ( lLeftDist ) {
			
			if (canvas) canvas.beamDestination(lLeftDist);
			distance = beamStart.distance( lLeftDist );
		}

		console.log('distance=' + distance 	);

		return distance;
		
	}
    this.calcBeamDestination = function(x,y,deg) {
		
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
			
			if (canvas ) canvas.beamLine(x,y,dim.x,dim.y);
			
			return dim;
	}	
	
}