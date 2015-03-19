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


			it('updates sharingModels when a new name is introduced', function () {
				var bill = billService.createBill({expenses: []});

				bill.addExpense('John', 10, 'Food');
				expect(bill.expenses[0].sharingModel.shares.John).toBe(1);
				expect(bill.expenses[0].sharingModel.shares.Bob).not.toBeDefined();

				bill.addExpense('Bob', 20, 'Shoes');
				angular.forEach(bill.expenses, function (expense) {
					expect(expense.sharingModel.shares.John).toBe(1);
					expect(expense.sharingModel.shares.Bob).toBe(1);
				});
			});
		});


		describe('updateExpense', function () {
			it('updates the expense properties', function () {
				var bill = billService.createBill({
					expenses: [
						{name: 'Joe', amount: 10, purpose: 'Shopping',
							sharingModel: {equalShares: true, shares: {Joe: 1}}}
					]
				});

				bill.updateExpense(0, {name: 'Bill', amount: 20, purpose: 'Food',
							sharingModel: {equalShares: true, shares: {Joe: 1}}});
				expect(bill.expenses[0].name).toBe('Bill');
				expect(bill.expenses[0].amount).toBe(20);
				expect(bill.expenses[0].purpose).toBe('Food');
			});


			it('keeps shares in sync', function () {
				var bill = billService.createBill({
					expenses: [
						{name: 'Joe', amount: 10, purpose: 'Shopping',
							sharingModel: {equalShares: false, shares: {Joe: 1, Bob: 4}}},
						{name: 'Bob', amount: 20, purpose: 'Food',
							sharingModel: {equalShares: true, shares: {Joe: 3, Bob: 4}}},
					]
				});

				bill.updateExpense(0, {
					name: 'Bill',
					amount: 10,
					purpose: 'Shopping',
					sharingModel: {
						equalShares: false,
						shares: {
							Joe: 1,	// This value will get overwritten
							Bob: 4,
						}
					}});

				angular.forEach(bill.expenses, function (expense) {
					expect(expense.sharingModel.shares.Joe).toBeUndefined();
					expect(expense.sharingModel.shares.Bob).toBe(4);
					expect(expense.sharingModel.shares.Bill).toBe(1);
				});
			});
		});
	});
});
