var vacationExpensesApp = angular.module('vacationExpensesApp', []);


vacationExpensesApp.controller('ExpensesCtrl', function ($scope) {
	$scope.expenses = [
		{person: "Joe", 	amount: "99", purpose: "Whisky"},
		{person: "Laura", 	amount: "12", purpose: "Cheese"},
		{person: "Laura", 	amount: "37", purpose: "Restaurant Saturday"},
		{person: "Joe", 	amount: "45", purpose: "Movie"},
		{person: "Joe", 	amount: "12", purpose: "Coffee"}
	];

});
