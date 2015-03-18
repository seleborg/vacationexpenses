angular.module('vacationExpenses.dataStore', [])
	.factory('dataStore', ['$http', '$timeout', '$q', function ($http, $timeout, $q) {
		var delayInMillis = 1000;
		var dataToStore;
		var storeDefer;
		var storePromise;
		var runningTimeout;


		/**
		 * Wraps the given promise into an adpater promise that provides
		 * the following two methods:
		 *
		 * success(fn): call fn(data, status) when the request succeeds.
		 * error(fn): call fn(status) when the request fails.
		 */
		function adaptFetchPromise(promise) {
			var adaptedPromise = Object.create(promise);

			adaptedPromise.success = function (fn) {
				promise.success(function (data, status, headers, options) {
					fn(data, status);
				});
				return this;
			};

			adaptedPromise.error = function (fn) {
				promise.error(function (data, status, headers, options) {
					fn(status);
				});
				return this;
			};

			return adaptedPromise;
		};


		/**
		 * Adapt the defer's promise to add success() and error() methods,
		 * to mimic the promise returned by fetch().
		 */
		function adaptStorePromise(defer) {
			defer.promise.success = function (fn) {
				defer.promise.then(fn, null);
				return this;
			};
			defer.promise.error = function (fn) {
				defer.promise.then(null, fn);
				return this;
			};
			return defer.promise;
		}


		/**
		 * Actually send the data saved in the dataToStore member using $http
		 * to the storage API.
		 */
		function storeDelayedData() {
			cancelRunningTimeout();

			$http.put('/api/v1/bills/' + dataToStore.billId, dataToStore.data)
				.success(function (data, status, headers, options) {
					storeDefer.resolve(status);
					storeDefer = undefined;
				})
				.error(function (data, status, headers, options) {
					storeDefer.reject(status);
					storeDefer = undefined;
				});
		}


		/**
		 * Cancel the currently running $timeout.
		 */
		function cancelRunningTimeout() {
			if (angular.isDefined(runningTimeout)) {
				$timeout.cancel(runningTimeout);
				runningTimeout = undefined;
			}
		}


		/**
		 * dataStore's public API.
		 */
		var dataStore = {
			/**
			 * Delay before storing in milliseconds.
			 */
			delayInMillis: delayInMillis,


			/**
			 * Fetch the bill data using the given bill identifier. The function
			 * returns a promise with the following two specific methods:
			 *
			 * promise.success(fn): call fn(data, status) when the promise is resolved.
			 * promise.error(fn): call fn(status) when the promise is resolved.
			 */
			fetch: function (billId) {
				return adaptFetchPromise($http.get('/api/v1/bills/' + billId));
			},


			/**
			 * Stores a copy of the data, overwriting any previously stored
			 * data, and sets a timer to send the data to the actual storage
			 * eventually.
			 */
			storeDelayed: function (billId, data) {
				dataToStore = {
					billId: billId,
					data: angular.copy(data)
				};

				cancelRunningTimeout();

				if (!angular.isDefined(storeDefer)) {
					storeDefer = $q.defer();
					storePromise = adaptStorePromise(storeDefer);
				}

				runningTimeout = $timeout(storeDelayedData, delayInMillis);

				return storePromise;
			}
		};

		return dataStore;
	}])
;