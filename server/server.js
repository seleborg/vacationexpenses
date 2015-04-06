var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var storage = require('./storage.js');

var PORT = process.env.PORT || 3000;
var SERVER_ROOT = path.resolve(__dirname, '..');

var app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.sendFile(path.resolve(SERVER_ROOT, 'client/index.html'));
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
app.post('/api/v1/bills', function (req, res) {
	var billData = req.body.billData;
	storage.createBill(billData, function (status, url) {
		if (status == 201) {
			res.header('Location', '/' + url);
		}
		res.status(status).end();
	})
});

app.use('/client', express.static(path.resolve(SERVER_ROOT, 'client')));
app.use('/lib', express.static(path.resolve(SERVER_ROOT, 'lib')));

app.get('/*', function (req, res) {
	var url = req.params[0];
	res.sendFile(path.resolve(SERVER_ROOT, 'client/billTemplate.html'));
});

app.listen(PORT);
