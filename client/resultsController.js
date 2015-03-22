angular.module('vacationExpenses.resultsController', [])
	.controller('resultsController', ['$scope', function ($scope) {
		$scope.$watch('billLoaded', function (loaded) {
			if (loaded) {
				$scope.bill.onUpdated($scope.onBillUpdated);
				$scope.onBillUpdated();
			}
		});
		$scope.onBillUpdated = function () {
			$scope.results = {};
			angular.forEach($scope.bill.names, function (name) {
				var paid = $scope.bill.calculatePaid(name, 'USD');
				var due = $scope.bill.calculateDue(name, 'USD')
				$scope.results[name] = {
					name: name,
					totalPaid: paid,
					totalDue: due,
					balance: paid - due,
				};
			});
		};
	}]);
