function rad(deg) {
	
	return deg * Math.PI / 180;
}
function toDeg(rad) { 

    return ( 180 * rad / Math.PI) % 360;
};
function lineAngleDeg(line) {
    
    var dx = line.end.x - line.start.x
    var dy = line.end.y - line.start.y


    var bearing = (180 / Math.PI) * Math.atan2(dy, dx) + 90;
    
    if ( bearing < 0 ) {
        
        bearing = 360 + bearing;
    }
    console.log('lineAngleDeg dx=' + dx + ' dy=' + dy + ' bearing=' + bearing);

    return bearing;
}
/**
* returns true if all points are straight line
*/
function collinear( x1,  y1,  x2,  y2,  x3,  y3) {

	x1 = Math.round(x1);
	y1 = Math.round(y1);
	x2 = Math.round(x2);
	y2 = Math.round(y2);
	x3 = Math.round(x3);
	y3 = Math.round(y3);
	
  return (y1 - y2) * (x1 - x3) == (y1 - y3) * (x1 - x2);
}