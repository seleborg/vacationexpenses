describe('vacationExpenses.dataStoreService', function () {
	beforeEach(function () {
		module('vacationExpenses.dataStoreService')
	});

	describe('dataStore', function () {
		var FLUSH_INTERVAL;
		var $httpBackend;
		var $interval;
		var dataStore;

		beforeEach(function () {
			inject(function (_$httpBackend_, _$interval_, _dataStore_) {
				$httpBackend = _$httpBackend_;
				$interval = _$interval_;
				dataStore = _dataStore_;
				FLUSH_INTERVAL = dataStore.delayInMillis;
			});
		});

		afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
            dataStore.destroy();
        });

		describe('fetch', function () {
			it('calls the correct API URL', function () {
				$httpBackend.expectGET('/api/v1/bills/20449572').respond(200, {});
				$httpBackend.expectGET('/api/v1/bills/abcdefgh').respond(200, {});
				dataStore.fetch('20449572');
				dataStore.fetch('abcdefgh');

				$httpBackend.flush();
				$interval.flush(FLUSH_INTERVAL);
			});


			it('returns a promise with success() and error()', function () {
				$httpBackend.expectGET().respond(200, {});
				dataStore.fetch('myBill').success(function () {}).error(function () {});

				$httpBackend.flush();
				$interval.flush(FLUSH_INTERVAL);
			});


			it('ends up calling success() upon success', function () {
				var successCalled = false;
				var errorCalled = false;

				$httpBackend.expectGET().respond(200, {});
				dataStore.fetch('myBill')
					.success(function () { successCalled = true; })
					.error(function () { errorCalled = true; });

				$httpBackend.flush();
				$interval.flush(FLUSH_INTERVAL);

				expect(successCalled).toBe(true);
				expect(errorCalled).toBe(false);
			});


			it('ends up calling error() upon error', function () {
				var successCalled = false;
				var errorCalled = false;

				$httpBackend.expectGET().respond(500, {});
				dataStore.fetch('myBill')
					.success(function () { successCalled = true; })
					.error(function (status) {
						expect(status).toBe(500);
						errorCalled = true;
					});

				$httpBackend.flush();
				$interval.flush(FLUSH_INTERVAL);

				expect(successCalled).toBe(false);
				expect(errorCalled).toBe(true);
			});


			it('can register several success() and error() callbacks', function () {
				var successCalled = false;
				var successCalledAgain = false;
				var errorCalled = false;
				var errorCalledAgain = false;

				$httpBackend.expectGET().respond(200, {});
				var promise = dataStore.fetch('myBill');
				promise.success(function () { successCalled = true; });
				promise.success(function () { successCalledAgain = true; });

				$httpBackend.expectGET().respond(404, {});
				promise = dataStore.fetch('myBill');
				promise.error(function () { errorCalled = true; });
				promise.error(function () { errorCalledAgain = true; });

				$httpBackend.flush();
				$interval.flush(FLUSH_INTERVAL);

				expect(successCalled).toBeTruthy();
				expect(successCalledAgain).toBeTruthy();
				expect(errorCalledAgain).toBeTruthy();
				expect(errorCalled).toBeTruthy();
			});
		});

		describe('storeDelayed', function () {
			it('PUTs the data to the correct API URL', function () {
				$httpBackend.expectPUT('/api/v1/bills/abcdefgh', 'the data to store2').respond(200);

				// This first request will never be sent, so we don't need to expectPUT() it.
				dataStore.storeDelayed('20449572', 'the data to store1');

				dataStore.storeDelayed('abcdefgh', 'the data to store2');

				$interval.flush(FLUSH_INTERVAL);

				$httpBackend.flush();
				$interval.flush(FLUSH_INTERVAL);
			});


			it('returns a promise with success() and error()', function () {
				$httpBackend.expectPUT().respond(200);
				dataStore.storeDelayed('myBill', '').success(function () {}).error(function () {});

				$interval.flush(FLUSH_INTERVAL);

				$httpBackend.flush();
				$interval.flush(FLUSH_INTERVAL);
			});


			it('delays the saving', function () {
				// No request should happen right away ...
				dataStore.storeDelayed('myBill', '').success(function () {}).error(function () {});

				// ... and also not after a very short amount of time ...
				$interval.flush(dataStore.delayInMillis / 2);

				// ... but if we wait long enough, the request is sent out.
				$httpBackend.expectPUT().respond(200);

				$interval.flush(FLUSH_INTERVAL);

				$httpBackend.flush();
				$interval.flush(FLUSH_INTERVAL);
			});


			it("ends up calling success() upon success", function () {
				var successCalled = false;
				var errorCalled = false;

				$httpBackend.expectPUT().respond(200, {});
				dataStore.storeDelayed('myBill', {})
					.success(function (status) {
						successCalled = true;
						expect(status).toBe(200);
					})
					.error(function () {
						errorCalled = true;
					});

				$interval.flush(FLUSH_INTERVAL);

				$httpBackend.flush();
				$interval.flush(FLUSH_INTERVAL);

				expect(successCalled).toBeTruthy();
				expect(errorCalled).toBeFalsy();
			});


			it("ends up calling error() upon error", function () {
				var successCalled = false;
				var errorCalled = false;

				$httpBackend.expectPUT().respond(404);
				dataStore.storeDelayed('myBill')
					.success(function () { successCalled = true; })
					.error(function (status) {
						errorCalled = true;
						expect(status).toBe(404);
					});

				$interval.flush(FLUSH_INTERVAL);

				$httpBackend.flush();
				$interval.flush(FLUSH_INTERVAL);

				expect(successCalled).toBeFalsy();
				expect(errorCalled).toBeTruthy();
			});


			it('is ready to store again after the timeout', function () {
				$httpBackend.expectPUT().respond(200);
				dataStore.storeDelayed('myBill');

				$interval.flush(FLUSH_INTERVAL);
				$httpBackend.flush();
				$interval.flush(FLUSH_INTERVAL);

				var successCalled = false

				$httpBackend.expectPUT().respond(200);
				dataStore.storeDelayed('myBill')
					.success(function () {
						successCalled = true;
					});

				$interval.flush(FLUSH_INTERVAL);

				expect(successCalled).toBeFalsy();

				$httpBackend.flush();
				$interval.flush(FLUSH_INTERVAL);

				expect(successCalled).toBeTruthy();
			});
		});
	});
});
