angular.module('vacationExpenses.expenseController', [])
	.controller('expenseController', ['$scope', function ($scope) {
		$scope.toggleParticipantIfEqualShares = function (name) {
			if (!$scope.expense.sharingModel.equalShares) {
				return;
			}

			var shares = Number($scope.expense.sharingModel.shares[name]);
			if (shares != 0) {
				var newShares = 0;
			}
			else {
				var newShares = 1;
			}
			$scope.expense.sharingModel.shares[name] = newShares;
		}

		$scope.createNgClassObject = function (name) {
			var o = {};
			o[$scope.participantStatus[name]] = true;
			o['participant-clickable'] = $scope.expense.sharingModel.equalShares;
			return o;
		}

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
