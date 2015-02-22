'use strict';
/**
 * Given the begining, ending cell and map grid, return the route to get there
 * Based on Wavefront algorithum here: http://www.societyofrobots.com/programming_wavefront.shtml
 * 
 */
function FindRoute( mapGrid) {
    
    var self = this;
    
        self.mapGrid = mapGrid;   
        self.mapGrid.clearAllPathStep();


    /**
     * Given the begining and ending cells, return the route as an array of cells 
     */
    self.getRoute = function(originCell, goalCell) {
        
        originCell.isOrigin = true;
        goalCell.isGoal = true;
        
        var routeStep = getRouteSteps(originCell, goalCell);
        routeStep--; // Point to next step
        
        var route = [];
        var cell = originCell;
        
        // Loop until the cell we're in matches the ending cell
        //
        while  (routeStep > 0 && ! cell.isGoal ) {
            
            // Save the children of cell
            var northCell = self.mapGrid.cellNorth( cell );
            var eastCell  = self.mapGrid.cellEast(  cell );
            var southCell = self.mapGrid.cellSouth( cell );
            var westCell  = self.mapGrid.cellWest(  cell );   
            
            if ( northCell.pathStep === routeStep ) {
                
                route.push(northCell);
                cell = northCell;
            }
            else if ( eastCell.pathStep === routeStep ) {
                
                route.push(eastCell);
                cell = eastCell;
            }
            else if ( southCell.pathStep === routeStep ) {
                
                route.push(southCell);
                cell = southCell;
            }
            else if ( westCell.pathStep === routeStep ) {
                
                route.push(westCell);
                cell = westCell;
            }
            routeStep--;
        }
        return route;
    }
    function getRouteSteps(originCell, goalCell) {
        
        console.log('FindRoute.getRoute start originCell=',originCell);
        console.log('FindRoute.getRoute start goalCell=',goalCell);

        
        self.step = 1;

        var foundStep = 0;
        var queue = [];
        
        goalCell.pathStep = 0;
        
        // Starts at the end and searches to begining
        queue.push(goalCell); // Initialize que
        
         
        while ( foundStep === 0 && queue.length > 0 ) {
            
            // Get current cell to check
            var cell = queue.shift();
            
            console.log('FindRoute.getRoute loop cell=',cell);
            
            // Save the children of cell
            var northCell = self.mapGrid.cellNorth( cell );
            var eastCell  = self.mapGrid.cellEast(  cell );
            var southCell = self.mapGrid.cellSouth( cell );
            var westCell  = self.mapGrid.cellWest(  cell );   
            
            if ( northCell 
                && ! northCell.isGoal 
                && ! northCell.isWall() 
                && northCell.pathStep === null )  {
                
                queue.push( northCell );
                
                if  ( northCell.isOrigin ) {
                
                    foundStep = self.step;
                }
                else {
                    
                    northCell.pathStep = self.step;
                }
            }
            if ( eastCell 
                && ! eastCell.isWall()  
                && ! eastCell.isGoal 
                && eastCell.pathStep  === null)  {
                
                queue.push( eastCell );
                
                if  ( eastCell.isOrigin ) {
                
                    foundStep = self.step;
                }
                else {
                    
                    eastCell.pathStep = self.step;
                }
            }
            if ( southCell 
                && ! southCell.isGoal 
                && ! southCell.isWall()  
                && southCell.pathStep === null  )  {

                queue.push( southCell );
                
                if  ( southCell.isOrigin ) {
                
                    foundStep = self.step;
                }
                else {
                    
                    southCell.pathStep = self.step;
                }
            }
            if ( westCell  
                && ! westCell.isGoal 
                && ! westCell.isWall()  
                && westCell.pathStep  === null )  {

                queue.push( westCell );
                
                if  ( westCell.isOrigin ) {
                
                    foundStep = self.step;
                }
                else {
                    
                    westCell.pathStep = self.step;
                }
            }

            self.step++;
            console.log('FindRoute.getRoute loop mapGrid.dump()=' + self.mapGrid.dump());
        }  
        return foundStep;
    }
}
