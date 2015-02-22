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
      KPING = 'p',
      KSCAN = 'n';
      
 int TDEG0,
      TDEG22,
      TDEG45,
      TDEG67,
      TDEG90,
      TDEG112,
      TDEG135,
      TDEG157,
      TDEG180;    
       
  int dist = 0;
      
  int TUR = 17; // Turret pin
  int PING = 16; // Ping pin
  int correction = -190; // turret correction
  

      
// The directions durring a scan
volatile char turetDir[5];

void pollPingSensors(void *par); // Use a cog to fill range variables with ping distances
unsigned int pstack[256]; // If things get weird make this number bigger!


// For Odometry
int ticksLeft, ticksRight, ticksLeftOld, ticksRightOld;
static double trackWidth, distancePerCount;

static volatile double heading = 0.0, x = 0.0, y = 0.0;
static volatile int pingRange0 = 0, turetHeading = 0, connected = 0, turetScan = 0;
//static int speedLeft, speedRight;

void getTicks();
void stopIfWall();
void positionTuret(char);
int isCmd(char[],char[]);

fdserial *blue;

int main()                              // Main - execution begins!
{

  TDEG0 =  0 + correction,
  TDEG22 = 220 + correction,
  TDEG45 = 450 + correction,
  TDEG67 = 670 + correction,
  TDEG90 = 900 + correction, //900
  TDEG112 = 1120 + correction,
  TDEG135 = 1350 + correction,
  TDEG157 = 1570 + correction,
  TDEG180 = 1800 + correction;
      
  //turetDir[0] = KDEG22;
  turetDir[0] = KDEG45;
  turetDir[1] = KDEG67;
  turetDir[2] = KDEG90;
  turetDir[3] = KDEG112;
  turetDir[4] = KDEG135;
  //turetDir[6] = KDEG157;
  
  // Turn off LEDs
  low(27);                   
  low(26);
       
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
      
     // Text manuver from: http://learn.parallax.com/activitybot/text-file-maneuver-list
     //
     getTicks();  // Check for ticks
     if (fdserial_rxReady(blue) != 0) { // Non blocking check for data in the input buffer
      connected = 1;
      

			char sbuf[20]; // A Buffer long enough to hold the longest line  may send.
			int count = 0;
			while (count < 20) {
				sbuf[count] = readChar(blue);
				if (sbuf[count] == '\r' || sbuf[count] == '\n') // Read until return
					break;
				count++;
			}
   
      char cmdbuf[10];                             // Command buffer
      char valbuf[4];                              // Text value buffer
      int  val;   
      int i = 0;                                 // Declare index variable
      // Parse command
      while(!isalpha(sbuf[i])) i++;             // Find 1st command char
      
      sscan(&sbuf[i], "%s", cmdbuf);            // Command -> buffer
      
      i += strlen(cmdbuf);                     // Idx up by command char count
      
      //if(!strcmp(cmdbuf, "end")) break;        // If command is end, break
  
      // Parse distance argument
      while(!isdigit(sbuf[i])) i++;             // Find 1st digit after command
      
      sscan(&sbuf[i], "%s", valbuf);            // Value -> buffer
      
      i += strlen(valbuf);                     // Idx up by value char count
      
      val = atoi(valbuf);                      // Convert string to value   
   
   
      //writeLine(blue,"Got it\n");
      
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
 
        if ( strcmp(cmdbuf,"scan") == 0) {
         
          // Toggle the scan status
          if ( turetScan == 0 ) {
            
            turetScan = 1;
          }
          else {
            
            turetScan = 0;
            //positionTuret(KDEG90); 
          }                         
        }
        else if ( strcmp(cmdbuf,"up") == 0 ) {
            //drive_rampStep(128, 128);   // Forward
            drive_goto(val,val);
        }
        else if ( strcmp(cmdbuf,"down") == 0 ) {
            //drive_rampStep(-128, -128); // Backward
            drive_goto(-val,-val);
        }
        else if ( strcmp(cmdbuf,"left") == 0  ) {
            //drive_rampStep(-128, 128); // Left turn
            drive_goto(-val,val);
        }
        else if ( strcmp(cmdbuf,"right") == 0  ) {
            //drive_rampStep(128, -128); // Right turn 
            drive_goto(val,-val);
        }
        else if ( strcmp(cmdbuf,"slow") == 0 ) {
            //drive_rampStep(0, 0);        // Slow
        }
        else if ( strcmp(cmdbuf,"stop") == 0  ) {
            drive_speed(0, 0);        // Stop
        }
       /*
        else if (strcmp(buf,KPING) ) {
            writeDec(blue, pingRange0);
            writeChar(blue,'\n');
        }

        else if (strcmp(buf,KBEARNG) ) {
            writeDec(blue, heading);
            writeChar(blue,'\n');
        }        
*/
        else {
          
          //positionTuret(buf);
        }                    
     }                       
  }            
}
int isCmd(char  *buf, char  *cmd) {
 
   int match = 0;
   if ( buf[0] == '!' &&  cmd[0] == '!'  ) {
    
      match = 1;
      int m = 0;
      while ( m < sizeof(buf) ) {
        
          if ( buf[m] != cmd[m] ) {
            
            match = 0;
          }      
      }    
   }  
   return match; 
  
}  
  
void positionTuret(char inBuff) {
  /*
        if (strcmp(inBuff,KDEG0) == 0 ) {
            servo_angle(TUR, TDEG0);
            turetHeading  = 0;
        }
        else if (strcmp(inBuff,KDEG22) == 0 ) {
            servo_angle(TUR, TDEG22); 
            turetHeading  = 22;
        }
        else if (strcmp(inBuff,KDEG45) == 0 ) {
            servo_angle(TUR, TDEG45);
            turetHeading  = 45;
        }
        else if (strcmp(inBuff,KDEG67) == 0 ) {
            servo_angle(TUR, TDEG67);  
            turetHeading  = 067;
        }
        else if (strcmp(inBuff,KDEG90) == 0 ) {
            servo_angle(TUR, TDEG90);
            turetHeading  = 90;
        }
        else if (strcmp(inBuff,KDEG112) == 0 ) {
            servo_angle(TUR, TDEG112); 
            turetHeading  = 112;
        }
        else if (strcmp(inBuff,KDEG135) == 0 ) {
            servo_angle(TUR, TDEG135);
            turetHeading  = 135;
        }
        else if (strcmp(inBuff,KDEG157) == 0 ) {
            servo_angle(TUR, TDEG157); 
            turetHeading  = 157;
        }
        else if (strcmp(inBuff,KDEG180) == 0 ) {
            servo_angle(TUR, TDEG180);
            turetHeading  = 180;
        } 
  */
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
      
  int scanPtr = 2; // position for 90 degrees
  int directionToggle = 1;
  while(1)                                    // Repeat indefinitely
  {
    pingRange0 = ping_cm(PING);                 // Get cm distance from Ping)))
    
    // If we're about to run into something, stop
    //
    if ( pingRange0 < 15 ) {
      
      drive_speed(0, 0);  
    }     
	
    
    pause(500);                               // Wait 1 second
    if ( connected == 1 ) dprint(blue, "command=update,x=%.3f,y=%.3f,heading=%.3f,ping=%d,turet=%d,scan=%d\n", x, y, heading, pingRange0, turetHeading,turetScan);

    // If scan enabled
    if ( turetScan == 1 ) {
      
       // scanPtr = 2
       // directionToggle = 1
       
       // Change the position of the turet
       int dir = turetDir[ scanPtr ];
       // dir 135
       //positionTuret(dir); 
       pause(500); // Pause a second to make sure the turet is positioned
       
       
       // If the ptr is greater than the number of positions, go the other way
       if ( scanPtr + directionToggle == sizeof(turetDir)) {
         high(26);                   
         low(27);
         directionToggle = -1;
       }
       // If the ptr is less than 0, go the other way
       else if ( scanPtr + directionToggle < 0 ) {
         
         high(27);                   
         low(26);
         directionToggle = 1;
       }   
       else {
         
         high(27);                   
         high(26); 
       }                              
       scanPtr += directionToggle;
    }      

  }
}
