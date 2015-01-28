


function Robot(id,room,x,y) {

	var self = this;
	self.x = x;
	self.y = y;
		
	var loc = {
				"heading": {
							"deg": 0,
							"cos": Math.cos(0 * Math.PI / 180),
							"sin": Math.sin(0 * Math.PI / 180),	
					
				},
				"dim":  {
						"point": { "x": 0, "y": 0 },
						"tl": { "x": 0, "y": 0 },
						"tr": { "x": 0, "y": 0 },
						"bl": { "x": 0, "y": 0 },
						"br": { "x": 0, "y": 0 },
						}
				};
				
	var width = 100;
	var height = 200;
	

    if ( id ) {
    	var div = document.getElementById(id);
    	
    	
    	div.style.width  = width + "px";
    	div.style.height = height + "px";
	}
	var speed = 2,
	    color = '#c00';
	    
	function init() {
		
		render();
	}
	self.getHeadingDeg = function() {
		
		return loc.heading.deg;
	}
	self.setSize = function(w,h) {
		
		width = w;
		height = h;
		
		if ( id ) {
		
    		div.style.width  = width + "px";
    		div.style.height = height + "px";
		}
		render();
	}
	self.setPosition = function(x,y) {
		
		self.x = x;
		self.y = y;
		render();
	}
	/**
	* Returns the x, y location of the front point of the robot
	*/
	self.getPoint = function() {
		
		return loc.dim.point;
	}
	this.getWallDistance = function() {
		
		
		return room.getWallDistance(loc.dim.point.x, loc.dim.point.y, loc.heading.deg);
	}
	this.turn = function(deg) {
		
		
		var newDeg = loc.heading.deg + deg;
        
        if ( newDeg > 360 ) {
	        	        
        	newDeg -= 360;;
        }
        else if ( newDeg < 0 ) {
	        
	        newDeg += 360;
        }	
        
        
		if ( ! isHitWall( self.x, self.y, newDeg )  ) {
		
			loc.heading.deg = newDeg;
		}        
        
		loc.heading.sin = Math.sin(loc.heading.deg * Math.PI / 180);
		loc.heading.cos = Math.cos(loc.heading.deg * Math.PI / 180);
		
		
		console.log('Robot.turn loc.heading=',loc.heading);
		
        render();
	};
	this.moveBack = function(distance) {

        //var moveY = (speed * distance * loc.heading.cos);
		//var moveX = (speed * distance * loc.heading.sin);
		
		
			var x10 = x
			var y10 = y

			var halfHeight = speed * distance 
			var halfWidth  = 0
			
			var radRotate = rad(loc.heading.deg)

			var radius = speed * distance

			var angle = Math.asin( halfHeight / radius )


			moveX = radius * Math.cos(radRotate - angle); 
			moveY = radius * Math.sin(radRotate - angle);		
		
		
		console.log('moveBack moveX=' + moveX + ' moveY=' + moveY);
		
		if ( ! isHitWall(self.x - moveX , self.y - moveY, loc.heading.deg ) ) {

			self.x -= moveX;
			self.y -= moveY;
		}
		render();
	};

	this.moveForward = function(distance) {
			
		//var moveY = Math.round(speed * distance * Math.cos(loc.heading.deg * Math.PI / 180));
		//var moveX = Math.round(speed * distance * Math.sin(loc.heading.deg * Math.PI / 180));
	
			var x10 = self.x
			var y10 = self.y

			var halfHeight = speed * distance 
			var halfWidth  = 0
			
			var radRotate = rad(loc.heading.deg)

			var radius = speed * distance

			var angle = Math.asin( halfHeight / radius )


			moveX = radius * Math.cos(radRotate + angle); 
			moveY = radius * Math.sin(radRotate + angle);
			
			
		console.log('moveForward moveX=' + moveX + ' moveY=' + moveY);	
		
		if ( ! isHitWall(self.x - moveX, self.y - moveY, loc.heading.deg ) ) {
		
			self.x -= moveX;
			self.y -= moveY;
		}
		
		render();
	};
	var rotation = 0;

	function rotate(id,degrees) {
	
	    $(id).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
	                 '-moz-transform' : 'rotate('+ degrees +'deg)',
	                 '-ms-transform' : 'rotate('+ degrees +'deg)',
	                 'transform' : 'rotate('+ degrees +'deg)'});
	                 
	};
	/**
	* Given X y coordinates, return true if the dimensions will hit the wall
	*/
	function isHitWall(x,y, deg) {
		
		console.log('isHitWall x=' + x + ' y=' + y + ' deg=' + deg);
		
		var dim = calcCorners(x,y, deg);
		
		self.hit = room.isHitWall(dim);
		
		return self.hit;
	}
	function calcCorners(x,y, deg) {
		

			var x10 = x
			var y10 = y

			var r = deg
			var halfHeight = height / 2
			var halfWidth  = width / 2
			
			var radRotate = rad(deg)

			var radius = Math.sqrt( halfHeight*halfHeight + halfWidth*halfWidth )

			var angle = Math.asin( halfHeight / radius )


			loc.dim.tr.x = x10 + radius * Math.cos(radRotate - angle); 
			loc.dim.tr.y = y10 + radius * Math.sin(radRotate - angle);
			
			loc.dim.br.x = x10 + radius * Math.cos(radRotate + angle); 
			loc.dim.br.y = y10 + radius * Math.sin(radRotate + angle);
			
			loc.dim.bl.x = x10 + radius * Math.cos(radRotate + Math.PI - angle); 
			loc.dim.bl.y = y10 + radius * Math.sin(radRotate + Math.PI - angle);
			
			loc.dim.tl.x = x10 + radius * Math.cos(radRotate + Math.PI + angle); 
			loc.dim.tl.y = y10 + radius * Math.sin(radRotate + Math.PI + angle);
			
			calcPoint(x,y,deg);

		return loc.dim;
	}
	function calcPoint(x,y,deg) {
		
			var x10 = x
			var y10 = y

			var halfHeight = height / 2;
			var halfWidth  = 0
			
			var radRotate = rad(loc.heading.deg)

			var radius = height / 2;

			var angle = Math.asin( halfHeight / radius )


			loc.dim.point.x = x10 - radius * Math.cos(radRotate + angle); 
			loc.dim.point.y = y10 - radius * Math.sin(radRotate + angle);
			
	}
	function render() {
		
		if (id ) {
		
    		// TL calculation
    		//
    		calcCorners(self.x, self.y, loc.heading.deg);
    			    	    
    	    rotate(div,loc.heading.deg);
    	    
    	    div.style.top = self.y - (height / 2);
    	    div.style.left = self.x - (width / 2);
    	    
    			
    		document.getElementById('tl').innerHTML = 'x=' + Math.round(loc.dim.tl.x) + '<br>y=' + Math.round(loc.dim.tl.y);
    		document.getElementById('tr').innerHTML = 'x=' + Math.round(loc.dim.tr.x) + '<br>y=' + Math.round(loc.dim.tr.y);
    		document.getElementById('br').innerHTML = 'x=' + Math.round(loc.dim.br.x) + '<br>y=' + Math.round(loc.dim.br.y);
    		document.getElementById('bl').innerHTML = 'x=' + Math.round(loc.dim.bl.x) + '<br>y=' + Math.round(loc.dim.bl.y);
    
    		document.getElementById('coord').innerHTML = 'x=' + Math.round( self.x ) + ' y=' + Math.round( self.y );
    		
    		var pointADiv = document.getElementById('pointA');
    		var pointBDiv = document.getElementById('pointB');
    		
    		pointADiv.style.left = self.x - 10;
    		pointADiv.style.top = self.y ;
    	    
    		pointBDiv.style.left = self.x - 10;
    		pointBDiv.style.top = self.y;
    	    
    		
    		var frontADiv = document.getElementById('frontA');
    		var frontBDiv = document.getElementById('frontB');
    		
    		frontADiv.style.left = loc.dim.point.x - 10;
    		frontADiv.style.top = loc.dim.point.y ;
    	    
    		frontBDiv.style.left = loc.dim.point.x - 10;
    		frontBDiv.style.top = loc.dim.point.y;
		}
	}
	
	init();
}