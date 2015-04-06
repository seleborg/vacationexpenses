describe('vacationExpenses.creatingBill', function () {
	describe('homepage', function () {
		it('should have a "create bill" button', function () {
			browser.get('http://localhost:3000/');
			expect(element(by.id('createBillButton')).isPresent()).toBeTruthy();
		});
	});
})
