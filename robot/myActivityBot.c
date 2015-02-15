/*
  AB-IR-Remote-Wav.c
  10/30/2013 version 0.5
  http://learn.parallax.com/activitybot

  ActivityBot plays WAV files on speaker from SD card
  Sensors: IR receiver on P10, touch whiskers on P7 & P8
  Control with Sony-compatible remote (Parallax #020-00001)
  (Brightstar: hold Setup until lit, then enter 605)
  Drive with 5 buttons: Channel+/-, Vol +/-, and mute
  Number keys select WAV files to play
  If whiskers are pressed, robot backs up & stops, plays WAV
*/

#include "simpletools.h"
#include "wavplayer.h"                  // Needs 0.9 or later              
#include "abdrive.h"                    // Needs 0.5.5 or later
#include "sirc.h"              
#include "fdserial.h"

fdserial *blue;

int main()                              // Main - execution begins!
{
  
  blue = fdserial_open(2, 1, 0, 9600);
  
  freqout(4, 2000, 2000);               // Start beep - low battery reset alarm
  drive_speed(0,0);                     // Start servos/encoders cog
  drive_setRampStep(10);                // Set ramping at 10 ticks/sec per 20 ms
  //sirc_setTimeout(50);                  // Remote timeout = 50 ms
  
  char UP = 'k';
  char LEFT = 'l';
  char RIGHT = 'h';
  char DOWN = 'j';
  char STOP = 's';


  int DO = 22, CLK = 23, DI = 24, CS = 25;  // Declare SD I/O pins
  int IR = 7;                               // IR Port
  sd_mount(DO, CLK, DI, CS);                // Mount SD card
  wav_volume(7);                            // Set vol here, 1 - 10  

  while(1)                               // Outer loop
  {
    //while((input(7) + input(8)) == 2)    // Inner loop while whiskers not pressed 
    //{
     // int button = sirc_button(IR);      // check for remote key press
      char c = fdserial_rxChar(blue);
      
      //print(button);
      print(c);
  
      // Audio responses - if number key pressed, play named WAV file
      if(c == '1')wav_play("hello.wav");               
      if(c == '2')wav_play("follow.wav");   
      if(c == '3')wav_play("byebye.wav");                
      if(c == '4')wav_play("oops.wav");                
      if(c == '5')wav_play("thankyou.wav");                 
      if(c == '6')wav_play("dontknow.wav");                   
      if(c == '7')wav_play("yes.wav");               
      if(c == '8')wav_play("no.wav");                
      if(c == '9')wav_play("maybe.wav"); 
      if(c == '0')wav_play("electro.wav");                  
  
      // Motion responses - if key pressed, set wheel speeds
      //if(c == UP) print("Forward");
      //if(c == DOWN) print("Backward");
      //if(c == LEFT) print("Left turn");    
      //if(c == RIGHT) print("Right turn");
      //if(c == STOP) print("Stop");

      if(c == UP)drive_rampStep(128, 128);   // Forward
      if(c == DOWN)drive_rampStep(-128, -128); // Backward
      if(c == LEFT)drive_rampStep(-128, 128); // Left turn      
      if(c == RIGHT)drive_rampStep(128, -128); // Right turn 
      if(c == STOP)drive_rampStep(0, 0);        // Stop 
    //}

    // Sensor response - if a whisker is pressed
    //drive_speed(0, 0);                  // Stop driving
    //drive_speed(-100, -100);            // Back up 0.5 seconds
    //pause(500); 
    //drive_speed(0, 0);                  // Stop driving
    //wav_play("ouch.wav");               // Play named WAV file
    //pause(1000);                        // Pause & return to outer loop
  }            
}

/*
  Bluetooth Loopback.c
*/
/*
#include "simpletools.h"
#include "fdserial.h"

fdserial *blue;

int main()
{
  int toggle = 0;
  
  blue = fdserial_open(2, 1, 0, 9600);

  print("running, \n");
  low(26);
  low(27);
  
  char c;
 
  while(1)
  {
    c = fdserial_rxChar(blue);
    fdserial_txChar(blue,c); // echo back
    
    if(c != -1 && c != 0 )
    {
      print("%d\n", c);

      if ( toggle == 1 ) {
        
          high(26);
          low(27); 
          toggle = 0;
        
      }
      else {
        
          high(27);
          low(26);
          toggle = 1;
      }                


    }
  }  
}


#include "simpletools.h"                      // Include simpletools header
#include "servo.h"                            // Include servo header

int main()                                    // main function
{
  int correction = -190;
  
  int deg90 = 900 + correction; //900
  int deg0 = 0 + correction; //900
  int deg180 = 1800 + correction; //900
  servo_angle(17, deg0);                         // P16 servo to 0 degrees
  pause(3000);                                // ...for 3 seconds
  servo_angle(17, deg90);                       // P16 servo to 90 degrees
  pause(3000);                                // ...for 3 seconds
  servo_angle(17, deg180);                      // P16 servo to 180 degrees
  pause(3000);                                // ...for 3 seconds
  servo_stop();                               // Stop servo process
}

*/