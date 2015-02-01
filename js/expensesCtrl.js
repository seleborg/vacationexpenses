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


function recreatePeople(expenses) {
	var people = initPeople(expenses);
	people = collectPaid(people, expenses);
	people = collectDue(people, expenses);
	return computeTotalPaidAndDuePerPerson(people);
}


function initPeople(expenses) {
	var people = {};

	for (var i = 0; i < expenses.length; i++) {
		var person = {
			name: expenses[i].person,
			paid: [],
			due: [],
			totalPaid: 0,
			totalDue: 0
		};
		people[expenses[i].person] = person;
	}

	return people;
}


function collectPaid(people, expenses) {
	for(var i = 0; i < expenses.length; i++) {
		var expense = expenses[i];
		var name = expense.person;
		var person = people[name];
		person.paid.push(Number(expense.amount));
	}

	return people;	
}


function collectDue(people, expenses) {
	for (var i = 0; i < expenses.length; i++) {
		var expense = expenses[i];
		var amount = Number(expense.amount);
		var shares = sumShares(expense);

		angular.forEach(expense.sharingModel.shares, function(share, name) {
			people[name].due.push(
				amount * (expense.sharingModel.equalShares ? 1 : Number(share)) / shares);
		});
	}

	return people;
}


function sumShares(expense) {
	var sum = 0;
	angular.forEach(expense.sharingModel.shares, function (share, _) {
		sum += expense.sharingModel.equalShares ? 1 : Number(share);
	});
	return sum;
}


function computeTotalPaidAndDuePerPerson(people) {
	for (name in people) {
		var person = people[name];
		var totalPaid = 0;
		for (var i = 0; i < person.paid.length; i++) {
			totalPaid += person.paid[i];
		}

		person.totalPaid = totalPaid;

		var totalDue = 0;
		for (var j = 0; j < person.due.length; j++) {
			totalDue += person.due[j];
		}

		person.totalDue = totalDue;
	}

	return people;
}
