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
				names: allNames(billData.expenses),
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
			};


			billObject.addExpense = function (name, amount, currency, purpose) {
				this.expenses.push({
					name: name,
					amount: amount,
					currency: currency,
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


			billObject.calculateDue = function (name, targetCurrencyCode) {
				var totalDue = 0;

				angular.forEach(this.expenses, function (expense) {
					var amount = Number(expense.amount);
					var currency = expense.currency;
					var totalShares = sumShares(expense);

					if (totalShares == 0) {
						var due = 0;
					}
					else {
						var effectiveShares =
							expense.sharingModel.equalShares
							? 1
							: Number(expense.sharingModel.shares[name]);

						var due = billObject._convertCurrency(
									amount,
									expense.currency,
									targetCurrencyCode)
							* (effectiveShares / totalShares);
					}

					totalDue += due;
				});

				return totalDue;
			};


			billObject.calculatePaid = function (name, targetCurrencyCode) {
				var totalPaid = 0;

				angular.forEach(this.expenses, function (expense) {
					if (expense.name == name) {
						totalPaid += billObject._convertCurrency(
							expense.amount,
							expense.currency,
							targetCurrencyCode);
					}
				});

				return totalPaid;
			};


			billObject._convertCurrency = function(amount, sourceCurrencyCode, targetCurrencyCode) {
				if (sourceCurrencyCode == targetCurrencyCode) {
					return amount;
				}
				else {
					var sourceCurrency = this._getCurrency(sourceCurrencyCode);
					var targetCurrency = this._getCurrency(targetCurrencyCode);
					return amount * sourceCurrency.inEUR / targetCurrency.inEUR;
				}
			};


			billObject._getCurrency = function (code) {
				for (var i = 0; i < this.currencies.length; ++i) {
					if (this.currencies[i].code == code) {
						return this.currencies[i];
					}
				}

				throw('Currency ' + code + ' not found.');
			};


			return billObject;
		}

		return billService;
	}]);
