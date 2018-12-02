
README.MD

myapi.js is the Node.JS application. its an http server which serves html and js files, and also responds to API requests.

1. virtualenv venv
2. . venv/bin/activate

to start, download the source files into a new directory on the RPi, 
install the node modules required 
npm install express
npm install connect
npm install nunjucks
npm install body-parser

and finally, run the application by starting node with the myapi.js file as argument.
(you must run this with root priviledges AND in the SRC/ folder)
  $ sudo node myapi.js

this starts the http server on localthost using port 3000

If you now open a browser on your PC or Mac and browse to http://[your RPi's IP Address]:3000, the index.html file will be loaded from the RPi and displayed (served by myapi.js acting as a webserver). 
index.html immediately loads the myclient.js file from the RPi, which contains the client-side logic, next sending an API query to our server-side API running on the RPi. The server api reaponds with the current value of the required input pin.

