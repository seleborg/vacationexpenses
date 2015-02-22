var vacationExpensesApp = angular.module('vacationExpensesApp', ['finance']);

vacationExpensesApp.config(['$locationProvider', function ($locationProvider) {
	$locationProvider.html5Mode(true);
}]);


vacationExpensesApp.controller('ExpensesCtrl', ['$scope', '$location', 'recalculateResult', function ($scope, $location, recalculateResult) {

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
