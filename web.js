var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  var fc = fs.readFileSync('web.js');
  var buf = new Buffer(fc, "utf-8");   
  reponse.send(buf.toString());
  //response.send('Hello World 2!')
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
