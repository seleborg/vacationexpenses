angular.module('vacationExpenses.billController', [
		'vacationExpenses.billService',
		'vacationExpenses.dataStoreService'
	])


	.config(['$locationProvider', function ($locationProvider) {
		$locationProvider.html5Mode(true);
	}])


	.controller('billController', [
		'$scope',
		'$location',
		'$http',
		'billService',
		'dataStore', function ($scope, $location, $http, billService, dataStore) {
		$scope.url = $location.path().split('/', 2)[1];

		dataStore.fetch($scope.url)
			.success(function (data, status) {
				if (status == 200) {
					$scope.bill = billService.createBill(data.bill);
					$scope.billLoaded = true;
				}
			})
			.error(function (status) {
				$scope.error = { status: status };
			});


		$scope.billLoaded = false;
		$scope.error = null;
		$scope.bill = null;
		$scope.result = null;

		$scope.$watch('bill', function (bill) {
			if (bill) {
				$scope.result = bill.recalculateResult();

				var data = {
					version: 1,
					bill: $scope.bill
				};
				dataStore.storeDelayed($scope.url, data)
					.error(function (status) {
						$scope.error = { status: status };
					});
			}
		}, true);


		var EMPTY_EXPENSE = {
			name: "",
			amount: "",
			purpose: "",
			sharingModel: { equalShares: true, shares: {} }
		};

		$scope.newExpense = angular.copy(EMPTY_EXPENSE);

		$scope.addExpense = function () {
			$scope.bill.expenses.push($scope.newExpense);
			$scope.newExpense = angular.copy(EMPTY_EXPENSE);
		};

		$scope.deleteExpense = function (index) {
			$scope.bill.expenses.splice(index, 1);
		};
	}]);
