'use strict';
var connected = false;
var server = null;
var client = new Eureca.Client();
var robot = null;
var x = 0;
var y = 0;


var radarCanvas  = new Canvas('radarCanvas', 400, 200);
var radarDisplay = new RadarDisplay(radarCanvas);	


// Client functions the server can call
 client.exports.status = function (text)
{
    //console.log("status text=" + text);
    $('#status').val(text);
}
 client.exports.setAll = function (x, y, heading, ping, turet)
{
    //console.log("ping text=" + text);
    $('#ping').val(ping);
    $('#x').val(x);
    $('#y').val(y);
    $('#heading').val(heading);
    $('#turet').val(turet);
    
    robot.command.ping      = parseInt(ping);
    robot.command.x         = parseInt(x);
    robot.command.y         = parseInt(y);
    robot.command.heading   = parseInt(heading);
    robot.command.turet     = parseInt(turet);

    drawLocation(x,y);
    
    radarDisplay.drawAndErase( robot.command.ping, robot.command.turet );
}             

client.ready(function (proxy) {
    server = proxy;
    server.connect();
    robot = new RealRobot(server);
    connected = true;
});

function drawLocation(xin,yin) {
    
    xin = (xin * 100) + 200;
    yin = (yin * 100) + 200;
    
    var c = document.getElementById("routeCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(xin,yin,5,0,2*Math.PI);
    ctx.stroke();
}
function sendCommand() {
    
    var commandForm = $('#commandForm').val();
    robot.sendCommand(commandForm);
}
function scanRoomMission() {

    var mapRoom = new MapRoom(robot,null);
    
	while ( ! mapRoom.complete ) {
		
		mapRoom.scanInitial();
	}    
}
