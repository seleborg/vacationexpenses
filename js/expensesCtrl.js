var vacationExpensesApp = angular.module('vacationExpensesApp', []);


vacationExpensesApp.controller('ExpensesCtrl', function ($scope) {
	$scope.expenses = [
		{person: "Joe", 	amount: "99", purpose: "Whisky"},
		{person: "Laura", 	amount: "12", purpose: "Cheese"},
		{person: "Laura", 	amount: "37", purpose: "Restaurant Saturday"},
		{person: "Joe", 	amount: "45", purpose: "Movie"},
		{person: "Joe", 	amount: "12", purpose: "Coffee"}
	];

	$scope.people = {};

	$scope.$watch('expenses', function (value) {
		$scope.people = recreatePeople(value);
	}, true);
});


function recreatePeople(expenses) {
	var people = {};

	for(var i = 0; i < expenses.length; i++) {
		var expense = expenses[i];
		var name = expense.person;
		var person = people[name] || {paid: [], name: name};
		person.paid.push(Number(expense.amount));
		people[name] = person;
	}

	return computeTotalPaidPerPerson(people);
}


function computeTotalPaidPerPerson(people) {
	var newpeople = angular.copy(people);

	for (name in newpeople) {
		var person = newpeople[name];
		var total = 0;
		for (var i = 0; i < person.paid.length; i++) {
			total += person.paid[i];
		}

		person.totalPaid = total;
	}

	return newpeople;
}
