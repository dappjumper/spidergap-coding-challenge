module.exports = function(){
	let PartnerFinder = {
		jsonURL: "https://success.spidergap.com/partners.json",
		proximityCutoffInKilometers: 100,
		originLocation: "51.515419,-0.141099"
	}

	PartnerFinder.request = function(url) {
		return new Promise((resolve, reject)=>{
			require('https').get(url, (response) => {
			  let data = '';

			  //Add response chunks to final data
			  response.on('data', (chunk) => {
			    data += chunk;
			  });

			  //All data received, resolve if JSON, otherwise reject
			  response.on('end', () => {
			    try {
			    	resolve(JSON.parse(data))
			    } catch(error) {
			    	reject(error)
			    }
			  });

			}).on("error", (error) => {
			  reject(error)
			});
		})
	}

	PartnerFinder.downloadLocations = function() {
		return new Promise((resolve, reject)=>{
			this.request(this.jsonURL)
				.then((response)=>{
					resolve(response)
				})
				.catch((error)=>{
					reject(error)
				})
		})
	}

	PartnerFinder.locationToArray = function(stringOrArrayLocation) {
		try {
			return (typeof stringOrArrayLocation == 'string' ? ()=>{
				let response = stringOrArrayLocation.replace(/\s/g,'').split(',').splice(0,2)
				for(index in response) {
					response[index] = parseFloat(response[index])
					if(isNaN(response[index])) throw "Invalid location"
				}
				return response
			} : stringOrArrayLocation)()
		} catch(error) {
			return error
		}

	}

	PartnerFinder.calculateDistance = function(pointA, pointB){
		try {
			let toRadiansFactor = Math.PI/180;

			let pA = this.locationToArray(pointA)
			let pB = this.locationToArray(pointB)

			let latitudeA = pA[0] * toRadiansFactor
			let latitudeB = pB[0] * toRadiansFactor
			let deltaLatitude = (pB[0]-pA[0]) * toRadiansFactor
			let deltaLongitude = (pB[1]-pA[1]) * toRadiansFactor

			let a = Math.sin(deltaLatitude/2) * Math.sin(deltaLatitude/2) +
			        Math.cos(latitudeA) * Math.cos(latitudeB) *
			        Math.sin(deltaLongitude/2) * Math.sin(deltaLongitude/2);
			let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

			return(6371e3 * c)
		} catch(error) {
			return error
		}
	}

	PartnerFinder.getNearbyLocations = async function(){
		if(!Array.isArray(this.locationToArray(this.originLocation))) return new Promise((resolve, reject)=>{
			reject(`Origin location: "${this.originLocation}" is not a valid location`)
		})
		this.cachedLocations = this.cachedLocations || await this.downloadLocations();
		return new Promise((resolve, reject)=>{
			if(typeof this.cachedLocations !== 'object') reject(this.errorHandler("Location list malformed"));
			try {
				let response = {}
				for(companyIndex in this.cachedLocations) {
					let potentialOffices = []
					let company = this.cachedLocations[companyIndex]
					
					for(officeIndex in company.offices) {
						let office = company.offices[officeIndex]
						let distanceInKilometers = this.calculateDistance(this.originLocation, office.coordinates) / 1000
						if(isNaN(distanceInKilometers)) break;
						if(distanceInKilometers < this.proximityCutoffInKilometers) {
							response[company.id] = response[company.id] || {...company,...{offices:[]}}
							response[company.id].offices.push(office)
						}
					}
				}
				resolve(Object.values(response).sort((a, b) => (a.organization.toLowerCase() > b.organization.toLowerCase()) ? 1 : -1))
			} catch(error) {
				reject(error)
			}
		})
	}
	return PartnerFinder
}