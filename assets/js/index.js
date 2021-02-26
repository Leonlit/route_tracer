'use strict'

async function initiate () {
	const dummyData = {
		"domain": "google.com",
		"routes": [
			{
				"ip": "192.168.68.1",
				"ipType": "private"
			},
			{
				"ipType": "public",
				"ip": "175.140.89.254",
				"city": "Seremban",
				"region": "Negeri Sembilan",
				"country": "MY",
				"loc": "2.7297,101.9381",
				"org": "AS4788 TM Net, Internet Service Provider",
				"postal": "70600",
				"timezone": "Asia/Kuala_Lumpur"
			},
			{
				"ip": "10.55.106.75",
				"ipType": "private"
			},
			{
				"ip": "10.55.39.154",
				"ipType": "private"
			},
			{
				"ip": "10.55.48.58",
				"ipType": "private"
			},
			{
				"ipType": "public",
				"ip": "72.14.198.56",
				"city": "Mountain View",
				"region": "California",
				"country": "US",
				"loc": "37.4056,-122.0775",
				"org": "AS15169 Google LLC",
				"postal": "94043",
				"timezone": "America/Los_Angeles"
			},
			{
				"ipType": "public",
				"ip": "108.170.250.1",
				"city": "Mountain View",
				"region": "California",
				"country": "US",
				"loc": "37.4056,-122.0775",
				"org": "AS15169 Google LLC",
				"postal": "94043",
				"timezone": "America/Los_Angeles"
			},
			{
				"ipType": "public",
				"ip": "108.170.230.129",
				"city": "Mountain View",
				"region": "California",
				"country": "US",
				"loc": "37.4056,-122.0775",
				"org": "AS15169 Google LLC",
				"postal": "94043",
				"timezone": "America/Los_Angeles"
			},
			{
				"ipType": "public",
				"ip": "216.58.196.14",
				"hostname": "kul08s09-in-f14.1e100.net",
				"city": "Bangkok",
				"region": "Bangkok",
				"country": "TH",
				"loc": "13.7540,100.5014",
				"org": "AS15169 Google LLC",
				"postal": "10100",
				"timezone": "Asia/Bangkok"
			}
		]
	};
	
	const domainName = document.getElementById("domainName").value;
	console.log(domainName);
	const domainPatternValidation = isUrlValid(domainName);
	if (!domainPatternValidation) {
		showErrorPopUp(0);
		return 
	}
	const domainStatusValidation = isDomainAlive(domainName);
	if (!domainStatusValidation) {
		showErrorPopUp(1);
		return
	}
	getTracedInfo(domainName).then(data=>{ 
		console.log(data);
		generatingRoutesOnMap(data);
	})
}

function isUrlValid(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return !!pattern.test(str);
}

async function isDomainAlive(domainName) {
	const url = `/pingDomain/${domainName}`
	const canPingDomain = await getUrlRequest(url);
	return canPingDomain;
}

async function getTracedInfo (domainName) {
	const url = `/tracedInfo/${domainName}`;
	const response = await getUrlRequest(url);
	return response;
}

async function getUrlRequest (url) {
	return await fetch(url).then(response=>{
		if (response.ok) {
			return response.json()
		}
		throw new Error("Something went wrong"); 
	}).catch(error => {
		console.log(error);
	})
}