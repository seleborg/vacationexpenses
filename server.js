var express = require('express');
var storage = require('./storage.js');

var app = express();

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/bills/*', function (req, res) {
	var url = req.params[0];
	storage.fetchBill(url, function (response) {
		res.status(response.status).json(response);
	});
});

app.use('/js', express.static(__dirname + '/js'));
app.use('/lib', express.static(__dirname + '/lib'));

app.listen(process.env.PORT || 3000);
