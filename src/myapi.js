/**
 * myapi.js
 * 
 *
 * 
 * DESCRIPTION:
 * todo
 * 
 * @throws none
 * @see nodejs.org
 * @see express.org
 * 
 * @author Mikko
 */

var http      = require('http');
var express   = require('express');
var util      = require('util');
var nunjucks  = require('nunjucks');
var fs        = require('fs');
var bodyParser= require('body-parser');
var img       = require('./load_pictures');

// for reading POST request data
var app       = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// for runnign the motor in a child process
var motorProcess = require('child_process').spawn;
var child;
var isMotorRunning = false;
// none, custom, auto, stop
var runningMode = 'none';
var currentSpeed = 5;

// -----------------------------------------------------------------------
// data class
// keep track of the json stats object
var dataObject = '{}';
function resetData() {
    dataObject = '{}';
    runningMode = 'none';
    isMotorRunning = false;
    currentSpeed = 5;
}
resetData();
// ------------------------------------------------------------------------
// configure the nunjucks (jinja)

nunjucks.configure('templates', {
    autoescape: true,
    express: app
});
var testString = 'hello hello hello';

// ---------------------------------------------------------------------------
// spotify
//var spotifyPlayer = new

// -------------------------------------------------------------------------
// motor communication functions

function stopMotor() {
    require('child_process').execSync('python "scripts/reset.py"', ['-i']);    
    if (child !== undefined) {
        //console.log('child ' + `child ${child}`);
        child.kill();
        isMotorRunning = false;
        resetData();
    }
}


function runMotor(argumentsList) {
    stopMotor();
    console.log("argumentsList");
    console.log(argumentsList);

    runningMode = argumentsList[0];
    child = motorProcess('python', ['scripts/motorInterface.py', argumentsList[0], argumentsList[1]]);
    //console.log()

    isMotorRunning = true;
    //util.log('redingin');

    child.stdout.on('data', function(chunk) {
        if (runningMode == 'auto')
            dataObject = chunk.toString('utf8');
        if (runningMode == 'custom') {
            //var newSpeed = JSON.parse(dataObject).speed;
            //if (newSpeed !== null) {
                //currentSpeed = parseInt(newSpeed);
                console.log("found new currentSpeed from python " + chunk.toString('utf8'));
            //}
        }   

        //console.log(currentSpeed);
        //console.log(dataObject);
    });
    child.on('error', function (code, signal) {
        util.log('child process error with ' +
                      `code ${code} and signal ${signal}`);
    });
    child.on('exit', function (code, signal) {
        util.log('child process exited with ' +
                      `code ${code} and signal ${signal}`);
        resetData();
    });
}

function changeCustomSpeed(newSpeed) {
    //if (runningMode == 'custom') {
        console.log("before python conn ");
        // kind of hacky
        if (newSpeed === 100)
            child.stdin.write('' + newSpeed);
        else if (newSpeed === 5)
            child.stdin.write('00' + newSpeed);
        else 
            child.stdin.write('0' + newSpeed);
        //child.stdin.end();
        console.log("hello world");
        currentSpeed = newSpeed;
        console.log("finished");
    //}
}

// ------------------------------------------------------------------------
// configure Express to serve index.html and any other static pages stored 
// in the home directory


app.use(express.static(__dirname));
//app.use(express.static(__dirname/templates));
//app.use(express.static(__dirname/styles));
/*
app.get('/rng-test/', function(req, res) {
    // if the herb system is already running, just show the statistic tables and don't reset the motor process
    console.log("current runnig mode " + runningMode);
    if (runningMode !== 'auto')
        if (runningMode === 'custom') {
            stopMotor();
            res.redirect('/');
            return;
        }
        else
            runMotor(['auto', currentSpeed]);

    res.render('automatic.html'); 
});
*/
// ------------------------------------------------------------------------
// custom
/*
app.get('/custom/', function(req, res) {
    if (runningMode === 'auto') {
        stopMotor();
        res.redirect('/');
        return;
    }

    runMotor(['custom', currentSpeed])
    res.render('customRun.html');
});

app.get('/custom/change/:newSpeed', function(req, res) {
    var newSpeed = parseInt(req.params.newSpeed);
    console.log('changing speed to ' + newSpeed);
    console.log('runningMode ' + runningMode);
    changeCustomSpeed(newSpeed);
    res.send(JSON.stringify(newSpeed));
});

app.get('/custom/getspeed', function(req, res, err) {
    res.send(JSON.stringify(currentSpeed)); 
});
*/
// custom end
// ------------------------------------------------------------------------
/*
app.get('/stop/', function(req, res) {
    //runMotor(['stop', currentSpeed])
    stopMotor();
    res.redirect('/');
});
*/
app.get('/gallerymenu/', function(req, res) {
    var menuImages = [
        {src: "../images/gallery/finished.jpg", name: "finished", caption: "Kuvia valmistuneesta talosta"},
        {src: "../images/gallery/progress.jpg", name: "progress", caption: "Miten tämä piparkakkutalo syntyi"},
        {src: "../images/gallery/old.jpg", name: "old", caption: "Viime vuosien piparkakkutaloja"},
        {src: "../images/gallery/old.jpg", name: "story", caption: "Piparkakkutarina"}
    ];

    res.render('galleryMenu.html', {images: menuImages});
});

app.get('/gallery/:galleryName', function(req, res) {
    // read images
    var images = []
    fs.readdirSync('./images/gallery/' + req.params.galleryName + '/').forEach(file => {
        images.push('../images/gallery/' + req.params.galleryName + '/' + file);
    });
    // sort the images so they are alphabetical
    images.sort(function(a, b){
        var anum = a.match(/\d+/);
        var bnum = b.match(/\d+/);
        if (anum !== null && bnum !== null) {
            a = parseInt(anum);
            b = parseInt(bnum);
        }

        if(a < b) return -1;
        if(a > b) return 1;
        return 0;
    });

    // read the captions
    var captions = [];
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('./images/gallery/' + req.params.galleryName + '/captions.txt')
    });

    lineReader.on('line', function (line) {
        console.log('HAHAHA ' + line);
        captions.push(line);
    });
    lineReader.on('close', function() {
        console.log("finished line reading");
        console.log("nubmer of lines " + captions.length);
        res.render('gallery.html', {images: images, captions: captions});
    })
});

app

app.get('/refresh/', function(req, res, err) {
    //console.log(dataObject);
    res.send(dataObject); 
});

app.get('/', function(req, res) {
    res.render('index.html')
});

// Express route for any other unrecognised incoming requests
app.get('*', function (req, res) {
  res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, Something went wrong!');
  } else {
    next(err);
  }
});
// ------------------------------------------------------------------------
// Start Express App Server
//
app.listen(5000);
util.log('App Server is listening on port 5000');
