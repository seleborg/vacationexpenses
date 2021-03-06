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


		function effectiveShares(equalShares, shares) {
			shares = Number(shares);
			return equalShares ? (shares != 0 ? 1 : 0) : shares;
		}


		function sumShares(expense) {
			var sum = 0;
			angular.forEach(expense.sharingModel.shares, function (shares, _) {
				sum += effectiveShares(expense.sharingModel.equalShares, shares);
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
			if (angular.isDefined(billData)) {
				var billObject = {
					expenses: angular.copy(billData.expenses),
					currencies: angular.copy(billData.currencies),
					referenceCurrency: billData.referenceCurrency,
					names: allNames(billData.expenses),
					_updatedCallbacks: [],
				};
			}
			else {
				var billObject = {
					expenses: [],
					currencies: {
						EUR: {inEUR: 1}
					},
					referenceCurrency: 'EUR'
				};
			}


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
				var e = this.expenses[index];
				angular.forEach(newExpense, function (value, key) {
					e[key] = value;
				});

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
						var shares = effectiveShares(
							expense.sharingModel.equalShares,
							expense.sharingModel.shares[name]);

						var due = billObject._convertCurrency(
									amount,
									expense.currency,
									targetCurrencyCode)
							* (shares / totalShares);
					}

					totalDue += due;
				});

				return totalDue;
			};


			billObject.calculatePaid = function (name, targetCurrencyCode) {
				var totalPaid = 0;

				angular.forEach(this.expenses, function (expense) {
					if (expense.name == name) {
						var convertedAmount = billObject._convertCurrency(
							Number(expense.amount),
							expense.currency,
							targetCurrencyCode);

						totalPaid += convertedAmount;
					}
				});

				return totalPaid;
			};


			billObject._convertCurrency = function(amount, sourceCurrencyCode, targetCurrencyCode) {
				if (sourceCurrencyCode == targetCurrencyCode) {
					return amount;
				}
				else {
					var sourceCurrency = this.currencies[sourceCurrencyCode];
					var targetCurrency = this.currencies[targetCurrencyCode];
					return amount * sourceCurrency.inEUR / targetCurrency.inEUR;
				}
			};


			return billObject;
		}

		return billService;
	}]);
