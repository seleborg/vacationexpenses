var azureStorage = require('azure-storage');

var tableService = azureStorage.createTableService();
var entGen = azureStorage.TableUtilities.entityGenerator;

var TABLE_NAME = 'bills';
var PARTITION_KEY = 'bills';

var testBills = {
	'example1': {
		status: 200,
		version: 1,
		bill: {
			expenses: [
				{name: 'Joe', amount: '100', currency: 'EUR', purpose: 'Wine',
					sharingModel: {
						equalShares: true,
						shares: {Joe: 1, Laura: 1, Bill: 1}}},
				{name: 'Laura', amount: '50', currency: 'USD', purpose: 'Bourbon',
					sharingModel: {
						equalShares: true,
						shares: {Joe: 1, Laura: 1, Bill: 1}}},
				{name: 'Bill', amount: '25', currency: 'GBP', purpose: 'Scotch',
					sharingModel: {
						equalShares: true,
						shares: {Joe: 1, Laura: 1, Bill: 1}}}
			],
			currencies: [
				{code: 'EUR', inEUR: 1},
				{code: 'USD', inEUR: 0.5},
				{code: 'GBP', inEUR: 2}
			]
		}
	}
};


// Fetch a bill given the bill's url.
// callback = function (response)
// where response is a structure of the format:
// { status: One of the standard HTTP status codes, 200 if successful.
//   url: the bill's URL (same as input value)
//   version: the bill's data version (used to translate from older formats) (null unless status == 200).
//   bill: the bill structure (null unless status == 200).
// }
exports.fetchBill = function (url, callback) {
	if (url in testBills) {
		var response = testBills[url];
		response.url = url;
		callback(response);
	}
	else {
		fetchBillFromAzureStorage(url, callback);
	}
}


// Updates a bill identified by its URL.
// callback = function (status) {}
// data = {
//		version: <bill structure version>,
//		bill: <bill structure>
// };
exports.storeBill = function (url, data, callback) {
	if (url in testBills) {
		var response = testBills[url];
		response.version = data.version;
		response.bill = data.bill;
		callback(200);
	}
	else {
		storeBillIntoAzureStorage(url, data, callback);
	}
}


function fetchBillFromAzureStorage(url, callback) {
	var query = new azureStorage.TableQuery()
		.where('PartitionKey eq ?', PARTITION_KEY)
		.and('RowKey eq ?', url);

	tableService.queryEntities(TABLE_NAME, query, null, function (error, result, response) {
		if (error || !response.isSuccessful) {
			callback({
				status: response.statusCode,
				url: url,
				version: null,
				bill: null
			});
		}
		else {
			var entry = result.entries[0];
			callback({
				status: response.statusCode,
				url: url,
				version: entry.version['_'],
				bill: JSON.parse(entry.bill['_'])
			});
		}
	});
}


function storeBillIntoAzureStorage(url, data, callback) {
	var billEntity = {
		PartitionKey: entGen.String(PARTITION_KEY),
		RowKey: entGen.String(url),
		version: entGen.Int32(data.version),
		bill: entGen.String(JSON.stringify(data.bill))
	};

	tableService.updateEntity(TABLE_NAME, billEntity, function (error, result, response) {
		callback(response.statusCode);
	});
}
