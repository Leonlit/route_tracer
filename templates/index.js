'use strict'

function initiate (domainName) {
	const domainValidation = isDomainValid(domainName);
	if (!domainValidation) {
		showErrorPopUp(0);
		return
	}
	//const getJsonData = getTracedInfo(domainName)

}

function isDomainValid(domainName) {
	const url = `/checkDomain/${domainName}`
	const canPingDomain = getUrlRequest(url);
	console.log(canPingDomain);
}

function getTracedInfo (domainName) {
	const url = `/tracedInfo/${domainName}`;
	const response = getUrlRequest(url);
	console.log(response);
}

async function getUrlRequest (url) {
	return await fetch(url).then(response=>{
		if (response.ok) {
			return response.json()
		}
		throw new Error("Something went wrong"); 
	}).catch(error => {
		error.json().then(body=> {
			console.log(body);
		})
	});
}