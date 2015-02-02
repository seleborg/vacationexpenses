var vacationExpensesApp = angular.module('vacationExpensesApp', []);


vacationExpensesApp.controller('ExpensesCtrl', function ($scope) {
	$scope.expenses = [
		{person: "Joe", 	amount: "99", purpose: "Whisky",
			sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}},
		{person: "Laura", 	amount: "12", purpose: "Cheese",
			sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}},
		{person: "Laura", 	amount: "37", purpose: "Restaurant Saturday",
			sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}},
		{person: "Joe", 	amount: "45", purpose: "Movie",
			sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}},
		{person: "Joe", 	amount: "12", purpose: "Coffee",
			sharingModel: {equalShares: true, shares: {"Joe": 1, "Laura": 1}}}
	];

	$scope.people = {};

	$scope.$watch('expenses', function (value) {
		$scope.people = recreatePeople(value);
	}, true);
});
