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
const config  = require('./config.js');

// for reading POST request data
var app       = express();
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.json({limit: '50mb'}));

var useDummys = true;
// for runnign the motor in a child process
var motorProcess = require('child_process').spawn;
var child;
var isMotorRunning = false;
// for controlling the led lights
var lightsProcess = require('child_process').spawn;
var lightsChild;
var isLightsRunning = false;
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
    if (useDummys) {
        console.log("stop motor dummy");
        return;
    }
    require('child_process').execSync('python "scripts/reset.py"', ['-i']);    
    if (child !== undefined) {
        //console.log('child ' + `child ${child}`);
        child.kill();
        isMotorRunning = false;
        resetData();
    }
}
function runMotor(argumentsList) {
    if (useDummys) {
        console.log("run motor dummy");
        return;
    }
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
    if (useDummys) {
        console.log("change custom speed motor dummy");
        return;
    }
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
// LED LIGHTS CONTROL

function stopLights() {
    if (useDummys) {
        console.log("stop lights dummy");
        return;
    }
    if (lightsChild) {
        console.log('child ' + `child ${child}`);
        lightsChild.kill();
        isLightsRunning = false;
    }
    require('child_process').execSync('python "scripts/resetLights.py"', ['-i']);    
}
function startLights(analysisObject, doTransition) {
    if (useDummys) {
        console.log("start lights dummy");
        return;
    }
    stopLights();
    //console.log("analysisObject ", analysisObject);

    var argumentsList = [];
    argumentsList.push("start");
    argumentsList.push(analysisObject.tempo); // tempo
    //argumentsList.push(analysisObject.sections); // sections
    //argumentsList.push(analysisObject.beats); // beats
    argumentsList.push(analysisObject.analysis_time_stamp); // timestamp
    argumentsList.push(analysisObject.analysis_progress_ms); // progress_ms
    argumentsList.push(analysisObject.analysis_next_beat_ms); // progress_ms
    console.log("python lightsInterface.py " + argumentsList[0] + " " + argumentsList[1] + " " + argumentsList[2] + " " + argumentsList[3] + " " + argumentsList[4] + " " + doTransition);
    lightsChild = motorProcess('python', ['scripts/lightsInterface.py', argumentsList[0], argumentsList[1], argumentsList[2], argumentsList[3], argumentsList[4], doTransition]);

    isLightsRunning = true;

    lightsChild.on('error', function (code, signal) {
        util.log('lights child process error with ' +
                      `code ${code} and signal ${signal}`);
    });
    lightsChild.on('exit', function (code, signal) {
        util.log('lights child process exited with ' +
                      `code ${code} and signal ${signal}`);
    });
}


// ------------------------------------------------------------------------
// configure Express to serve index.html and any other static pages stored 
// in the home directory


app.use(express.static(__dirname));
//app.use(express.static(__dirname/templates));
//app.use(express.static(__dirname/styles));

app.get('/auto/', function(req, res) {
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

// ------------------------------------------------------------------------
// custom

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

// custom end
// ------------------------------------------------------------------------

app.get('/stop/', function(req, res) {
    runMotor(['stop', currentSpeed])
    stopMotor();
    stopLights();
    res.redirect('/');
});

app.get('/gallerymenu/', function(req, res) {
    var menuImages = [
	    {src: "../images/gallery/progress2018.jpg", name: "progress2018", caption: "Miten joulutori syntyi"},
        {src: "../images/gallery/finished2017.jpg", name: "finished2017", caption: "Kuvia viime vuoden tuulimyllystä"},
        //{src: "../images/gallery/progress.jpg", name: "progress", caption: "Miten tämä piparkakkutalo syntyi"},
        {src: "../images/gallery/2008.jpg", name: "old", caption: "Edellisten vuosien piparkakkutaloja"},
        {src: "../images/gallery/story.jpg", name: "story", caption: "Piparkakkutarina"}
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

app.get('/spotify/', function(req, res, err) {
    //console.log(dataObject);
    var options = {
        'server': global.gConfig.server,
        'playListLink': global.gConfig.playListLink,
        'playListUri': global.gConfig.playListUri
    };
    res.render('spotify.html', {'options': options}); 
});

app.post('/synchLights/', function(req, res) {
    var analysisObject = req.body.analysis_object;
    var doTransition = 0;
    if (isLightsRunning) {
        stopLights();
        doTransition = 1;
    }


    //console.log("analysisObject in server ", analysisObject);
    startLights(analysisObject, doTransition);
});


// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// Spotify part
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var request = require('request');
app.use(cookieParser());
app.use(bodyParser.json());

//var DEV = process.env.DEV ? true : false;
var stateKey = 'spotify_auth_state';

// THESE SHOULD NOT BE HARDCODED HERE
const client_id = global.gConfig.client_id;
const client_secret = global.gConfig.client_secret;
const redirect_uri = "http://" + global.gConfig.server + ":5000/callback";

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
/*
app.all('*', function(req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  next();
});
*/
app.get('/login', function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  // your application requests authorization
  //var scope = 'user-read-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: req.query.scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    console.log('state mismatch', 'state: ' + state, 'storedState ' + storedState, 'cookies ', req.cookies);
    res.render('spotifyCallback.html', {
      access_token: null,
      expires_in: null
    });
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token,
            expires_in = body.expires_in;

        console.log('everything is fine');
        res.cookie('refresh_token', refresh_token, {maxAge: 30 * 24 * 3600 * 1000, domain: global.gConfig.server});

        res.render('spotifyCallback.html', {
          access_token: access_token,
          expires_in: expires_in,
          refresh_token: refresh_token
        });
      } else {
        console.log('wrong token');

        res.render('spotifyCallback.html', {
          access_token: null,
          expires_in: null
        });
      }
    });
  }
});

app.post('/token', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var refreshToken = req.body ? req.body.refresh_token : null;
  if (refreshToken) {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            expires_in = body.expires_in;

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ access_token: access_token, expires_in: expires_in }));
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ access_token: '', expires_in: '' }));
      }
    });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ access_token: '', expires_in: '' }));
  }
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
