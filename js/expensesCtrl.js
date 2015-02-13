var vacationExpensesApp = angular.module('vacationExpensesApp', []);


vacationExpensesApp.controller('ExpensesCtrl', function ($scope) {
	$scope.expenses = [
		{name: "Joe", amount: "99", purpose: "Whisky",
			sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}},
		{name: "Laura", amount: "12", purpose: "Cheese",
			sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}},
		{name: "Laura", amount: "37", purpose: "Restaurant Saturday",
			sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}},
		{name: "Joe", amount: "45", purpose: "Movie",
			sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}},
		{name: "Joe", amount: "12", purpose: "Coffee",
			sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}}
	];

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
});
