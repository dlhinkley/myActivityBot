function Room(id,width,height) {

	
	this.width = width;		
	this.height = height;
	
	this.div = document.getElementById(id);
	this.div.style.width  = width + "px";
	this.div.style.height = height + "px";
	
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
		
		if ( cornerDim.x < 0 || cornerDim.y < 0 || cornerDim.x > width || cornerDim.x > height || cornerDim.y > width || cornerDim.y > height ) {
			
			
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
	*/
	this.getWallDistance = function(x,y,deg) {

		var distance = null;
		
		var g = new Geometry();
		
		var dim = calcBeamDestination(x,y,deg);

		
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
			
			canvas.beamDestination(lTopDist);
			distance = beamStart.distance( lTopDist );
		}
		else if ( lRightDist ) {
			
			canvas.beamDestination(lRightDist);
			distance = beamStart.distance( lRightDist );
		}
		else if ( lBottomDist ) {
			
			canvas.beamDestination(lBottomDist);
			distance = beamStart.distance( lBottomDist );
		}
		else if ( lLeftDist ) {
			
			canvas.beamDestination(lLeftDist);
			distance = beamStart.distance( lLeftDist );
		}

		console.log('distance=' + distance 	);

		return distance;
		
	}
	function calcBeamDestination(x,y,deg) {
		
			var x10 = x
			var y10 = y
			var distance = width;
			
			if ( height > width ) {
				
				distance = 	height;
			}


			var halfHeight = distance * 2;
			var halfWidth  = 0
			
			var radRotate = rad(deg)

			var radius = distance * 2;

			var angle = Math.asin( halfHeight / radius );

			var dim = {"x": 0, "y": 0};
			
			dim.x = x10 - radius * Math.cos(radRotate + angle); 
			dim.y = y10 - radius * Math.sin(radRotate + angle);
			

			//console.log('calcBeamDestination dim=',dim);
			
			canvas.beamLine(x,y,dim.x,dim.y);
			
			return dim;
	}	
	
}