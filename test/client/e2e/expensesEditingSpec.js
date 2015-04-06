describe('vacationExpenses.expensesEditing', function () {
	var newExpensesForm = element(by.id('newExpense'));

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


		it('should not have an empty currency chooser on any expense line', function () {
			browser.get('http://localhost:3000/example1');

			newExpensesForm.all(by.css('option')).each(function (element, index) {
				expect(element.getText()).not.toEqual('');
				expect(element.getAttribute('value')).not.toEqual('?');
			});
		});


		it('should re-use the last used currency', function () {
			browser.get('http://localhost:3000/example1');

			var lastExpense = element.all(by.css('.expense')).last();

			expect(lastExpense.element(by.model('expense.currency')).getAttribute('value')).toEqual('GBP');
			expect(element(by.model('newExpense.currency')).getAttribute('value')).toEqual('GBP');

			element(by.model('newExpense.name')).sendKeys('Alice');
			element(by.model('newExpense.amount')).sendKeys('100');
			element(by.model('newExpense.currency')).sendKeys('EUR');
			element(by.model('newExpense.purpose')).sendKeys('Protractor technology');
			element(by.id('addExpenseBtn')).click();

			expect(element(by.model('newExpense.currency')).getAttribute('value')).toEqual('EUR');
		});


		it('should not have an empty currency chooser in the results panel', function () {
			browser.get('http://localhost:3000/empty');

			element(by.model('newExpense.name')).sendKeys('Alice');
			element(by.model('newExpense.amount')).sendKeys('100');
			element(by.model('newExpense.currency')).sendKeys('EUR');
			element(by.model('newExpense.purpose')).sendKeys('Protractor technology');
			element(by.id('addExpenseBtn')).click();

			element.all(by.css('#totals #currency-chooser')).then(function (choosers) {
				for (var i = 0; i < choosers.length; ++i) {
					var chooser = choosers[i];
					expect(chooser.getAttribute('value')).toEqual('EUR');
				}
			});
		});
	});
});
