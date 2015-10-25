describe('vacationExpenses.creatingBill', function () {
	describe('homepage', function () {
		it('should have a "create bill" button', function () {
			browser.get('/');
			expect(element(by.id('createBillButton')).isPresent()).toBeTruthy();
		});
	});
})
