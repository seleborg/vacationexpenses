console.log("Node.js version " + process.version);

var express = require('express');

var app = express();

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
app.use('/js', express.static(__dirname + '/js'));
app.use('/lib', express.static(__dirname + '/lib'));

app.listen(process.env.PORT || 3000);
console.log("Startup completed, listening.");
