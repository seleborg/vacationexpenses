angular.module('vacationExpenses.billService', [])
	.service('billService', [function () {
		function allNames(expenses) {
			var names = [];
			angular.forEach(expenses, function (expense) {
				if (names.indexOf(expense.name) == -1) {
					names.push(expense.name);
				}
			});
			return names;
		}


		function sumShares(expense) {
			var sum = 0;
			angular.forEach(expense.sharingModel.shares, function (share, _) {
				sum += expense.sharingModel.equalShares ? 1 : Number(share);
			});
			return sum;
		}


		function sum(array) {
			var sum = 0;
			angular.forEach(array, function(value) {
				sum += Number(value);
			});
			return sum;
		}


		var billService = {};

		billService.createBill = function (billData) {
			var billObject = {
				expenses: angular.copy(billData.expenses),
				currencies: angular.copy(billData.currencies),
				_names: allNames(billData.expenses),
				_updatedCallbacks: [],
			};


			billObject.onUpdated = function (callback) {
				this._updatedCallbacks.push(callback);
			};


			billObject._triggerOnUpdated = function () {
				angular.forEach(this._updatedCallbacks, function (callback) {
					callback(billObject);
				});
			};


			billObject._fixShares = function () {
				this._names = allNames(this.expenses);

				angular.forEach(this.expenses, function (expense) {
					var newShares = {};
					angular.forEach(billObject._names, function (name) {
						if (expense.sharingModel.shares.hasOwnProperty(name)) {
							newShares[name] = expense.sharingModel.shares[name];
						}
						else {
							newShares[name] = 1;
						}
					});
					expense.sharingModel.shares = newShares;
				});
			};


			billObject.addExpense = function (name, amount, purpose) {
				this.expenses.push({
					name: name,
					amount: amount,
					purpose: purpose,
					sharingModel: {equalShares: true, shares: {}},
				});
				this._fixShares();
				this._triggerOnUpdated();
			};


			billObject.updateExpense = function (index, newExpense) {
				this.expenses[index] = newExpense;
				this._fixShares();
				this._triggerOnUpdated();
			}


			billObject.deleteExpense = function (index) {
				this.expenses.splice(index, 1);
				this._fixShares();
				this._triggerOnUpdated();
			};


			billObject.calculateResult = function () {
				var result = {};

				angular.forEach(this._names, function (name) {
					result[name] = {
						name: name,
						paid: [],
						due: [],
						totalPaid: 0,
						totalDue: 0
					};
				});

				angular.forEach(this.expenses, function(expense) {
					result[expense.name].paid.push(Number(expense.amount));

					var amount = Number(expense.amount);
					var shares = sumShares(expense);

					angular.forEach(expense.sharingModel.shares, function(share, name) {
						if (shares == 0) {
							var due = 0;
						}
						else {
							var due = amount * (expense.sharingModel.equalShares ? 1 : Number(share)) / shares;
						}
						result[name].due.push(due);
					});
				});

				angular.forEach(result, function (person, name) {
					person.totalPaid = sum(person.paid);
					person.totalDue = sum(person.due);
				});

				return result;
			};


			return billObject;
		}

		return billService;
	}]);
