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

	angular.forEach(expenses, function(expense) {
		people[expense.person] = {
			name: expense.person,
			paid: [],
			due: [],
			totalPaid: 0,
			totalDue: 0
		};
	});

	return people;
}


function collectPaid(people, expenses) {
	angular.forEach(expenses, function(expense) {
		people[expense.person].paid.push(Number(expense.amount));
	});

	return people;
}


function collectDue(people, expenses) {
	angular.forEach(expenses, function(expense) {
		var amount = Number(expense.amount);
		var shares = sumShares(expense);

		angular.forEach(expense.sharingModel.shares, function(share, name) {
			people[name].due.push(
				amount * (expense.sharingModel.equalShares ? 1 : Number(share)) / shares);
		});
	});

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
	angular.forEach(people, function(person, name) {
		person.totalPaid = sum(person.paid);
		person.totalDue = sum(person.due);
	});

	return people;
}


function sum(array) {
	var sum = 0;
	angular.forEach(array, function(value) {
		sum += Number(value);
	});
	return sum;
}
