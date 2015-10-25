exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['client/e2e/*Spec.js'],
	baseUrl: 'http://localhost:3000',
	capabilities: {
		browserName: "firefox"
	}
}
