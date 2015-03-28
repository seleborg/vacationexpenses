angular.module('vacationExpenses.expenseController', [])
	.controller('expenseController', ['$scope', function ($scope) {
		$scope.expense = angular.copy($scope.expense);

		$scope.$watch('expense', function (expense, oldExpense) {
			if (expense !== oldExpense) {
				// console.log('expenseController.$watch.expense');
				$scope.bill.updateExpense($scope.$index, expense);
			}
		}, true);
	}]);
