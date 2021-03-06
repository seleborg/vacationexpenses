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

		$scope.$on('$destroy', function (event) {
			dataStore.destroy();
		});

		$scope.url = $location.path().split('/', 2)[1];

		dataStore.fetch($scope.url)
			.success(function (data, status) {
				if (status == 200) {
					$scope.bill = billService.createBill(data.bill);
					$scope.bill.onUpdated($scope.onBillUpdated);
					$scope.billLoaded = true;
					$scope.newExpense = _createNewExpenseModel();
				}
			})
			.error(function (status) {
				$scope.error = { status: status };
			});


		$scope.billLoaded = false;
		$scope.error = null;
		$scope.bill = null;

		$scope.$on('billUpdated', function (event) {
			// console.log('billController.$on.billUpdated');
			$scope.onBillUpdated();
		});

		$scope.onBillUpdated = function () {
			// console.log('billController.onBillUpdated');
			var data = {
				version: 1,
				bill: $scope.bill
			};
			dataStore.storeDelayed($scope.url, data)
				.error(function (status) {
					$scope.error = { status: status };
				});
		};

		$scope.deleteExpense = function (index) {
			$scope.bill.deleteExpense(index);
		};

		function _createNewExpenseModel() {
			var lastUsedCurrency =
				$scope.bill.expenses.length > 0
				? $scope.bill.expenses[$scope.bill.expenses.length - 1].currency
				: 'EUR';

			var newModel = {
				name: '',
				amount: '',
				currency: lastUsedCurrency,
				purpose: ''
			};

			return newModel;
		}

		$scope.addExpense = function () {
			$scope.bill.addExpense(
				$scope.newExpense.name,
				$scope.newExpense.amount,
				$scope.newExpense.currency,
				$scope.newExpense.purpose);

			$scope.newExpense = _createNewExpenseModel();
		};
	}]);
