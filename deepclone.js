const deepClone = {
	verbose: false,
	errorHandler: function(error) {
		//Return error is this.verbose == true, otherwise just return false
		return (this.verbose ? error : false)
	}
}

deepClone.simple = function(objectToClone) {
	/*
	 * Note, data loss or graceful failure may happen if properties contain non-primitive values
	 */
	 try {
	 	return JSON.parse(
	 		JSON.stringify(
	 			objectToClone
	 		)
	 	)
	 } catch(error) {
	 	return this.errorHandler(error)
	 }
}

deepClone.full = function(objectToClone, lastSeenKey){
	try {
		/*
		 * Note, circular references will be converted to strings such as [Circular]
		 * Use this for very deep objects
		*/
		let response, value, key

		if(typeof objectToClone !== "object" || objectToClone === null) {
			// This is not an object. Arrays in javascript are also seen as objects.
			return objectToClone
		}

		// Assign the response to be either array or object depending on objectToClone
		response = Array.isArray(objectToClone) ? [] : {}

		for (key in objectToClone) {
			value = objectToClone[key]

			// If the same key is found twice in a row, assume circular reference. This prevents reaching maximum call stack size.
			if(lastSeenKey === key) return response[key] = `[Circular]`;

			// Set response[key] to value if non-object otherwise recursively run this function passing current key as lastSeenKey parameter to detect circular references and traverse the object tree.
			response[key] = (typeof value === "object" && value !== null) ? this.full(value, key) : value
		}
			
		return response

	} catch(error) {
		return this.errorHandler(error)
	}
}

module.exports = deepClone