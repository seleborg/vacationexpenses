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
				expect(bill.names).toEqual(['Joe']);
			});
		});


		describe('addExpense', function () {
			it('adds the expense to the list of expenses', function () {
				var bill = billService.createBill({expenses: []});
				bill.addExpense('John', 10, 'EUR', 'Food');

				expect(bill.expenses[0].name).toBe('John');
				expect(bill.expenses[0].amount).toBe(10);
				expect(bill.expenses[0].currency).toBe('EUR');
				expect(bill.expenses[0].purpose).toBe('Food');
			});


			it('updates the names property', function () {
				var bill = billService.createBill({expenses: []});
				expect(bill.names).toEqual([]);

				bill.addExpense('John', 10, 'EUR', 'Food');
				expect(bill.names).toEqual(['John']);

				bill.addExpense('Bill', 20, 'EUR', 'Drinks');
				expect(bill.names).toContain('Bill');
				expect(bill.names).toContain('John');
			});


			it('sets equalSharing to true by default', function () {
				var bill = billService.createBill({expenses: []});
				bill.addExpense('John', 10, 'EUR', 'Food');

				expect(bill.expenses[0].sharingModel.equalShares).toBeTruthy();
			});


			it('updates sharingModels when a new name is introduced', function () {
				var bill = billService.createBill({expenses: []});

				bill.addExpense('John', 10, 'EUR', 'Food');
				expect(bill.expenses[0].sharingModel.shares.John).toBe(1);
				expect(bill.expenses[0].sharingModel.shares.Bob).not.toBeDefined();

				bill.addExpense('Bob', 20, 'EUR', 'Shoes');
				angular.forEach(bill.expenses, function (expense) {
					expect(expense.sharingModel.shares.John).toBe(1);
					expect(expense.sharingModel.shares.Bob).toBe(1);
				});
			});


			it('fires the onUpdated callback', function () {
				var bill = billService.createBill({expenses: []});

				var callbackFired = false;
				bill.onUpdated(function () {
					callbackFired = true;
				});
				bill.addExpense('Bob', 20, 'EUR', 'Shoes');
				expect(callbackFired).toBeTruthy();
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


			it('updates the names property', function () {
				var bill = billService.createBill({expenses: []});
				bill.addExpense('John', 10, 'EUR', 'Food');
				expect(bill.names).toEqual(['John']);

				bill.updateExpense('Joe', 10, 'EUR', 'Food');
				expect(bill.names).toEqual(['John']);
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


			it('fires the onUpdated callback', function () {
				var bill = billService.createBill({
					expenses: [
						{name: 'Joe', amount: 10, purpose: 'Shopping',
							sharingModel: {equalShares: true, shares: {Joe: 1}}}
					]
				});

				var callbackCalled = false;
				bill.onUpdated(function () {
					callbackCalled = true;
				});

				bill.updateExpense(0, {name: 'Bill', amount: 20, purpose: 'Food',
							sharingModel: {equalShares: true, shares: {Joe: 1}}});

				expect(callbackCalled).toBeTruthy();
			});
		});


		describe('deleteExpense', function () {
			it('removes the expense', function () {
				var bill = billService.createBill({
					expenses: [
						{name: 'Joe', amount: 10, purpose: 'Shopping',
							sharingModel: {equalShares: true, shares: {Joe: 1, Bob: 4}}},
						{name: 'Bob', amount: 20, purpose: 'Food',
							sharingModel: {equalShares: true, shares: {Joe: 3, Bob: 4}}},
					]
				});

				bill.deleteExpense(0);
				expect(bill.expenses[0].name).toBe('Bob');
			});


			it('updates the names property', function () {
				var bill = billService.createBill({expenses: []});
				bill.addExpense('John', 10, 'EUR', 'Food');
				expect(bill.names).toEqual(['John']);

				bill.deleteExpense(0);
				expect(bill.names).toEqual([]);
			});


			it('keeps shares in sync', function () {
				var bill = billService.createBill({
					expenses: [
						{name: 'Joe', amount: 10, purpose: 'Shopping',
							sharingModel: {equalShares: true, shares: {Joe: 1, Bob: 4}}},
						{name: 'Bob', amount: 20, purpose: 'Food',
							sharingModel: {equalShares: true, shares: {Joe: 3, Bob: 4}}},
					]
				});

				bill.deleteExpense(0);
				expect(bill.expenses[0].sharingModel.shares.Joe).not.toBeDefined();
				expect(bill.expenses[0].sharingModel.shares.Bob).toBeDefined();
			});


			it('fires the onUpdated callback', function () {
				var bill = billService.createBill({
					expenses: [
						{name: 'Joe', amount: 10, purpose: 'Shopping',
							sharingModel: {equalShares: true, shares: {Joe: 1}}}
					]
				});

				var callbackCalled = false;
				bill.onUpdated(function () {
					callbackCalled = true;
				});

				bill.deleteExpense(0);
				expect(callbackCalled).toBeTruthy();
			});
		});


		describe('calculateResult', function () {
			it("works with only one expense", function () {
				var bill = billService.createBill({
					expenses: [
						{name: 'Joe', amount: 10, purpose: 'Shopping',
							sharingModel: {equalShares: true, shares: {Joe: 1}}}
					]
				});

				var result = bill.calculateResult(bill);
				expect(result.Joe.name).toBe('Joe');
				expect(result.Joe.totalPaid).toBe(10);
				expect(result.Joe.totalDue).toBe(10);
			});


			it("divides due in two with equal shares", function () {
				var bill = billService.createBill({
					expenses: [
						{name: 'Joe', amount: 10, purpose: 'Shopping',
							sharingModel: {equalShares: true, shares: {Joe: 1, Bob: 4}}},
						{name: 'Bob', amount: 20, purpose: 'Food',
							sharingModel: {equalShares: true, shares: {Joe: 3, Bob: 4}}},
					]
				});

				var result = bill.calculateResult(bill);
				expect(result.Joe.totalPaid).toBe(10);
				expect(result.Joe.totalDue).toBe(15);
				expect(result.Bob.totalPaid).toBe(20);
				expect(result.Bob.totalDue).toBe(15);
			});


			it("divides due accordingly with unequal shares", function () {
				var bill = billService.createBill({
					expenses: [
						{name: 'Joe', amount: 30, purpose: 'Shopping',
							sharingModel: {equalShares: false, shares: {Joe: 1, Bob: 2}}},
						{name: 'Bob', amount: 0, purpose: 'Food',
							sharingModel: {equalShares: true, shares: {Joe: 1, Bob: 1}}},
					]
				});

				var result = bill.calculateResult(bill);
				expect(result.Joe.totalPaid).toBe(30);
				expect(result.Joe.totalDue).toBe(10);
				expect(result.Bob.totalPaid).toBe(0);
				expect(result.Bob.totalDue).toBe(20);
			});
		});
	});
});
