
'use strict';
function GridPaper(width,height) {
	
	var margin = 40; 
	var step = 10;
	
	var roomDiv 	    = document.getElementById("room");
    roomDiv.style.width  = width + "px";
    roomDiv.style.height = height + "px";
	
	
	var gridPaperDiv 	= document.getElementById("gridPaper");
	var rightScaleDiv 	= document.getElementById("rightScale");
	var leftScaleDiv 	= document.getElementById("leftScale");
	var topScaleDiv 	= document.getElementById("topScale");
	var bottomScaleDiv 	= document.getElementById("bottomScale");
	
	gridPaperDiv.style.width  = width + (margin * 2) + "px";
	gridPaperDiv.style.height = height + (margin * 2) + "px";
	
	function createVerticalLines() {
				
    	topScaleDiv.appendChild( getVerticalScale(20,0,"X") );
    	bottomScaleDiv.appendChild( getVerticalScale(10,0,"X") );

	    	
		for (var m = step; m < width; m += step) {
			
			var lineDiv = getVerticalLine(m);
			
	    	roomDiv.appendChild(lineDiv);	
	    			
	    	topScaleDiv.appendChild( getVerticalScale(20,m,m) );
	    	bottomScaleDiv.appendChild( getVerticalScale(10,m,m) );
		}
		
	}
	function createHorizontalLines() {
				
    	leftScaleDiv.appendChild( getHorizontalScale(0,15,"Y") );
    	rightScaleDiv.appendChild( getHorizontalScale(0,5,"Y") );

		for (var m = step; m < height; m += step) {
			
			var lineDiv = getHorizontalLine(m);		
				
	    	roomDiv.appendChild(lineDiv);
	    	
	    	leftScaleDiv.appendChild( getHorizontalScale(m,15,m) );
	    	rightScaleDiv.appendChild( getHorizontalScale(m,5,m) );
	    	
		}
	}
	function getHorizontalLine(pos) {
		
	    var lineDiv = document.createElement("div");
	    
	    lineDiv.className = "horizontalLine";
	    lineDiv.style.top = pos;
	    lineDiv.style.left = 0;
	    lineDiv.style.width = width + "px";
	    
	    return lineDiv;
	}
	function getVerticalLine(pos) {
		
	    var lineDiv = document.createElement("div");
	    
	    lineDiv.className = "verticalLine";
	    //lineDiv.innerHTML = "new div"
	    lineDiv.style.top = 0;
	    lineDiv.style.left = pos;
	    lineDiv.style.height = height + "px";
	    
	    return lineDiv;
	}
	function getHorizontalScale(pos,left,text) {
		
	    var lineDiv = document.createElement("div");
	    
	    lineDiv.className = "horizontalScale";
	    lineDiv.innerHTML = text;
	    lineDiv.style.top = pos - (step /2);
	    lineDiv.style.left = left;
	    
	    return lineDiv;
	}
	function getVerticalScale(top,left,text) {
		
	    var lineDiv = document.createElement("div");
	    
	    lineDiv.className = "verticalScale";
	    lineDiv.innerHTML = text;
	    lineDiv.style.left = left - (step /2);
	    lineDiv.style.top = top;
	    
	    var degrees = 270;
	    
	    if ( text != "X" ) {
		    // Rotate the text vertically
		    //
		    $(lineDiv).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
		             '-moz-transform' : 'rotate('+ degrees +'deg)',
		             '-ms-transform' : 'rotate('+ degrees +'deg)',
		             'transform' : 'rotate('+ degrees +'deg)'});
		}
	    return lineDiv;
	}

	function createLines() {
		
		createHorizontalLines();
		createVerticalLines();		
	}
	createLines();
	
}

