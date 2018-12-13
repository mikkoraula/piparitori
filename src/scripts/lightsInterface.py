# uncomment these
from lightsManager import *
#from motorManagerDummy import *

import time
import sys
import select
import json

# TODO: check is the synching with timestamp & progress_ms required 
def startLights(tempo, sections, beats, timestamp, progress_ms):
    print beats
    currentBeatIndex = 0
    lightsOn = False

    # timestamp is the time at which progress_ms happened

    # find the active section
    #for s in range(len(sections)):
    #    if sections[s].start >= progress_ms && sections[s].start + duration < progress_ms:
    #        currentSection = sections[s]
    
    for b in range(len(beats)):
        if beats[b].start >= progress_ms:
            if not lightsOn:
                turnLightsOn()
            else:
                resetLights()
            lightsOn = not lightsOn
            time.sleep(beats[b].duration)

            # if is the starting beat
            #if sections[b].start + sections[b].duration < progress_ms:
                #currentBeatIndex = b

def transitionLights():
    doTransition()

def tempoLights(tempo, timestamp, progress_ms, next_beat_ms):
    print tempo
    lightsOn = False

    currentTime = int(round(time.time() * 1000))
    delay = currentTime - timestamp

    #beatStart = progress_ms
    sleepTime = 0
    #print "beatstart " + str(beatStart) + " < " + str(progress_ms + delay)
    while sleepTime < delay:
        sleepTime += 60000 / tempo
    sleepTime = (sleepTime - delay) / 1000
    print "delay was : " + str(delay) + ", going to sleep for " + str(sleepTime)
    time.sleep(sleepTime)

    for b in range(100):
        #if not lightsOn:
        print "turned lights on"
        turnLightsOn()
        time.sleep(60 / tempo / 2 - tempo / 10000)
        #else:
        print "turned lights off"
        turnLightsOff()
        #lightsOn = not lightsOn
        time.sleep(60 / tempo / 2)

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
transition = int(sys.argv[5])


# run the program
if functionType == 'start':
    # when the custom run stops, it will return the current speed as parameter for stopMotor
    #customSpeed = int(sys.argv[2])
    print "start"
    #print beats
    #startLights(tempo, sections, beats, timestamp, progress_ms)
    if (transition == 1)
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




