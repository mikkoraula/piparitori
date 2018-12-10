import RPi.GPIO as GPIO
import time
import sys
import json
 
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

def resetLights():
    for pin in ControlPin:
        GPIO.setup(pin, GPIO.OUT)
        GPIO.output(pin, 0)
    GPIO.cleanup()



def turnLightsOn():
    for i in range(pixels.count()):
        pixels.set_pixel(i, Adafruit_WS2801.RGB_to_color(100, 100, 100))
    pixels.show()
def turnLightsOff():
    pixels.clear()
    pixels.show()
