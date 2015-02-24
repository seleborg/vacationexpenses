var azureStorage = require('azure-storage');

var tableService = azureStorage.createTableService();

var TABLE_NAME = 'bills';
var PARTITION_KEY = 'bills';

var testBills = {
	'example1': {
		status: 200,
		version: 1,
		bill: {
			expenses: [
				{name: "Joe", amount: "99", purpose: "Whisky",
					sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}},
				{name: "Laura", amount: "12", purpose: "Cheese",
					sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}},
				{name: "Laura", amount: "37", purpose: "Restaurant Saturday",
					sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}},
				{name: "Joe", amount: "45", purpose: "Movie",
					sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}},
				{name: "Joe", amount: "12", purpose: "Coffee",
					sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}}
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
