
function Canvas(id,width,height) {
	
	this.width = width;		
	this.height = height;
	
	this.canvas = document.getElementById(id);
	this.canvas.width  = width;
	this.canvas.height = height;	
	
	var context = this.canvas.getContext("2d");
	
	this.clear = function() {
		
		context.clearRect ( 0 , 0 , canvas.width, canvas.height );
	};
	this.drawSquare = function(x, y, size, color) {
		
		//console.log('drawSquare x=' + x +  '  y=' + y +  ' size=' + size + ' color=' + color);

			context.fillStyle = color;
			context.fillRect(x - (size/2), y - (size/2), size, size)
	}
	this.drawCircle = function(x,y,r,color) {
		
		var radius = r;
		
		var centerX = x;// + radius / 2;
		var centerY = y;// + radius / 2;
		
		context.beginPath();
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context.fillStyle = color;
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = color;
		context.stroke();
	}
	this.distanceEnd = function(x,y) {
		
		this.drawCircle(x,y,4,'purple');
	}
	this.writeText = function(x,y,text) {
		
		context.font="10px Georgia";
		context.fillText(Math.round(x) + "," + Math.round(y),x,y);
	}
	this.writeCoords = function(x,y) {
		
		this.writeText(x,y, Math.round(x) + "," + Math.round(y),x,y);
	}
	this.drawLine = function (x1, y1, x2, y2, color) {

        console.log('drawLine x1=' + x1 + ' y1=' + y1 + ' x2=' + x2 + ' y2=' + y2 + ' color=' + color);
		
      context.beginPath();
      
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      
      context.strokeStyle = color;

      context.stroke();			
	}
}


function MapCanvas( width, height) {
    
      var canvas = new Canvas("roomMapCanvas", , );
      
}
