console.log("Node.js version " + process.version);

var express = require('express');
var serveStatic = require('serve-static');

var app = express();

app.use(serveStatic('.', {index: "index.html"}));
app.listen(80);
console.log("Startup completed, listening.");