import sys
import random
import json

intensity = 5

def printData(dataObject):
    data = json.dumps(dataObject.__dict__)
    print(data)
    sys.stdout.flush()

# ---------------------------------------------------------
# this class holds all the stat data that is later sent to the server
class DataClass:
    def __init__(self, motorSpeed, minSpeed, maxSpeed, rotations, lives, maxLives, intensity, deathProbability, speedChangeDirection, deathRNG, speedChangeRNG, speedChangeProbability, maxLivesRNG, maxLivesProbability):
        #self.isMotorRunning = True
        self.speed = motorSpeed
        self.minSpeed = minSpeed
        self.maxSpeed = maxSpeed
        self.rotations = rotations
        self.lives = lives
        self.maxLives = maxLives
        self.intensity = intensity
        self.deathProbability = deathProbability
        self.speedChangeDirection = speedChangeDirection
        self.deathRNG = deathRNG
        self.speedChangeRNG = speedChangeRNG
        self.speedChangeProbability = speedChangeProbability
        self.maxLivesRNG = maxLivesRNG
        self.maxLivesProbability = maxLivesProbability

# -----------------------------------------------------------
# 
class HerbSystem:
    # constant class variables
    minSpeed            = 5
    maxSpeed            = 100
    intensity           = intensity # ???? how much should it be

    # probabilities
    speedChangeDirectionProbability = 0.15
    deathProbability                = 0.50
    maxLivesChangeProbability       = 0.50
    

    def __init__(self, startingSpeed):
        # herb system starts from slowest
        self.currentSpeed = startingSpeed
        # maximum lives changes dynamically to change the speed at which the speed changes
        self.maxLives = 3
        # how many times the rng must fail that the speed is changed
        self.lives = self.maxLives
        # by how much the speed is changed at once
        self.intensity = HerbSystem.intensity
        # how many rotations have been made since the herb system started
        self.rotations = 0
        # which direction the speed changes: 1 = faster, -1 = slower
        self.speedChangeDirection = 1
        
        # RNGs
        self.deathRNG = 0
        self.speedChangeRNG = 0
        self.maxLivesRNG = 0
        
    
    def updateProperty(self, currentValue, newValue, probability, probabilityBoundary):
        # random.random() generates a random float between [0,1)
        #rng = random.random()
        if probability < probabilityBoundary:
            return newValue
        else:
            return currentValue


    # this is called when lives drop to 0
    def updateSpeed(self):
        # change the current speed according to the direction and intensity
        self.currentSpeed = self.currentSpeed + self.speedChangeDirection * self.intensity
        if self.currentSpeed > HerbSystem.maxSpeed:
            self.currentSpeed = HerbSystem.maxSpeed
        if self.currentSpeed < HerbSystem.minSpeed:
            self.currentSpeed = HerbSystem.minSpeed
        

    # --------------------------------------------------------------------------------------
    # this method is used to get the speed of the next rotation
    def getNextSpeed(self):
        self.rotations = self.rotations + 1
        
        self.deathRNG = random.random()
        self.lives = self.updateProperty(self.lives, self.lives - 1, self.deathRNG, HerbSystem.deathProbability)
        # if there are no more lives left
        if self.lives == 0:
            self.speedChangeRNG = random.random()
            self.maxLivesRNG = random.random()
            
            self.speedChangeDirection = self.updateProperty(self.speedChangeDirection, -self.speedChangeDirection, self.speedChangeRNG, HerbSystem.speedChangeDirectionProbability)
            self.maxLives = self.updateProperty(self.maxLives, random.randint(1,5), self.maxLivesRNG, HerbSystem.maxLivesChangeProbability)
            self.updateSpeed()
            # reset lives
            self.lives = self.maxLives

        # print data every rotation
        printData(DataClass(self.currentSpeed, HerbSystem.minSpeed, HerbSystem.maxSpeed, self.rotations, self.lives, self.maxLives, HerbSystem.intensity, HerbSystem.deathProbability, self.speedChangeDirection, self.deathRNG, self.speedChangeRNG, HerbSystem.speedChangeDirectionProbability, self.maxLivesRNG, HerbSystem.maxLivesChangeProbability))

        # return the new current speed
        return self.currentSpeed
