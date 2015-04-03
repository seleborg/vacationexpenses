angular.module('vacationExpenses.homepageController', [])
	.controller('homepageController', ['$scope', function ($scope) {
		$scope.createNewBill = function () {
			console.log('Create new bill');
		}
	}])
;