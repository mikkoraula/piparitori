import RPi.GPIO as GPIO
import time
import sys
import json

def printData(dataObject):
    data = json.dumps(dataObject.__dict__)
    print(data)
    sys.stdout.flush()

# ---------------------------------------------------------
# this class holds all the stat data that is later sent to the server
class DataClass:
    def __init__(self, rotations, totalRotations, motorSpeed, sleepTime):
        self.isMotorRunning = True
        self.speed = motorSpeed
        self.sleepTime = sleepTime
        self.rotations = rotations
        self.totalRotations = totalRotations

# ---------------------------------------------------------
# initialization

# motor has a gear reduction of 1/64
# 
cyclesPerRotation = 512 / 4

# set the GPIO pins that the motor is connected to
ControlPin = [7,11,13,15]


GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)
for pin in ControlPin:
    GPIO.setup(pin,GPIO.OUT)
    GPIO.output(pin,0)

hstepseq = [ [1,0,0,0],
        [1,1,0,0],
        [0,1,0,0],
        [0,1,1,0],
        [0,0,1,0],
        [0,0,1,1],
        [0,0,0,1],
        [1,0,0,1] ]
fstepseq = [ [1,1,0,0],
        [0,1,1,0],
        [0,0,1,1],
        [1,0,0,1] ]

def runMotor(totalTime, speed):
    # divide by 2
    speed = speed / 2

    # how quick the motor should run 
    minMotorSpeed = 1
    maxMotorSpeed = 100
    if speed < minMotorSpeed:
        speed = minMotorSpeed
    if speed > maxMotorSpeed:
        speed = maxMotorSpeed

    # ----------------------------------------------------------
    # smallest possible sleep time
    # this is a value tested by trial and error
    minSleepTime = 0.0017
    # largest possible sleep time
    # this can be changed based on how slow you want the motor to be able to run
    maxSleepTime = 0.009 
    # the range in which the sleepTime can vary
    sleepTimeRange = maxSleepTime - minSleepTime
    
    # how much one motorSpeed unit changes sleepTime
    sleepTimePerUnit = sleepTimeRange / maxMotorSpeed
    sleepTime = maxSleepTime - sleepTimePerUnit * speed
    
    # if we want the faster half (=full steps)
    stepsPerCycle = 4
    sequence = fstepseq 
    # if we want the slower half (=half steps)
    if speed <= maxMotorSpeed / 2.0:
        stepsPerCycle = 8
        sequence = hstepseq
        sleepTime = sleepTime / 2.0

    elapsedTime = 0
    
    # ----------------------------------------------------------
    # run the motor
    # 
    while elapsedTime < totalTime:
        for step in range(stepsPerCycle):
            for pin in range(4):
                GPIO.output(ControlPin[pin], sequence[step][pin])
            time.sleep(sleepTime)
            elapsedTime = elapsedTime + sleepTime



def runMotorRotations(rotations, speed):
    # ---------------------------------------------------------
    # check the parameters of the function

    # how many rotations the program runs
    minRotations = 1
    maxRotations = 50
    if rotations < minRotations:
        rotations = minRotations
    #if rotations > maxRotations:
    #    rotations = maxRotations

    # how quick the motor should run 
    minMotorSpeed = 1
    maxMotorSpeed = 100
    if speed < minMotorSpeed:
        speed = minMotorSpeed
    if speed > maxMotorSpeed:
        speed = maxMotorSpeed

    # ----------------------------------------------------------
    # smallest possible sleep time
    # this is a value tested by trial and error
    minSleepTime = 0.0017
    # largest possible sleep time
    # this can be changed based on how slow you want the motor to be able to run
    maxSleepTime = 0.009 
    # the range in which the sleepTime can vary
    sleepTimeRange = maxSleepTime - minSleepTime
    
    # how much one motorSpeed unit changes sleepTime
    sleepTimePerUnit = sleepTimeRange / maxMotorSpeed
    sleepTime = maxSleepTime - sleepTimePerUnit * speed
    
    # if we want the faster half (=full steps)
    stepsPerCycle = 4
    sequence = fstepseq 
    # if we want the slower half (=half steps)
    if speed <= maxMotorSpeed / 2.0:
        stepsPerCycle = 8
        sequence = hstepseq
        sleepTime = sleepTime / 2.0
    
    # ----------------------------------------------------------
    # run the motor
    # 
    for i in range(rotations):
        for j in range(cyclesPerRotation):
            for step in range(stepsPerCycle):
                for pin in range(4):
                    GPIO.output(ControlPin[pin], sequence[step][pin])
                time.sleep(sleepTime)
    



def resetGPIO():
    GPIO.cleanup()



