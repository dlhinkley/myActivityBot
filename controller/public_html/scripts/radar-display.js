'use strict';

function RadarDisplay(canvas) {

    console.log("RadarDisplay canvas=",canvas);
    
    var self = this;
	var g    = new Geometry();
	var destination = {};
	
    var x = 200;
    var y = 200;
        
    canvas.drawCircle(x, y, 5, 'green');
    
/*
    self.eraseBeam = function( distance, degree ) {
    
        var x = canvas.width / 2;
        var y = canvas.height;
        
        var dest = calcPoint(x, y, distance, degree);
        
            
        canvas.eraseArea(dest.x - 7, dest.y - 7, 15, 15);
    } 
*/   
    self.drawAndErase = function(distance, degree ) {
        
        self.eraseByDegree(degree);
        
        self.drawBeam( distance, degree );
    }

    self.eraseByDegree = function(degree) {
    
        if ( destination.hasOwnProperty( degree ) ) {
            var dest = destination[ degree ];
            
            canvas.eraseArea(dest.x - 7, dest.y - 7, 15, 15);
        }
    }
    self.drawBeam = function( distance, degree ) {
    

        
        var dest = calcPoint(x, y, distance, degree - 90);
        dest = invertXY(dest);
        
        canvas.drawCircle(dest.x, dest.y,5, 'red');
        
        // Save location
        destination[ degree ] = dest;
    }
    function invertXY(point) {
        
         // get element position
        
          // get inversed coordinates: enable code after comment if abs. pos.
          point.x = canvas.width - point.x; // + rect.left
          //point.y = canvas.height - point.y; // + rect.top

          return point;
    }
	/**
	* Using the present robot position, turn angle and distance, return the point 
	* that distance away
	*/
	function calcPoint(x, y, distance,degree) {
		
				
		// Take away 90 to adjust for our north
		var adjDeg = 90 - degree;

		console.log("RadarDisplay.calcPoint x=" + x + " y=" + y + " distance=" + distance + " degree=" + degree + " adjDeg=" + adjDeg);
		
		var angle = rad(adjDeg);
		var o = g.point(x,y );
		
		var newPoint = g.point.fromPolar(distance, angle, o);
		
		console.log('RadarDisplay.calcPoint newPoint=',newPoint);
		


		return newPoint;
	}    
}

