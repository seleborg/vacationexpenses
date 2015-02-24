var vacationExpensesApp = angular.module('vacationExpensesApp', ['finance']);

vacationExpensesApp.config(['$locationProvider', function ($locationProvider) {
	$locationProvider.html5Mode(true);
}]);


vacationExpensesApp.controller('ExpensesCtrl', ['$scope', '$location', '$http', 'recalculateResult', function ($scope, $location, $http, recalculateResult) {
	$scope.url = $location.path().split('/', 2)[1];
	$http.get('/bills/' + $scope.url)
		.success(function (data, status, headers, config) {
			if (status == 200) {
				$scope.bill = data.bill;
				$scope.billLoaded = true;
			}
		})
		.error(function (data, status, headers, config) {
			$scope.error = { status: status };
		});


	$scope.billLoaded = false;
	$scope.error = null;
	$scope.bill = null;
	$scope.result = null;

	$scope.$watch('bill', function (bill) {
		if (bill) {
			$scope.result = recalculateResult(bill);

			var data = {
				version: 1,
				bill: $scope.bill
			};
			$http.put('/bills/' + $scope.url, data);
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
