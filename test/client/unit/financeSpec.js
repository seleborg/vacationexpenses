describe('finance', function () {
	beforeEach(module('finance'));

	describe("recalculateResult", function () {
		var recalculateResult;

		beforeEach(function () {
			recalculateResult = angular.injector(['finance']).get('recalculateResult');
		});


		it("adds missing shares", function () {
			var bill = { expenses: [
				{ name: "Joe", amount: 10,
					sharingModel: { equalShares: true, shares: {}}}
			]};

			recalculateResult(bill);

			expect(bill.expenses[0].sharingModel.shares['Joe']).toBeDefined();
		});


		it("removes extraneous shares", function () {
			var bill = {expenses: [
				{ name: "Joe", amount: 10,
					sharingModel: { equalShares: true, shares: {Sara: 1}}}
			]};

			recalculateResult(bill);

			expect(bill.expenses[0].sharingModel.shares['Sara']).toBeUndefined();
		});


		it("leaves an empty share value empty and treats it as 0", function () {
			var bill = {expenses: [
				{ name: "Joe", amount: 10,
					sharingModel: { equalShares: false, shares: {Joe: ""}}}
			]};

			var result = recalculateResult(bill);

			expect(bill.expenses[0].sharingModel.shares["Joe"]).toBe("");
			expect(result['Joe'].totalDue).toBe(0);
		});


		it("works with only one expense", function () {
			var bill = {expenses: [
				{ name: "Joe", amount: 10,
					sharingModel: { equalShares: true, shares: {}}}
			]};

			var result = recalculateResult(bill);
			var joe = result["Joe"];
			expect(joe.name).toBe("Joe");
			expect(joe.totalPaid).toBe(10);
			expect(joe.totalDue).toBe(10);
		});


		it("divides due in two with equal shares", function () {
			var bill = {expenses: [
				{ name: "Joe", amount: 10,
					sharingModel: { equalShares: true, shares: {}}},
				{ name: "Sara", amount: 0,
					sharingModel: { equalShares: true, shares: {}}}
			]};

			var result = recalculateResult(bill);
			var joe = result["Joe"];
			expect(joe.name).toBe("Joe");
			expect(joe.totalPaid).toBe(10);
			expect(joe.totalDue).toBe(5);

			var sara = result["Sara"];
			expect(sara.name).toBe("Sara");
			expect(sara.totalPaid).toBe(0);
			expect(sara.totalDue).toBe(5);
		});


		it("divides due accordingly with unequal shares", function () {
			var bill = {expenses: [
				{ name: "Joe", amount: 30,
					sharingModel: { equalShares: false, shares: {Joe: 1, Sara: 2}}},
				{ name: "Sara", amount: 0,
					sharingModel: { equalShares: true, shares: {}}}
			]};

			var result = recalculateResult(bill);
			var joe = result["Joe"];
			expect(joe.name).toBe("Joe");
			expect(joe.totalPaid).toBe(30);
			expect(joe.totalDue).toBe(10);

			var sara = result["Sara"];
			expect(sara.name).toBe("Sara");
			expect(sara.totalPaid).toBe(0);
			expect(sara.totalDue).toBe(20);
		});
	});
});
