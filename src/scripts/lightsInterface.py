# uncomment these
#from lightsManager import *
#from motorManagerDummy import *

import time
import sys
import select
import json

# TODO: check is the synching with timestamp & progress_ms required 
def startLights(tempo, sections, beats, timestamp, progress_ms):
    #print "asdasd"
    currentBeatIndex = 0

    # find the active section
    #for s in range(len(sections)):
    #    if sections[s].start >= progress_ms && sections[s].start + duration < progress_ms:
    #        currentSection = sections[s]
    
    for b in range(len(beats)):
        if beats[b].start >= progress_ms:
            switchLights()
            time.sleep(beats[b].duration)

            # if is the starting beat
            #if sections[b].start + sections[b].duration < progress_ms:
                #currentBeatIndex = b

def stopLights():
    resetLights()

# ---------------------------------------------------
#  when running this file, it always requires at least one parameter
#   [0] function type: 'auto', 'custom', 'stop'
#   [1] speed
functionType = sys.argv[1]
tempo = sys.argv[2]
sections = sys.argv[3]
beats = sys.argv[4]
timestamp = sys.argv[5] # the song was at progress_ms at this timestamp
progress_ms = sys.argv[6]


# run the program
if functionType == 'start':
    # when the custom run stops, it will return the current speed as parameter for stopMotor
    #customSpeed = int(sys.argv[2])
    stopLights(startLights(tempo, sections, beats, timestamp, progress_ms))
elif functionType == 'stop':
    stopLights()




