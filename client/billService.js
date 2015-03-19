angular.module('vacationExpenses.billService', ['finance'])
	.service('billService', ['recalculateResult', function (recalculateResult) {
		function allNames(expenses) {
			var names = [];
			angular.forEach(expenses, function (expense) {
				if (names.indexOf(expense.name) == -1) {
					names.push(expense.name);
				}
			});
			return names;
		}


		var billService = {};

		billService.createBill = function (billData) {
			var billObject = {
				expenses: angular.copy(billData.expenses),
				names: allNames(billData.expenses)
			};


			billObject.addExpense = function (name, amount, purpose) {
				var sharingModel = {
					equalShares: true,
					shares: {}
				};

				if (this.names.indexOf(name) == -1) {
					this.names.push(name);
				}

				angular.forEach(this.names, function (name) {
					sharingModel.shares[name] = 1;
				});

				angular.forEach(this.expenses, function (expense) {
					if (!expense.sharingModel.shares.hasOwnProperty(name)) {
						expense.sharingModel.shares[name] = 1;
					}
				});

				this.expenses.push({
					name: name,
					amount: amount,
					purpose: purpose,
					sharingModel: sharingModel,
				});
			};


			billObject.updateExpense = function (index, newExpense) {
				var oldExpense = this.expenses[index];

				this.expenses[index] = newExpense;
				this.names = allNames(this.expenses);

				angular.forEach(this.expenses, function (expense) {
					var newShares = {};
					angular.forEach(billObject.names, function (name) {
						if (expense.sharingModel.shares.hasOwnProperty(name)) {
							newShares[name] = expense.sharingModel.shares[name];
						}
						else {
							newShares[name] = 1;
						}
					});
					expense.sharingModel.shares = newShares;
				});
			}


			billObject.recalculateResult = function () {
				return recalculateResult(billObject);
			};


			return billObject;
		}

		return billService;
	}]);
