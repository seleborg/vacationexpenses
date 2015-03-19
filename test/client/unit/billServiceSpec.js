describe('vacationExpenses.billService', function () {
	describe('billService', function () {
		var billService;

		beforeEach(function () {
			billService = angular.injector(['vacationExpenses.billService']).get('billService');
		});


		describe('createBill', function () {
			it('can create a new bill', function () {
				var billData = {expenses: [
					{ name: "Joe", amount: 10,
						sharingModel: { equalShares: true, shares: {Sara: 1}}}
				]};

				var bill = billService.createBill(billData);

				expect(bill.expenses[0].name).toBe('Joe');
			});
		});


		describe('addExpense', function () {
			it('adds the expense to the list of expenses', function () {
				var bill = billService.createBill({expenses: []});
				bill.addExpense('John', 10, 'Food');

				expect(bill.expenses[0].name).toBe('John');
				expect(bill.expenses[0].amount).toBe(10);
				expect(bill.expenses[0].purpose).toBe('Food');
			});


			it('sets equalSharing to true by default', function () {
				var bill = billService.createBill({expenses: []});
				bill.addExpense('John', 10, 'Food');

				expect(bill.expenses[0].sharingModel.equalShares).toBeTruthy();
			});
		});
	});
});
