'use strict';
/**
* object for searchin for wall
*/
function WallSearch(beginCell, mapGrid, canvas) {
  
  var self = this;
  var maxLength = 0;
  var longWallCell = null;
  self.beginCell = beginCell;
  self.mapGrid = mapGrid;
  self.mapGrid.clearAllPathStep();
  
  /**
  * Recusively search for longest wall and return a cell next to the wall
  */
  self.getLongestWall = function() {
  	
      maxLength = 0;
      longWallCell = null;
      
  	searchWall(self.beginCell);
  	
  	return longWallCell;
  }
  self.getMaxLength = function() {
      
      return maxLength;
  }

  /**
   * Recursivly search for wall
   */
  function searchWall(cellIn) {

    console.log('WallSearch.searchWall start cell=',cellIn);
  
    var queue = [];
    queue.push(cellIn); // Initialize que
    
      
    while ( queue.length > 0 ) {
        
        // Get current cell to check
        var cell = queue.shift();
        
        console.log('WallSearch.searchWall loop cell=',cell);
        
        // Save the children of cell
        var northCell = self.mapGrid.cellNorth( cell );
        var eastCell  = self.mapGrid.cellEast(  cell );
        var southCell = self.mapGrid.cellSouth( cell );
        var westCell  = self.mapGrid.cellWest(  cell );   
        
        if ( northCell && northCell.pathStep === null && ! inQueue(queue, northCell) )  queue.push( northCell );
        if ( eastCell  && eastCell.pathStep  === null && ! inQueue(queue, eastCell)  )  queue.push( eastCell );
        if ( southCell && southCell.pathStep === null && ! inQueue(queue, southCell)  )  queue.push( southCell );
        if ( westCell  && westCell.pathStep  === null && ! inQueue(queue, westCell)  )  queue.push( westCell );

        cell.pathStep = 1;
          
          
        if ( cell.isWall() ) {
          
          checkWallLength( cell );
        }
    }
  }
  function inQueue(queue, cell) {
      
      var found = false;
      var m = 0;
      
      while ( ! found && m < queue.length ) {

          if ( queue[m].x === cell.x && queue[m].y === cell.y ) {
              
              found = true;
          }
          
          m++;
      }
      return found;
  }

  /**
   * Given a cell that is a wall, return how many cell long it is
   */
  function checkWallLength(cell) {
      
      console.log('WallSearch.checkWallLength start cell=' , cell);
      var length = 1;
      
      // It's a North South Wall
      if ( self.mapGrid.cellNorth(cell) && self.mapGrid.cellNorth(cell).isWall() && self.mapGrid.cellSouth(cell) && self.mapGrid.cellSouth(cell).isWall() ) {
          
          length += getNorthLength( self.mapGrid.cellNorth(cell) );
          length += getSouthLength( self.mapGrid.cellSouth(cell) );
          
          if ( length > maxLength ) {
              
              maxLength = length;
              longWallCell = cell;
          }
      }
      // It's a East West Wall
      if ( self.mapGrid.cellEast(cell) && self.mapGrid.cellEast(cell).isWall() && self.mapGrid.cellWest(cell) && self.mapGrid.cellWest(cell).isWall() ) {
          
          length += getEastLength( self.mapGrid.cellEast(cell) );
          length += getWestLength( self.mapGrid.cellWest(cell) );
          
          if ( length > maxLength ) {
              
              maxLength = length;
              longWallCell = cell;
          }
      }
  }
  function getNorthLength(cell) {
       
      var length = 1;
      
      if ( self.mapGrid.cellNorth(cell) && self.mapGrid.cellNorth(cell).isWall() ) {
          
          length += getNorthLength( self.mapGrid.cellNorth(cell) );
      }
      return length;
  }
  function getSouthLength(cell) {
       
      var length = 1;
      
      if ( self.mapGrid.cellSouth(cell) && self.mapGrid.cellSouth(cell).isWall() ) {
          
          length += getSouthLength( self.mapGrid.cellSouth(cell) );
      }
      return length;
  }
  function getEastLength(cell) {
       
      var length = 1;
      
      if ( self.mapGrid.cellEast(cell) && self.mapGrid.cellEast(cell).isWall() ) {
          
          length += getEastLength( self.mapGrid.cellEast(cell) );
      }
      return length;
  }
  function getWestLength(cell) {
       
      var length = 1;
      
      if ( self.mapGrid.cellWest(cell) && self.mapGrid.cellWest(cell).isWall() ) {
          
          length += getWestLength( self.mapGrid.cellWest(cell) );
      }
      return length;
  }


}
