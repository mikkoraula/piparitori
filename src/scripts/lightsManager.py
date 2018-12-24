import RPi.GPIO as GPIO
import time
import sys
import json
import random
 
# Import the WS2801 module.
import Adafruit_WS2801
import Adafruit_GPIO.SPI as SPI
 
 
# Configure the count of pixels:
PIXEL_COUNT = 64
 
# Alternatively specify a hardware SPI connection on /dev/spidev0.0:
SPI_PORT   = 0
SPI_DEVICE = 0
pixels = Adafruit_WS2801.WS2801Pixels(PIXEL_COUNT, spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE), gpio=GPIO)

GPIO.setmode(GPIO.BOARD)
# not doing anything right now??
GPIO.setwarnings = False

ControlPin = [7,11,13,15]

transitionTime = 1
stageLightStartIndex = 2
stageLightCount = 22
archLightStartIndex = 35
archLightCount = 18

def resetLights():
    for pin in ControlPin:
        GPIO.setup(pin, GPIO.OUT)
        GPIO.output(pin, 0)
    GPIO.cleanup()

def turnStageLightsOff():
    for i in range(stageLightStartIndex, stageLightStartIndex + stageLightCount):
        pixels.set_pixel(i, Adafruit_WS2801.RGB_to_color(0, 0, 0))
    pixels.show()

def doStageTransition():
    r = random.randint(0, 100)
    g = random.randint(0, 100)
    b = random.randint(0, 100)
    for i in range(stageLightStartIndex, stageLightStartIndex + stageLightCount):
        #for j in range(stageLightCount)
            #if i == j:
        turnStageLightsOff()
        pixels.set_pixel(i, Adafruit_WS2801.RGB_to_color(r, g, b))
        pixels.show()
        time.sleep(transitionTime / stageLightCount)

def turnStageLightsOn(r, g, b):
    for i in range(stageLightStartIndex, stageLightStartIndex + stageLightCount / 2):
        if random.randint(0,1) == 1:
            pixels.set_pixel(i, Adafruit_WS2801.RGB_to_color(b, g, r))
            pixels.set_pixel(stageLightCount - i + stageLightStartIndex , Adafruit_WS2801.RGB_to_color(b, g , r))
        pixels.show()

def turnArchLightsOn(r, g, b):
    for i in range(archLightStartIndex, archLightStartIndex + archLightCount):
        pixels.set_pixel(i, Adafruit_WS2801.RGB_to_color(b, g, r))



def turnLightsOff():
    pixels.clear()
    pixels.show()


def turnArchLightsOff():
    for i in range(archLightStartIndex, archLightStartIndex + archLightCount):
        pixels.set_pixel(i, Adafruit_WS2801.RGB_to_color(0, 0, 0))
    pixels.show()



#def turnArchOn(r, g, b):
    #r = random.randint(0, 100)
    #g = random.randint(0, 100)
    #b = random.randint(0, 100)
#    for i in range(stageLightCount):
        #for j in range(stageLightCount)
            #if i == j:
#        pixels.clear()
#        pixels.set_pixel(i, Adafruit_WS2801.RGB_to_color(r, g, b))
#        pixels.show()
#        time.sleep(transitionTime / stageLightCount)

#def turnArchOff():
   # for i in range(archLightStartIndex, archLightCount):
    


