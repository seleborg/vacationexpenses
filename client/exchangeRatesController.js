angular.module('vacationExpenses.exchangeRatesController', [])
	.controller('exchangeRatesController', ['$scope', '$http', function ($scope, $http) {
		$scope._updateDisplayedExchangeRates = function () {
			$scope.displayedExchangeRates = {};
			angular.forEach($scope.bill.currencies, function (cur, code) {
				$scope.displayedExchangeRates[code] =
					$scope.bill.currencies[$scope.bill.referenceCurrency].inEUR / cur.inEUR;
			});
		};

		$scope.$watch('bill.referenceCurrency', function () {
			if ($scope.bill) {
				$scope._updateDisplayedExchangeRates();
			}
		});

		$scope.$watch('bill.currencies', function (newValue, oldValue) {
			if (newValue !== oldValue) {
				$scope._updateDisplayedExchangeRates();
			}
		}, true);

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

		$scope.isFetchingExchangeRate = false;

		$scope.addCurrency = function () {
			$scope.isFetchingExchangeRate = true;
			var url = 'https://query.yahooapis.com/v1/public/yql'
				+ '?q=select%20*%20from%20yahoo.finance.xchange%20'
				+ 'where%20pair%20in%20(%22' + $scope.newCurrency + 'EUR%22)'
				+ '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback='
			$http.get(url)
				.success(function (data, status, headers, options) {
					var rate = Number(data.query.results.rate.Rate);
					$scope.bill.currencies[$scope.newCurrency] = { inEUR: rate };
					$scope.isFetchingExchangeRate = false;
				})
				.error(function (data, status, headers, options) {
					$scope.bill.currencies[$scope.newCurrency] = { inEUR: 1 };
					$scope.isFetchingExchangeRate = false;
				});
		};
	}]);
