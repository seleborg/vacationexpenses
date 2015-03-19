angular.module('vacationExpenses.billService', ['finance'])
	.service('billService', ['recalculateResult', function (recalculateResult) {
		var billService = {};

		billService.createBill = function (billData) {
			var billObject = {
				expenses: angular.copy(billData.expenses),
			};


			billObject.recalculateResult = function () {
				return recalculateResult(billObject);
			};


			return billObject;
		}

		return billService;
	}]);
