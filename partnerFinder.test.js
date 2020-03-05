const partnerFinder = require('./partnerFinder');

test('Should return company 4 and company 13 in that order', async () => {
	let tester = partnerFinder()
	let result = await tester.getNearbyLocations().catch((error)=>{throw "Could not get locations"});
	if(!result) throw "No result"
	if(result[0].id !== 4 || result[1].id !== 13) throw "Order is incorrect"
});

test('Should be caught if incorrect origin location is found', async () => {
	let tester = partnerFinder()
	tester.originLocation = "What is this location?!"

	await tester.getNearbyLocations()
	.then((result)=>{
		throw "The function is not supposed to resolve"
	})
	.catch((error)=>{
		
	})
});

test('Should be caught if bad URL or non-conforming JSON is returned', async () => {
	let tester = partnerFinder()
	tester.jsonURL = "https://google.com/what"

	await tester.getNearbyLocations()
	.then((result)=>{
		throw "The function is not supposed to resolve"
	})
	.catch((error)=>{
		
	})
});