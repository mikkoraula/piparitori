# uncomment these
from motorManager import *
#from motorManagerDummy import *

from HerbSystem import HerbSystem
import time
import sys
import select
import json


# If there's input ready, do something, else do something
# else. Note timeout is zero so select won't block at all.
def checkForSpeedChange(currentSpeed):
    #print "checkforspeedchange"
    if sys.stdin in select.select([sys.stdin], [], [], 0)[0]:
        line = ''
        # the speed is 3 digits
        line += sys.stdin.read(3)
        if line:
            newSpeed = int(line)
            #print "newSpeed: {}".format(newSpeed)
            return newSpeed
    return currentSpeed

def runCustom(speed):
    #print "asdasd"
    # customrun will run for 60 seconds
    speed = 0
    for i in range(60):
        runMotor(1, speed)
        speed = checkForSpeedChange(speed)
        print "new speed from python: {}".format(speed)
        sys.stdout.flush()

    return speed

def runHerbSystem(speed):
    herbSystem = HerbSystem(speed)
    for i in range(1, 600):
        runMotor(1, herbSystem.getNextSpeed())
        speed = checkForSpeedChange(speed)
        # code for custom run
    return herbSystem.getNextSpeed()

def stopMotor(currentSpeed):
    # decrease 5 speed every second
    while currentSpeed / intensity > 0:
        runMotor(1, currentSpeed)
        currentSpeed = currentSpeed - intensity
    # finally close GPIO
    resetGPIO()

# ---------------------------------------------------
#  when running this file, it always requires at least one parameter
#   [0] function type: 'auto', 'custom', 'stop'
#   [1] speed
functionType = sys.argv[1]

# run the program
if functionType == 'custom':
    # when the custom run stops, it will return the current speed as parameter for stopMotor
    #customSpeed = int(sys.argv[2])
    stopMotor(runCustom(int(sys.argv[2])))
elif functionType == 'auto':
    # when the herb system stops, it will return the current speed as parameter for stopMotor
    stopMotor(runHerbSystem(int(sys.argv[2])))
elif functionType == 'stop':
    stopMotor(int(sys.argv[2]))




