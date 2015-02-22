
'use strict';
    /**
    * Map Cell object
    */
    function MapCell(x, y, gridSize, canvas ) {
        
    	console.log('MapCell start x=' + x + ' y=' + y);

	    var g       = new Geometry();
        var isWall = false;
        var isDoorway = false;
        this.isOrigin = false;
        this.isGoal = false;
        this.pathStep = null;
        this.x = x;
        this.y = y;

        
        this.directions = ['cellNorth','cellSouth','cellWest','cellEast'];

        
                // Define the points of the cell
        this.lowerLeftCorner  = g.point( x - (gridSize/2), y + (gridSize/2) );
        this.lowerRightCorner = g.point( x + (gridSize/2), y + (gridSize/2) );
        this.upperLeftCorner  = g.point( x - (gridSize/2), y - (gridSize/2) );
        this.upperRightCorner = g.point( x + (gridSize/2), y - (gridSize/2) );
        
        // Get the lines of the cell
        this.upperLine = g.line( this.upperLeftCorner, this.upperRightCorner );
        this.leftLine  = g.line( this.upperLeftCorner, this.lowerLeftCorner  );
        this.lowerLine = g.line( this.lowerLeftCorner, this.lowerRightCorner );
        this.rightLine = g.line( this.upperRightCorner,this.lowerRightCorner );
        
        // Li
        this.borders = [this.upperLine, this.leftLine, this.lowerLine, this.rightLine ];
        
        if (canvas) canvas.drawBox(x, y, gridSize, '#00FF00');
        
        /**
        * Flag as Doorway
        */
        this.flagAsDoorway = function() {
                      
            clearFlags();           
            isDoorway = true;
            if (canvas) canvas.drawSquare(this.x, this.y, gridSize, '#999999');
        };
        this.isDoorway = function() {
            
            return isDoorway;
        }
        
        this.flagAsWall = function() {
                      
            clearFlags();           
            isWall = true;
          if (canvas) canvas.drawSquare(this.x, this.y, gridSize, '#FF0000');
        };
        this.isWall = function() {
            
            return isWall;
        }
        function clearFlags() {
            
            isWall = false;
            isDoorway = false;
        }
        this.flagAsPath = function(step) {
            
            this.pathStep = step;
            if (canvas) canvas.drawSquare(this.x, this.y, gridSize, '#0000FF');
            if (canvas) canvas.writeText(this.x, this.y, step,'#FFFFFF', '30px');
            
            console.log('Canvas.flagAsPath this.x=' + this.x + ' this.y=' + this.y);
        };
    }
