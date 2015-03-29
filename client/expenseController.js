angular.module('vacationExpenses.expenseController', [])
	.controller('expenseController', ['$scope', function ($scope) {
		$scope.participantStatus = {};

		$scope.$watch('expense', function (expense, oldExpense) {
			if (expense !== oldExpense) {
				// console.log('expenseController.$watch.expense');
				$scope.bill.updateExpense($scope.$index, expense);
			}
			$scope.participantStatus = {};
			angular.forEach(expense.sharingModel.shares, function (share, name) {
				if (expense.sharingModel.equalShares) {
					$scope.participantStatus[name] =
						share == 0
						? 'participant-inactive'
						: 'participant-active';
				}
				else {
					$scope.participantStatus[name] = 'participant-number';
				}
			})
		}, true);
	}]);
