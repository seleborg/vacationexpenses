angular.module('vacationExpenses.dataStore', [])
	.factory('dataStore', ['$http', function ($http) {
		var dataStore = {
			fetch: function (billId) {
				var promise = $http.get('/api/v1/bills/' + billId);

				// We clone the object, and provide adapted success() and error()
				// methods that hide some of the complexity of HTTP requests
				// (e.g. the headers and config objects).
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
			}
		};

		return dataStore;
	}])
;