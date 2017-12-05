var port = 4567;
var file;

//get file name
if (process.argv.length == 3) {
   file = process.argv[2];
}

const express = require('express')  
const opn = require('opn')

const app = express()

const blockstack = require('blockstack')

//const document = {"document_mode": false};
//document.document_mode = false;
require('browser-env')(['window']);
global.navigator = {
  userAgent: 'node.js'
};
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


var run = require('browser-run');
var browser = run();
browser.pipe(process.stdout);
browser.end('console.log(location); window.close()');


console.log("\n\n----------AuthReqset start----------------");
blockstack.makeAuthRequest();
console.log("is signed in " + blockstack.isUserSignedIn());
console.log("----------AuthReqset end----------------\n\n");
function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

app.use(allowCrossDomain)
app.use('/', (request, response) => {
  var fs = require('fs')
  fs.readFile(file, 'utf8', function(err, data) {  
    	if (err) throw err;
    	response.send(data);
	});
})
app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
  opn('http://localhost:' + port)
})

/*var ngrok = require('ngrok');
ngrok.connect(port, function (err, url) {
  console.log("Public URL: " + url);
});*/