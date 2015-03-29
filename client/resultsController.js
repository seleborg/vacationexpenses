angular.module('vacationExpenses.resultsController', [])
	.controller('resultsController', ['$scope', function ($scope) {
		$scope.preferredCurrency = {};
		$scope.results = {};

		$scope.$watch('billLoaded', function (loaded) {
			if (loaded) {
				//console.log('resultsController.$watch.billLoaded');
				$scope.bill.onUpdated($scope.updateResults);
				$scope.updateResults();

				$scope.$watch('bill.referenceCurrency', function (newValue, oldValue) {
					if (newValue !== oldValue) {
						// console.log('resultsController.$watch.bill.referenceCurrency ' + newValue + ', ' + oldValue);
						$scope.$emit('billUpdated');
					}
				});

				$scope.$watch('bill.currencies', function (newValue, oldValue) {
					if (newValue !== oldValue) {
						// console.log('resultsController.$watch.bill.currencies');
						$scope.updateResults();
					}
				}, true);

				$scope.$watch('preferredCurrency', function (newValue, oldValue) {
					if (newValue !== oldValue) {
						// console.log('resultsController.$watch.preferredCurrency');
						$scope.updateResults();
					}
				}, true);
			}
		});


		$scope.updateResults = function () {
			// console.log('resultsController.updateResults');
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
	}])


	.filter('ve_currency', [function () {
		return function (amount, currencySymbol) {
			if (angular.isUndefined(currencySymbol)) {
				currencySymbol = '';
			}
			else {
				currencySymbol = currencySymbol + ' ';
			}

			// if null or undefined pass it through
			return (amount == null)
				? amount
				: currencySymbol + Number(amount).toFixed(2);
		};
	}])
