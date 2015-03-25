angular.module('vacationExpenses.exchangeRatesController', [])
	.controller('exchangeRatesController', ['$scope', function ($scope) {
		$scope.$watch('bill.referenceCurrency', function () {
			if ($scope.bill) {
				$scope.displayedExchangeRates = {};
				angular.forEach($scope.bill.currencies, function (cur, code) {
					$scope.displayedExchangeRates[code] =
						$scope.bill.currencies[$scope.bill.referenceCurrency].inEUR / cur.inEUR;
				});
			}
		});

		$scope.$watch('displayedExchangeRates', function (newValue, oldValue) {
			if (oldValue !== newValue && $scope.bill) {
				var currencies = {};
				angular.forEach($scope.bill.currencies, function (cur, code) {
					currencies[code] = {
						inEUR: $scope.displayedExchangeRates['EUR'] / $scope.displayedExchangeRates[code]
					};
				});

				if (!angular.equals(currencies, $scope.bill.currencies)) {
					$scope.bill.currencies = currencies;
					$scope.$emit('billUpdated');
				}
			}
		}, true);
	}]);
