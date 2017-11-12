var port = 4567;

//can set port via command line
if (process.argv.length == 3) {
  port = process.argv[2];
}
var http = require('http');
//create a server object:
console.log("Running on port " + port);
http.createServer(function (req, res) {
  res.write("HELLLO"); //write a response to the client
  res.end(); 
}).listen(port); //the server object listens on the specified port

var ngrok = require('ngrok');
  ngrok.connect(port, function (err, url) {
    console.log("Public URL: " + url);
  });