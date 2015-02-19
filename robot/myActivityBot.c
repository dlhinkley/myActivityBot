/*
 
  Location code from: https://github.com/chrisl8/ActivityBot/blob/master/Propeller/ROS%20Interface%20for%20ActivityBot.c
  
  
*/

#include "simpletools.h"
//#include "wavplayer.h"                  // Needs 0.9 or later              
#include "abdrive.h"                    // Needs 0.5.5 or later
//#include "sirc.h"              
#include "fdserial.h"
#include "servo.h"                            // Include servo header
#include "ping.h"

  char UP = 'k',
      LEFT = 'l',
      RIGHT = 'h',
      DOWN = 'j',
      STOP = 'x', 
      SLOW = 's', 
      KDEG0 = 'q',
      KDEG22 = 'w',
      KDEG45 = 'e',
      KDEG67 = 'r',
      KDEG90 = 't',
      KDEG112 = 'y',
      KDEG135 = 'u',
      KDEG157 = 'i',
      KDEG180 = 'o',
      KCOORD = 'c',
      KBEARNG = 'b',
      KPING = 'p';
      
      
  int dist = 0;
      
  int TUR = 17; // Turret pin
  int PING = 16; // Ping pin
  int correction = -190; // turret correction

  int TDEG0,TDEG22,TDEG45,TDEG67,TDEG90,TDEG112,TDEG135,TDEG157,TDEG180;;


void pollPingSensors(void *par); // Use a cog to fill range variables with ping distances
unsigned int pstack[256]; // If things get weird make this number bigger!


// For Odometry
int ticksLeft, ticksRight, ticksLeftOld, ticksRightOld;
static double trackWidth, distancePerCount;

static volatile double heading = 0.0, x = 0.0, y = 0.0;
static volatile int pingRange0 = 0, turetHeading = 0, connected = 0;
//static int speedLeft, speedRight;

void getTicks();
void stopIfWall();

fdserial *blue;

int main()                              // Main - execution begins!
{
  
  int TDEG0 =  0 + correction,
      TDEG22 = 220 + correction,
      TDEG45 = 450 + correction,
      TDEG67 = 670 + correction,
      TDEG90 = 900 + correction, //900
      TDEG112 = 1120 + correction,
      TDEG135 = 1350 + correction,
      TDEG157 = 1570 + correction,
      TDEG180 = 1800 + correction;
        
  simpleterm_close(); 
  blue = fdserial_open(2, 1, 0, 9600);

   // Start the sensor cog(s)
	cogstart(&pollPingSensors, NULL, pstack, sizeof(pstack));

  
  freqout(4, 2000, 2000);               // Start beep - low battery reset alarm
  
  trackWidth = 0.1058; // http://learn.parallax.com/activitybot/calculating-angles-rotation
  distancePerCount = 0.00325;
  
  
  drive_speed(0,0);                     // Start servos/encoders cog
  drive_setRampStep(10);                // Set ramping at 10 ticks/sec per 20 ms
  //sirc_setTimeout(50);                  // Remote timeout = 50 ms
  

   servo_angle(TUR, TDEG90);  // default to straight ahead
  turetHeading  = 90;
  
  //int DO = 22, CLK = 23, DI = 24, CS = 25;  // Declare SD I/O pins
  //int IR = 7;                               // IR Port
  //sd_mount(DO, CLK, DI, CS);                // Mount SD card
  //wav_volume(7);                            // Set vol here, 1 - 10  

  while(1)                               // Outer loop
  {
    //while((input(7) + input(8)) == 2)    // Inner loop while whiskers not pressed 
    //{
     // int button = sirc_button(IR);      // check for remote key press
      
     getTicks();  // Check for ticks
     
     if (fdserial_rxReady(blue) != 0) { // Non blocking check for data in the input buffer
      connected = 1;
      
      char c = fdserial_rxChar(blue);
      
  	   //drive_getTicks(&ticksLeftIn, &ticksRightIn);
       //x = x + ticksLeftIn;
       //y = y + ticksRightIn;
       
        //print(button);
        //print(c);
    
        // Audio responses - if number key pressed, play named WAV file
        //if(c == '1')wav_play("hello.wav");               
        //if(c == '2')wav_play("follow.wav");   
        //if(c == '3')wav_play("byebye.wav");                
        //if(c == '4')wav_play("oops.wav");                
        //if(c == '5')wav_play("thankyou.wav");                 
        //if(c == '6')wav_play("dontknow.wav");                   
        //if(c == '7')wav_play("yes.wav");               
        //if(c == '8')wav_play("no.wav");                
        //if(c == '9')wav_play("maybe.wav"); 
        //if(c == '0')wav_play("electro.wav");                  
    
        // Motion responses - if key pressed, set wheel speeds
        //if(c == UP) print("Forward");
        //if(c == DOWN) print("Backward");
        //if(c == LEFT) print("Left turn");    
        //if(c == RIGHT) print("Right turn");
        //if(c == STOP) print("Stop");
  
        if ( c == UP ) {
            drive_rampStep(128, 128);   // Forward
        }
        else if (c == DOWN ) {
            drive_rampStep(-128, -128); // Backward
        }
        else if (c == LEFT ) {
            drive_rampStep(-128, 128); // Left turn
        }
        else if (c == RIGHT ) {
            drive_rampStep(128, -128); // Right turn 
        }
        else if (c == SLOW ) {
            drive_rampStep(0, 0);        // Slow
        }
        else if (c == STOP ) {
            drive_speed(0, 0);        // Stop
        }
        else if (c == KDEG0 ) {
            servo_angle(TUR, TDEG0);
            turetHeading  = 0;
        }
        else if (c == KDEG22 ) {
            servo_angle(TUR, TDEG22); 
            turetHeading  = 22;
        }
        else if (c == KDEG45 ) {
            servo_angle(TUR, TDEG45);
            turetHeading  = 45;
        }
        else if (c == KDEG67 ) {
            servo_angle(TUR, TDEG67);  
            turetHeading  = 067;
        }
        else if (c == KDEG90 ) {
            servo_angle(TUR, TDEG90);
            turetHeading  = 90;
        }
        else if (c == KDEG112 ) {
            servo_angle(TUR, TDEG112); 
            turetHeading  = 112;
        }
        else if (c == KDEG135 ) {
            servo_angle(TUR, TDEG135);
            turetHeading  = 135;
        }
        else if (c == KDEG157 ) {
            servo_angle(TUR, TDEG157); 
            turetHeading  = 157;
        }
        else if (c == KDEG180 ) {
            servo_angle(TUR, TDEG180);
            turetHeading  = 180;
        }
        else if (c == KPING ) {
            writeDec(blue, pingRange0);
            writeChar(blue,'\n');
        }

        else if (c == KBEARNG ) {
            writeDec(blue, heading);
            writeChar(blue,'\n');
        }        
      
     }                       
  }            
}
 


void getTicks(void) {
	ticksLeftOld = ticksLeft;
	ticksRightOld = ticksRight;
	drive_getTicks(&ticksLeft, &ticksRight);
	//drive_getSpeedCalc(&speedLeft, &speedRight);
 
 	int deltaTicksLeft = ticksLeft - ticksLeftOld;
	int deltaTicksRight = ticksRight - ticksRightOld;
	double deltaDistance = 0.5f * (double) (deltaTicksLeft + deltaTicksRight) * distancePerCount;
	double deltaX = deltaDistance * (double) cos(heading);
	double deltaY = deltaDistance * (double) sin(heading);
	double RadiansPerCount = distancePerCount / trackWidth;
	double deltaHeading = (double) (deltaTicksRight - deltaTicksLeft) * RadiansPerCount;

	x += deltaX;
	y += deltaY;
	heading += deltaHeading;
	// limit heading to -Pi <= heading < Pi
	if (heading > PI) {
		heading -= 2.0 * PI;
	} else {
		if (heading <= -PI) {
			heading += 2.0 * PI;
		}
	}
}
void pollPingSensors(void *par) {
      
  while(1)                                    // Repeat indefinitely
  {
    pingRange0 = ping_cm(PING);                 // Get cm distance from Ping)))
    
    if ( pingRange0 < 15 ) {
      
      drive_speed(0, 0);  
    }     
	
    
    pause(3000);                               // Wait 1 second
    if ( connected == 1 ) dprint(blue, "command=update,x=%.3f,y=%.3f,heading=%.3f,ping=%d,turet=%d\n", x, y, heading, pingRange0, turetHeading);
  }
}
