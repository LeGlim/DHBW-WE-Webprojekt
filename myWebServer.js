// -----------------------------------------------------------------------------
// All below may still contain bugs or at least typos in the comments !!
// It should be sufficent to run our Webengineering lab Exercises, however you are
// very much invited to change this file..
//------------------------------------------------------------------------------
// This node.js application uses the express package as its implementation of a
// web server
// for more info, see: http://expressjs.com
// --------------------------------------------------------------
// Here we define all the required modules and services
var express = require('express');        // critical module for building a Web Server App
const cookieParser = require("cookie-parser");
// Here are some basic packages we need together with express
var bodyParser = require('body-parser'); // helper routines to parse data as JSON in request body
var fetch = require('node-fetch');       // http Server requests similar to the Client Version
const dotenv = require("dotenv");
dotenv.config();
//----------------------------------------------------------------------------
// create a new express based Web Server
// ---------------------------------------------------------------------------
var app = express();
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views');
// app.use('/static', express.static('/views/HTML'))
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
// -----------------------------------------------------------------------------
// This is a HTPP Basic Authentication Code fragment for potential use
// in this example we force a http basic authentication if there is a request
// with localhost:6001/admin
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// The Code enables CORS, just in case you want to explore this
// option
// -----------------------------------------------------------------------------
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// -----------------------------------------------------------------------------
// the WebServer now listens to http://localhost:6001 / http gets and posts
// -----------------------------------------------------------------------------
var server = app.listen(6001, function () {
  console.log('***********************************');
  console.log('listening:', 6001);
  console.log('***********************************');
});

// -----------------------------------------------------------------------------
// The following serve for different url paths
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// localhost:6001/static/filename.ext
// send a static file out of public/ext/filename.ext to the client
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// as default for static files you can also use
// localhost:6001/ext/filename.ext..
// node will use the public folder and concatenates the url path in order to
// find the file
// -----------------------------------------------------------------------------
app.get('/static/:document.:extension', function (req, res) {
  var docname = "/" + req.params.extension + "/" + req.params.document + "." + req.params.extension;
  var options = {
    root: __dirname + '/public/',
  }
  res.sendFile(docname, options, function (err) { // send the file !!
    if (err) { res.send(err); }
    else {
      console.log('Sent:', docname);
    }
  });
});
// -----------------------------------------------------------------------------
// localhost:6001/redirect
// will redirect us to the offical Jens Hocke Website
// -----------------------------------------------------------------------------
app.get('/redirect', function (req, res) {
  res.redirect('https://www.jens-hocke.de');
});

app.get('/', function (req, res) {
  res.redirect('/home');
});
// -----------------------------------------------------------------------------
// localhost:6001/home
//  we show the map.htm which is the Google Map at the local Stuttgart
// -----------------------------------------------------------------------------
app.get('/home', function (req, res) {
  var docname = "/html/index.html";
  var options = { root: __dirname + '/public/' }
  res.sendFile(docname, options, function (err) { // send this file
    if (err) {
      res.send(err);
    } else {
      console.log('Sent:', docname);
    }
  });
});

app.post('/home', function (req, res) {
  console.log("POST: home");
  let enteredPassword = req.body.passwordinput
  console.log("entered password:" + enteredPassword);

  //handle the form action and maybe set the cookie
  if (enteredPassword == process.env.PASSWORD_POOR) {
    res.cookie("userType", "poor");
    res.redirect("/home");
  }
  else if (enteredPassword == process.env.PASSWORD_RICH) {
    res.cookie("userType", "rich");
    res.redirect("/home");
  }
  else {
    res.cookie("userType", "error");
    res.redirect("/home");
  }
  res.end();
});


app.get('/infos', function (req, res) {
  var docname = "/html/infos.html";
  var options = { root: __dirname + '/public/' }
  if (req.cookies.userType == "poor" || req.cookies.userType == "rich") {
    res.sendFile(docname, options, function (err) { // send this file
      if (err) {
        res.send(err);
      } else {
        console.log('Sent:', docname);
      }
    });
  }
  else {
    res.redirect("/home");
  }

});

app.get('/aktien', function (req, res) {
  var docname = "/html/aktien.html";
  var options = { root: __dirname + '/public/' }
  if (req.cookies.userType == "rich") {
    res.sendFile(docname, options, function (err) { // send this file
      if (err) {
        res.send(err);
      } else {
        console.log('Sent:', docname);
      }
    });
  }
  else {
    res.redirect("/home");
  }
});
//------------------------------------------------------------------------------
// localhost:6001/proxy?url_to_be_proxied
// The incoming request will transfered using the fetch package
//------------------------------------------------------------------------------
app.all('/proxy', function (req, res) {
  var decompose = req.originalUrl.split("?");
  var fullurl = decompose[1] + "?" + decompose[2];

  //add the API-Key from .env file
  if (fullurl.startsWith("url=https://alphavantage.co/query?function=")) {
    fullurl += ("&apikey=" + process.env.ALPHA_API)
  }
  console.log("Proxy Server reached", fullurl);
  fullurl = fullurl.replace("url=", "");
  fetch(fullurl, {
    method: req.method,
    headers: { 'Content-Type': 'application/json' },
  })
    .then(checkStatus)  // do some basic status checking first.. throw an exception in case of trouble
    .then((response) => response.json())
    .then((json) => {
      res.send({ error: null, status: json.status, response: json });
    })
    .catch((err) => {
      res.send({ error: err, status: err, response: "" });
    });

  // do some basic exception handling (as desribed in the package but could be more in reality)
  function checkStatus(response) {
    if (response.ok) { // res.status >= 200 && res.status < 300
      return response;
    } else {
      throw { message: response.statusText };
    }
  }
});
