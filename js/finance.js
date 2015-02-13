function recalculateResult(expenses) {
	var people = initPeople(expenses);
	fixShares(expenses, people);
	people = collectPaid(people, expenses);
	people = collectDue(people, expenses);
	return computeTotalPaidAndDuePerPerson(people);
}


function initPeople(expenses) {
	var people = {};

	angular.forEach(expenses, function(expense) {
		people[expense.name] = {
			name: expense.name,
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
		people[expense.name].paid.push(Number(expense.amount));
	});

	return people;
}


function collectDue(people, expenses) {
	angular.forEach(expenses, function(expense) {
		var amount = Number(expense.amount);
		var shares = sumShares(expense);

		angular.forEach(expense.sharingModel.shares, function(share, name) {
			var due = amount * (expense.sharingModel.equalShares ? 1 : Number(share)) / shares;
			people[name].due.push(due);
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


function fixShares(expenses, people) {
	angular.forEach(people, function(person, name) {
		angular.forEach(expenses, function(expense) {
			if (!expense.sharingModel.shares[name]) {
				expense.sharingModel.shares[name] = 1;
			}
		});
	});

	angular.forEach(expenses, function(expense) {
		var newShares = {};
		angular.forEach(expense.sharingModel.shares, function (share, name) {
			if (name in people) {
				newShares[name] = share;
			}
		});
		expense.sharingModel.shares = newShares;
	});
}
