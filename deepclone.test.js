const deepClone = require('./deepClone');

let iterate = (objectA, objectB)=>{
	for(key in objectA) {
		expect(objectA[key]).toBe(objectB[key])
	}
}

test('Simple clone has correct values', () => {
	let cloneThis = {
		newHire: "Tobias",
		shouldHire: true
	}

	let clone = deepClone.simple(cloneThis)

	iterate(cloneThis, clone)
});

test('Overwriting deep clone source does not change deep clone', () => {

	let sourceClone = {
		newHire: "Tobias",
		shouldHire: true,
		someFunction: ()=>{ return "Spidergap is a good company" }
	}
	
	let cloneA = deepClone.full(sourceClone)
	let cloneB = deepClone.full(sourceClone)
	
	sourceClone = {
		newHire: "Another candidate",
		shouldHire: false,
		someFunction: ()=>{ return "I have never heard of Spidergap" }
	}

	iterate(cloneA, cloneB)
})

test('Circular reference is handled',()=>{
	// Create a circular object
	let reference = {
		name: "Tobias"
	}
	reference.reference = reference;

	let cloneThis = {
		newHire: "Tobias",
		shouldHire: true,
		circular: reference
	}

	let clone = deepClone.full(cloneThis)

	console.log(clone)

	expect(clone.circular.reference).toBe('[Circular]')

})