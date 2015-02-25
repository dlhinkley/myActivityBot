'use strict';
/**
* This was made after doing a bunch of testing and simulation with another robot object.  As a result,
* all the other code base based on the existance of this object.  This object doesn't do a whole lot.
* The commands are set from outside this class by accessing the self.command object directly
*/
function RealRobot(server) {
    
    var self = this;
    self.command = new Command('');
    
    self.sendCommand = function(cmd) {
    
        console.log('RealRobot.sendCommand cmd=',cmd);
        
        server.sendCommand(cmd);
    }
    self.getCommand = function() {
        
        console.log('RealRobot.getCommand command=',self.command);
        return self.command;
    }
    
    
}