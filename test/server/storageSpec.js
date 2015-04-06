describe('vacationExpenses.server.storage', function () {
	describe('createBill', function () {
		var storage;
		var originalTableService;
		var mockTableService;

		beforeEach(function () {
			storage = require('../../server/storage.js');

			mockTableService = {};
			originalTableService = storage.installTableService(mockTableService);

			mockTableService.insertEntity = function (tableName, entity, callback) {
				return originalTableService.insertEntity(tableName, entity, callback);
			};
		});


		afterEach(function () {
			storage.installTableService(originalTableService);
		});


		it('should call respond with 201 and url if insertEntity succeeds', function () {
			spyOn(mockTableService, 'insertEntity').andCallFake(function (tableName, entity, callback) {
				callback(false, 'ETag', {statusCode: 200});
			});

			var billData = {
				version: 1,
				bill: {
					expenses: [],
					currencies: {
						EUR: { inEUR: 1 }
					},
					referenceCurrency: 'EUR'
				}
			};

			var spy = jasmine.createSpy('spy');
			storage.createBill(billData, spy);

			expect(spy.calls.length).toEqual(1);

			var args = spy.mostRecentCall.args;
			expect(args[0]).toEqual(201);
			expect(typeof args[1]).toEqual('string');
			expect(args[1]).not.toEqual('');
		});
	});
});
