angular.module('vacationExpenses.billService', ['finance'])
	.service('billService', ['recalculateResult', function (recalculateResult) {
		var billService = {};

		billService.createBill = function (billData) {
			var billObject = {
				expenses: angular.copy(billData.expenses),
			};


			billObject.addExpense = function (name, amount, purpose) {
				var sharingModel = {
					equalShares: true,
					shares: {}
				};

				billObject.expenses.push({
					name: name,
					amount: amount,
					purpose: purpose,
					sharingModel: sharingModel,
				});
			};


			billObject.recalculateResult = function () {
				return recalculateResult(billObject);
			};


			return billObject;
		}

		return billService;
	}]);
