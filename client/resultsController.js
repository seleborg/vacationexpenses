angular.module('vacationExpenses.resultsController', [])
	.controller('resultsController', ['$scope', function ($scope) {
		$scope.preferredCurrency = {};
		$scope.results = {};

		$scope.$watch('billLoaded', function (loaded) {
			if (loaded) {
				$scope.bill.onUpdated($scope.updateResults);
				$scope.updateResults();
			}
		});

		$scope.$watch('preferredCurrency', function (newValue, oldValue) {
			if (newValue !== oldValue) {
				$scope.updateResults();
			}
		}, true);

		$scope.updateResults = function () {
			$scope.results = {};
			angular.forEach($scope.bill.names, function (name) {
				if (!angular.isDefined($scope.preferredCurrency[name])) {
					$scope.preferredCurrency[name] = 'USD';
				}

				var paid = $scope.bill.calculatePaid(name, $scope.preferredCurrency[name]);
				var due = $scope.bill.calculateDue(name, $scope.preferredCurrency[name])
				$scope.results[name] = {
					name: name,
					totalPaid: paid,
					totalDue: due,
					balance: paid - due
				};
			});
		};
	}]);
