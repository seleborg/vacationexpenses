describe('vacationExpenses.expensesEditing', function () {
	describe('New expense form', function () {
		it('should add the expense at the end of the expenses list', function () {
			browser.get('http://localhost:3000/example1');

			element(by.model('newExpense.name')).sendKeys('Alice');
			element(by.model('newExpense.amount')).sendKeys('100');
			element(by.model('newExpense.currency')).sendKeys('EUR');
			element(by.model('newExpense.purpose')).sendKeys('Protractor technology');
			element(by.id('addExpenseBtn')).click();

			var lastExpense = element.all(by.css('.expense')).last();

			expect(lastExpense.element(by.model('expense.name')).getAttribute('value')).toEqual('Alice');
			expect(lastExpense.element(by.model('expense.amount')).getAttribute('value')).toEqual('100');
			expect(lastExpense.element(by.model('expense.currency')).getAttribute('value')).toEqual('EUR');
			expect(lastExpense.element(by.model('expense.purpose')).getAttribute('value')).toEqual('Protractor technology');
		});
	});
});
