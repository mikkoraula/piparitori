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

def tempoLights(tempo):
    print tempo
    lightsOn = False

    for b in range(100):
        if not lightsOn:
            print "turned lights on"
            turnLightsOn()
        else:
            print "turned lights off"
            turnLightsOff()
        lightsOn = not lightsOn
        time.sleep(60 / tempo)

def stopLights():
    resetLights()

# ---------------------------------------------------
#  when running this file, it always requires at least one parameter
#   [0] function type: 'auto', 'custom', 'stop'
#   [1] speed
functionType = sys.argv[1]
tempo = sys.argv[2]
#sections = sys.argv[3]
#beats = map(str, sys.argv[4].strip('[]').split(','))
#timestamp = sys.argv[5] # the song was at progress_ms at this timestamp
#progress_ms = sys.argv[6]


# run the program
if functionType == 'start':
    # when the custom run stops, it will return the current speed as parameter for stopMotor
    #customSpeed = int(sys.argv[2])
    print "start"
    #print beats
    #startLights(tempo, sections, beats, timestamp, progress_ms)
    tempoLights(float(tempo))
elif functionType == 'stop':
    stopLights()




