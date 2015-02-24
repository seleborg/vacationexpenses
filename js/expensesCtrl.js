var vacationExpensesApp = angular.module('vacationExpensesApp', ['finance']);

vacationExpensesApp.config(['$locationProvider', function ($locationProvider) {
	$locationProvider.html5Mode(true);
}]);


vacationExpensesApp.controller('ExpensesCtrl', ['$scope', '$location', '$http', 'recalculateResult', function ($scope, $location, $http, recalculateResult) {
	$scope.url = $location.path().split('/', 2)[1];
	$http.get('/bills/' + $scope.url)
		.success(function (data, status, headers, config) {
			if (status == 200) {
				$scope.expenses = data.bill.expenses;
				$scope.billLoaded = true;
			}
		})
		.error(function (data, status, headers, config) {
			// TODO: Handle error
		});


	$scope.billLoaded = false;
	$scope.expenses = [];
	$scope.result = {};

	$scope.$watch('expenses', function (value) {
		$scope.result = recalculateResult(value);
	}, true);


	var EMPTY_EXPENSE = {
		name: "",
		amount: "",
		purpose: "",
		sharingModel: { equalShares: true, shares: {} }
	};

	$scope.newExpense = angular.copy(EMPTY_EXPENSE);

	$scope.addExpense = function () {
		$scope.expenses.push($scope.newExpense);
		$scope.newExpense = angular.copy(EMPTY_EXPENSE);
	};

	$scope.deleteExpense = function (index) {
		$scope.expenses.splice(index, 1);
	};
}]);
