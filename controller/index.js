
// https://github.com/eelcocramer/node-bluetooth-serial-port
//
var btSerial = null;
var received = '';
var rxIn = '';
var prevCommand = '';
var eurecaClient = null;

// https://github.com/TooTallNate/keypress
/*
 Add the following to line 231 of index.js in keypress code to enable numbers
 else if (s.length === 1 && s >= '0' && s <= '9') {
    // Number
    key.name = s;

  } 
*/
/* var keypress = require('keypress'); */

var turet = null;

var commandKeyMatrix = {
                        'up': 'k',
                        'left': 'l',
                        'right': 'h',
                        'down': 'j',
                        'space': 's', // slow
                        'slow': 's', // slow
                        'x': 'x', // stop
                        'stop': 'x', // stop
                        'q': 'q', // 0
                        'w': 'w', // 22
                        'e': 'e', // 45
                        'r': 'r', // 67
                        't': 't', // 90 degree
                        'y': 'y', // 112
                        'u': 'u', // 135
                        'i': 'i', // 157
                        'o': 'o', // 180
                        'p': 'p', // ping
                        'ping': 'p', // ping
                        'c': 'c', // coordinates
                        'coords': 'c', // coordinates
};
function init() {

    initEureca();

    turet = new Turet();
    
}

function sendCommand(command) {
    
       // Send command to robot
    btSerial.write(new Buffer(command, 'utf-8'), function(err, bytesWritten) {
    
        if (err)  { 
        console.log(err);
        }
        else {
            
            prevCommand = command;
        }
        //console.log("bytesWritten=",bytesWritten);
    }); 
}
function receivedText(text) {
    
   //console.log('receivedText text=' + text);
       
   received = rxIn;
   
   if ( text.length > 14 && text.substring(0, 14) == 'command=update') {
       
       processUpdateCommand(text);
   }
   else if ( prevCommand === commandKeyMatrix.ping ) {
       
       console.log('eureca ping text=' + text);
       eurecaClient.ping(text);
   }
   else if ( prevCommand === commandKeyMatrix.coords ) {
       
       console.log('eureca coords text=' + text);
       eurecaClient.coords(text);
   }    
}
function processUpdateCommand(text) {
    
    text = text.trim();
    
    var commandValues = text.split(',');
    //console.log("commandValues=",commandValues);
    
    for (var m = 0; m < commandValues.length; m++ ) {
        
        //console.log("commandValues[m]=" + commandValues[m] + ' m=' + m);
        var parts = commandValues[m].split('=');
        
        //console.log('parts=',parts);
        
        var command = parts[0];
        var value = parts[1];
        
        //console.log('command=' + command + ' value=' + value);
        
        if ( command === 'x' ) {
            
            eurecaClient.setX(value);
        }
        else if ( command === 'y' ) {
            
            eurecaClient.setY(value);
        }
        else if ( command === 'heading' ) {
            
            eurecaClient.heading(value);
        }
        else if ( command === 'ping' ) {
            
            eurecaClient.ping(value);
        }
        else if ( command === 'turet' ) {
            
            turet.setDirection(value);
            eurecaClient.turet(value);
        }
     }
    
}
function keyPressEvent(ch, key) {

  //console.log('got "keypress"', key);
  
  // Cancel on control c
  if (key && key.ctrl && key.name == 'c') {
    //process.stdin.pause();
    process.exit(0);
  }
  else if (key && key.name && commandKeyMatrix.hasOwnProperty(key.name) ) {
      
    sendCommand( commandKeyMatrix[ key.name ]);
      
  }
  else if (key && key.name) {
    sendCommand(key.name);
  }
}



function btSerialFailureEvent(err) {
    
    console.log("btSerialFailureEvent err=",err);
}

function initSerial() {

    console.log('initSerial');

    btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

    btSerial.on('failure', btSerialFailureEvent);
    
    btSerial.on('found', function(address, name) {
    
    	console.log('address=' + address);
    	console.log('name=' + name);
    	
    	eurecaClient.status('found bluetooth');
    	
    	if (name === 'RN42-9699' && address == '00-06-66-65-96-99' ) {
    	
            btSerial.findSerialPortChannel(address, function(channel) {
            
                btSerial.connect(address, channel, function() {
                
                    console.log('connected');
                    eurecaClient.status('connected');

                    // Prepare response for command
                    //
                    btSerial.on('data', function(buffer) {
                    
                        var out = buffer.toString('utf-8');
                        //console.log('data out=' + out);
                        
                        for (var m = 0; m < out.length; m++) {
                            
                            //console.log('data m=' + m + ' char=' + out.charAt(m));
                            
                            if ( out.charAt(m) === '\n' ) {
                                
                                receivedText(rxIn);
                                rxIn = '';
                                //console.log('received=' + received);
                            }
                            else {
                                
                                rxIn += out.charAt(m);
                            }
                        }
                    });                   
                    
                }, function (error) {
                    console.log('cannot connect',error);
                });
        
                // close the connection when you're ready
                //btSerial.close();
                
            }, function(error) {
                console.log('found nothing',error);
            });
    	}
    	else {
    
    		console.log('skipping ' + name);
    	}
    });
    
    
    // Starts searching for bluetooth devices. When a device is found a 'found' event will be emitted.
    btSerial.inquire();
}
function initEureca() {
    
     console.log('initEureca');


    var express = require('express')
      , app = express(app)
      , server = require('http').createServer(app);
    var EurecaServer = require('eureca.io').EurecaServer;
     
    //we need to allow bar() function first
    var eurecaServer = new EurecaServer({allow:['status','ping','setX','setY','heading','turet']});
     
    eurecaServer.attach(server);
     
    // ... server initialisation
    eurecaServer.exports.connect = function () {
     //when a server side function is called
     //we can access the client connection
     //throught this.connection
     
        var conn = this.connection;
        eurecaClient = eurecaServer.getClient(conn.id);
        console.log('connected');
        eurecaClient.status('initilized'); // Call the client's code
        
        initSerial();

    } 
     
    //functions under "exports" namespace will be exposed to client side
    eurecaServer.exports.up = function () {
        console.log('Eureca up');
        sendCommand(commandKeyMatrix.up);
    }
    eurecaServer.exports.left = function () {
        console.log('Eureca left');
        sendCommand(commandKeyMatrix.left);
    } 
    eurecaServer.exports.right = function () {
        console.log('Eureca right');
        sendCommand(commandKeyMatrix.right);
    } 
    eurecaServer.exports.down = function () {
        console.log('Eureca down');
        sendCommand(commandKeyMatrix.down);
    }     
    eurecaServer.exports.stop = function () {
        console.log('Eureca stop');
        sendCommand(commandKeyMatrix.stop);
    }     
    eurecaServer.exports.slow = function () {
        console.log('Eureca slow');
        sendCommand(commandKeyMatrix.slow);
    }     
    eurecaServer.exports.ping = function () {
        console.log('Eureca ping');
        sendCommand(commandKeyMatrix.ping);
    }     
    eurecaServer.exports.turetLeft = function () {
        console.log('Eureca turet left');
        turet.left();
        sendCommand( turet.getCommand() );
    }     
    eurecaServer.exports.turetRight = function () {
        console.log('Eureca turet right');
        turet.right();
        sendCommand( turet.getCommand() );
    }     
    eurecaServer.exports.turetStraight = function () {
        console.log('Eureca turet straight');
        turet.straight();
        sendCommand( turet.getCommand() );
    }     
    
    
       //------------------------------------------
     
    //see browser client side code for index.html content
/*
    app.get('/', function (req, res, next) {
        res.sendfile('index.html');
    });
*/
    app.use(express.static(__dirname + '/public_html'));
    
    server.listen('8000');
    
    console.log("");
    console.log("");
    console.log("Access/Refreash http://localhost:8000 to continue");
    
}
function Turet() {
    
    self = this;
    self.direction = 0;
    
    self.directions = [
    {'deg':'0','cmd': 'q'},
    {'deg':'22','cmd':'w'},
    {'deg':'45','cmd':'e'},
    {'deg':'67','cmd':'r'},
    {'deg':'90','cmd':'t'},
    {'deg':'112','cmd':'y'},
    {'deg':'135','cmd':'u'},
    {'deg':'157','cmd':'i'},
    {'deg':'180','cmd':'o'}
    ];
    self.pointer = 4; // default to 90 degree
    
    self.right = function() {
        
        if ( self.pointer - 1 >= 0 )  {
            
            self.pointer--;
        }
    }
    self.getCommand = function() {
        
        return self.directions[ self.pointer ].cmd;
    }
    self.left = function() {
        
        if ( self.pointer + 1 < self.directions.length )  {
            
            self.pointer++;
        }
    }
    self.straight = function() {
        
        self.setDirection('90');
    }
    self.setDirection = function(value) {
        
        self.direction = value;
        
        for ( var m = 0; m < self.directions.length; m++) {
            
            if ( self.directions[m].deg === value ) {
                
                self.pointer = m;
            }
        }
    }
    
}
init();