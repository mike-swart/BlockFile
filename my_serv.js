var port = 4567;
var file;

//get file name
if (process.argv.length == 3) {
   file = process.argv[2];
}

const express = require('express')  
const opn = require('opn')

const app = express()  

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

var ngrok = require('ngrok');
  ngrok.connect(port, function (err, url) {
    console.log("Public URL: " + url);
  });