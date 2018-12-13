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
stageLightCount = 10

def resetLights():
    for pin in ControlPin:
        GPIO.setup(pin, GPIO.OUT)
        GPIO.output(pin, 0)
    GPIO.cleanup()

def doTransition():
    r = random.randint(0, 100)
    g = random.randint(0, 100)
    b = random.randint(0, 100)
    for i in range(stageLightCount):
        #for j in range(stageLightCount)
            #if i == j:
        pixels.clear()
        pixels.set_pixel(i, Adafruit_WS2801.RGB_to_color(r, g, b))
        pixels.show()
        time.sleep(transitionTime / stageLightCount)

def turnLightsOn(r, g, b):
    #r = random.randint(0, 100)
    #g = random.randint(0, 100)
    #b = random.randint(0, 100)
    for i in range(stageLightCount / 2):
        if random.randint(0,1) == 1:
            pixels.set_pixel(i, Adafruit_WS2801.RGB_to_color(r, g, b))
            pixels.set_pixel(stageLightCount - i , Adafruit_WS2801.RGB_to_color(r, g, b))
    #for i in range(10):
        #pixels.set_pixel(i, Adafruit_WS2801.RGB_to_color(100, 100, 100))
    pixels.show()

def turnLightsOff():
    pixels.clear()
    pixels.show()
