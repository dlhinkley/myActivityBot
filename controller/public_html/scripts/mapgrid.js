'use strict';

	/**
	* Storage and accessors for a grid of map cells.
	*/
    function MapGrid( gridSizeIn, maxX, maxY) {
        
        var self = this;
        var gridSize = gridSizeIn;
        maxX  = maxX || 20; // default to 20 if no value provided
        maxY  = maxY || 20; // default to 20 if no value provided
        var maxXUsed = 0;
        var maxYUsed = 0;
        
        this.cells = new Array(maxX);
        

        // Init grid
        for (var x = 0; x < maxX; x++) {
                
            self.cells[x] = new Array(maxY);
        }
        
        
        function adjX(x) {
            
            return (x / gridSize);
        }
        function adjY(y) {
            
            return (y / gridSize);
        }
        
        self.addCell = function( mapCell ) {
            
            var x = adjX(mapCell.x);
            var y = adjY(mapCell.y);
            
            this.cells[ x ][ y ] = mapCell;
            
            if (x > maxXUsed ) {
                
                maxXUsed = x;
            }
            if ( y > maxYUsed ) {
                
                maxYUsed = y;
            }
        }
        
        self.cellWest = function(cell) {
            
            var x = adjX(cell.x) - 1;
            var y = adjY(cell.y);
            
            return getCell(x, y);
        }
        self.cellEast = function(cell) {
            
            var x = adjX(cell.x) + 1;
            var y = adjY(cell.y);
            
            return getCell(x, y);
        }
        self.cellSouth = function(cell) {
            
            var x = adjX(cell.x);
            var y = adjY(cell.y) + 1;
            
            return getCell(x, y);
        }
        function getCell(x, y) {
            
            //console.log('MapGrid.getCell x=' + x + ' y=' + y + ' cells=',self.cells);
            var cellOut = null;
            
            if ( x >= 0 && x < self.cells.length && y >= 0 && y < self.cells[x].length ) {
            
                cellOut = self.cells[ x ][ y ];
            }
            return cellOut;             
        }
        
        self.cellNorth = function(cell) {
            
            var x = adjX(cell.x);
            var y = adjY(cell.y) - 1;
            
            return getCell(x, y);
        }
        
        self.clearAllPathStep = function() {
            
            for (var x = 0; x < maxX; x++ ) {
                
                for (var y = 0; y < maxY; y++ ) {
                    
                    if ( self.cells[x] && self.cells[x][y]) {
                    
                        self.cells[x][y].pathStep = null;
                        self.cells[x][y].isOrigin = false;
                        self.cells[x][y].isGoal = false;
                    }
                }
            }
        }
        
        function repeat(s, n){
            var a = [];
            while(a.length < n){
                a.push(s);
            }
            return a.join('');
        }
        
        self.dump = function() {
            
            var dump = '';
            var text = '';
            var line = '\n';
            
            for (var y = 0; y <= maxYUsed; y++ ) {
                
                for (var x = 0; x <= maxXUsed; x++ ) {
                
                    if ( self.cells[x] && self.cells[x][y]) {
                                            
                        
                        if (  self.cells[x][y].isOrigin ) { 
                            
                            text = "O|"; 
                        }
                        else if (  self.cells[x][y].isGoal ) { 
                            
                            text = "G|"; 
                        }
                        else if (  self.cells[x][y].isWall() ) { 
                            text = "W|"; 
                        }
                        else {
                            
                            text = " |";
                        }
                        
                        text += x + ',' + y + '(' + self.cells[x][y].pathStep + ') ';
                    }
                    else {
                        
                        text = " |" + x + ',' + y + '( ) ';
                    }
                    text = text + repeat(' ', 13 - text.length); // pad
                    line += text;
                }
                dump += line + "\n";
                line = '';
            }
            
            return dump;
        }
        
        self.get = function( x, y) {
            
            //console.log('MapGrid.get x=' + x + ' y=' + y + ' x/gridSize=' + x / gridSize + ' y/gridSize=' + y/gridSize );
    
            return self.cells[ adjX( x ) ][ adjY( y ) ];
        }
    }