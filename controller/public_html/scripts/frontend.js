'use strict';
var connected = false;
var server = null;
var client = new Eureca.Client();
var robot = null;
var x = 0;
var y = 0;

// Client functions the server can call
 client.exports.status = function (text)
{
    //console.log("status text=" + text);
    $('#status').val(text);
}
 client.exports.ping = function (text)
{
    //console.log("ping text=" + text);
    $('#ping').val(text);
    robot.command.ping = parseInt(text);
    //console.log('ping robot=',robot);
}             
 client.exports.setX = function (text)
{
    x = text;
    //console.log("x text=" + text);
    $('#x').val(text);
    robot.command.x = parseInt(text);
}             
 client.exports.setY = function (text)
{
    y = text;
    //console.log("x text=" + text);
    $('#y').val(text);
    robot.command.y = parseInt(text);
}             
 client.exports.heading = function (text)
{
    //console.log("heading text=" + text);
    var deg = text - 22.5
			if (deg < 0)
                deg += 360;

    $('#heading').val(deg);
    robot.command.heading = parseInt(deg);

    drawLocation(x,y);
}             
 client.exports.turet = function (text)
{
    //console.log("turet text=" + text);
    $('#turet').val(text);
    robot.command.turet = parseInt(text);
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
