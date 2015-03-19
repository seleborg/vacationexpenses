describe('vacationExpenses.billService', function () {
	describe('billService', function () {
		var billService;

		beforeEach(function () {
			billService = angular.injector(['vacationExpenses.billService']).get('billService');
		});

		it('can create a new bill', function () {
			var billData = {expenses: [
				{ name: "Joe", amount: 10,
					sharingModel: { equalShares: true, shares: {Sara: 1}}}
			]};

			var bill = billService.createBill(billData);

			expect(bill.expenses[0].name).toBe('Joe');
		});
	});
});
