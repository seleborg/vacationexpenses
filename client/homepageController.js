angular.module('vacationExpenses.homepageController', [
	'vacationExpenses.billService'
	])
	.controller('homepageController', [
		'$scope',
		'$http',
		'$window',
		'billService', function ($scope, $http, $window, billService) {

		$scope.createNewBill = function () {
			var billData = {
				version: 1,
				bill: billService.createBill(),
			};

			$http.post('/api/v1/bills', {'billData': billData})
				.success(function (data, status, headers, options) {
					var url = headers().location;
					$window.location.href = url;
				})
				.error(function (data, status, headers, options) {

				});
		}
	}])
;