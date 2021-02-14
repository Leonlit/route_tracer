'use strict'

function initiate () {
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
	const getJsonData = getTracedInfo(domainName)
	console.log(getJsonData);
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
	console.log(canPingDomain);
}

async function getTracedInfo (domainName) {
	const url = `/tracedInfo/${domainName}`;
	const response = await getUrlRequest(url);
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