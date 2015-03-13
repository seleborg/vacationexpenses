describe('vacationExpenses.dataStore', function () {
	beforeEach(function () {
		module('vacationExpenses.dataStore')
	});

	describe('dataStore', function () {
		var $httpBackend;
		var dataStore;

		beforeEach(function () {
			inject(function (_$httpBackend_, _dataStore_) {
				$httpBackend = _$httpBackend_;
				dataStore = _dataStore_;
			});
		});

		afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

		describe('fetch', function () {
			it('calls the correct API URL', function () {
				$httpBackend.expectGET('/api/v1/bills/20449572').respond(200, {});
				$httpBackend.expectGET('/api/v1/bills/abcdefgh').respond(200, {});
				dataStore.fetch('20449572');
				dataStore.fetch('abcdefgh');
				$httpBackend.flush();
			});


			it('returns a promise with success() and error()', function () {
				$httpBackend.expectGET('/api/v1/bills/myBill').respond(200, {});
				dataStore.fetch('myBill').success(function () {}).error(function () {});
				$httpBackend.flush();
			});


			it('ends up calling success() upon success', function () {
				var successCalled = false;
				var errorCalled = false;

				$httpBackend.expectGET('/api/v1/bills/myBill').respond(200, {});
				dataStore.fetch('myBill')
					.success(function () { successCalled = true; })
					.error(function () { errorCalled = true; });
				$httpBackend.flush();

				expect(successCalled).toBe(true);
				expect(errorCalled).toBe(false);
			});


			it('ends up calling error() upon error', function () {
				var successCalled = false;
				var errorCalled = false;

				$httpBackend.expectGET('/api/v1/bills/myBill').respond(500, {});
				dataStore.fetch('myBill')
					.success(function () { successCalled = true; })
					.error(function (status) {
						expect(status).toBe(500);
						errorCalled = true;
					});
				$httpBackend.flush();

				expect(successCalled).toBe(false);
				expect(errorCalled).toBe(true);
			});
		});
	});
});
