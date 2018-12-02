#print("reset non pi version")
#pi = 'tmp'

import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
# not doing anything right now??
GPIO.setwarnings = False

ControlPin = [7,11,13,15]

for pin in ControlPin:
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, 0)

GPIO.cleanup()

