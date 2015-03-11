var PORT = process.env.PORT || 3000;

var express = require('express');
var bodyParser = require('body-parser');
var storage = require('./storage.js');

var app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.get('/api/v1/bills/*', function (req, res) {
	var url = req.params[0];
	storage.fetchBill(url, function (response) {
		res.status(response.status).json(response);
	});
});
app.put('/api/v1/bills/*', function (req, res) {
	var url = req.params[0];
	storage.storeBill(url, req.body, function (status) {
		res.status(status).end();
	});
});

app.use('/client', express.static(__dirname + '/client'));
app.use('/lib', express.static(__dirname + '/lib'));

app.get('/*', function (req, res) {
	var url = req.params[0];
	res.sendFile(__dirname + '/bill.html');
});

app.listen(PORT);
