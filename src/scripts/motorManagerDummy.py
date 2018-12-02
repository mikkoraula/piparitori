import time
import sys
import json

def runMotor(totalTime, speed):
	#print "'running' motor now for {} seconds with speed {}".format(totalTime, speed)
	time.sleep(totalTime)

def resetGPIO():
	nakki = 0
    #print "reset gpio"