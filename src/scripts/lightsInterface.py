# uncomment these
from lightsManager import *
#from motorManagerDummy import *

import random
import time
import sys
import select
import json


def transitionLights():
    doStageTransition()

def tempoLights(tempo, timestamp, progress_ms, next_beat_ms):
    print tempo
    lightsOn = False

    currentTime = float(round(time.time() * 1000))
    delay = currentTime - timestamp

    #beatStart = progress_ms
    sleepTime = 0
    #print "beatstart " + str(beatStart) + " < " + str(progress_ms + delay)
    while sleepTime < delay:
        sleepTime += 60000 / tempo
    sleepTime = (sleepTime - delay) / 1000
    print "delay was : " + str(delay) + ", going to sleep for " + str(sleepTime)
    print "tempo sleep disabled"
    #time.sleep(sleepTime)
    
    # gbr
    r = random.randint(1, 50)
    # actually blue ?
    g = 0 #random.randint(1, 40)
    # actually green?
    b = random.randint(1, 50)
    for i in range(1000):
        #if not lightsOn:
        #turnArchLightsOn(r, g, b)
        turnStageLightsOn(r, g, b)
        time.sleep(60 / tempo / 2 - tempo / 10000)
        #else:
        turnStageLightsOff()
        #lightsOn = not lightsOn
        time.sleep(60 / tempo / 2)
        #if random.randint(1, 10) == 1:
        turnArchLightsOff()
        turnArchLightsOn(r, g, b)

def stopLights():
    resetLights()

# ---------------------------------------------------
#  when running this file, it always requires at least one parameter
#   [0] function type: 'auto', 'custom', 'stop'
#   [1] speed
functionType = sys.argv[1]
tempo = float(sys.argv[2])
#sections = sys.argv[3]
#beats = map(str, sys.argv[4].strip('[]').split(','))
timestamp = float(sys.argv[3]) # the song was at progress_ms at this timestamp
progress_ms = float(sys.argv[4])
next_beat_ms = float(sys.argv[5])
transition = int(sys.argv[6])


# run the program
if functionType == 'start':
    # when the custom run stops, it will return the current speed as parameter for stopMotor
    #customSpeed = int(sys.argv[2])
    print "start"
    #print beats
    #startLights(tempo, sections, beats, timestamp, progress_ms)
    if transition == 1:
        transitionLights()
        timestamp += transitionTime
        progress_ms += transitionTime
        added = 0
        while added < transitionTime:
            next_beat_ms += tempo
            added += tempo

    tempoLights(tempo, timestamp, progress_ms, next_beat_ms)
elif functionType == 'stop':
    stopLights()




