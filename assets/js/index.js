'use strict'

function initiate () {
	const dummyData = {
		"domain": "github.com",
		"routes": [
			{
				"ipType": "private",
				"ip": "192.168.68.1"
			},
			{
				"ipType": "public",
				"ip": "60.53.77.254",
				"city": "Seremban",
				"region": "Negeri Sembilan",
				"country": "MY",
				"loc": [
					2.7297,
					101.9381
				],
				"org": "AS4788 TM Net, Internet Service Provider",
				"postal": "70600",
				"timezone": "Asia/Kuala_Lumpur"
			},
			{
				"ipType": "private",
				"ip": "10.55.106.75"
			},
			{
				"ipType": "private",
				"ip": "10.55.100.207"
			},
			{
				"ipType": "private",
				"ip": "10.55.48.58"
			},
			{
				"ipType": "public",
				"ip": "52.46.166.54",
				"city": "Virginia Beach",
				"region": "Virginia",
				"country": "US",
				"loc": [
					36.8348,
					-76.0961
				],
				"postal": "23452",
				"timezone": "America/New_York"
			},
			{
				"ipType": "public",
				"ip": "52.93.63.90",
				"city": "Singapore",
				"region": "Singapore",
				"country": "SG",
				"loc": [
					1.2897,
					103.8501
				],
				"postal": "048508",
				"timezone": "Asia/Singapore"
			},
			{
				"ipType": "public",
				"ip": "52.93.63.99",
				"city": "Singapore",
				"region": "Singapore",
				"country": "SG",
				"loc": [
					1.2897,
					103.8501
				],
				"postal": "048508",
				"timezone": "Asia/Singapore"
			},
			{
				"ipType": "public",
				"ip": "150.222.240.83",
				"city": "New York City",
				"region": "New York",
				"country": "US",
				"loc": [
					40.7143,
					-74.006
				],
				"postal": "10004",
				"timezone": "America/New_York"
			},
			{
				"ipType": "public",
				"ip": "52.93.8.24",
				"city": "Singapore",
				"region": "Singapore",
				"country": "SG",
				"loc": [
					1.2897,
					103.8501
				],
				"postal": "048508",
				"timezone": "Asia/Singapore"
			},
			{
				"ipType": "public",
				"ip": "52.93.11.33",
				"city": "Singapore",
				"region": "Singapore",
				"country": "SG",
				"loc": [
					1.2897,
					103.8501
				],
				"postal": "048508",
				"timezone": "Asia/Singapore"
			},
			{
				"ipType": "public",
				"ip": "52.93.11.44",
				"city": "Singapore",
				"region": "Singapore",
				"country": "SG",
				"loc": [
					1.2897,
					103.8501
				],
				"postal": "048508",
				"timezone": "Asia/Singapore"
			},
			{
				"ipType": "public",
				"ip": "150.222.108.141",
				"city": "Singapore",
				"region": "Singapore",
				"country": "SG",
				"loc": [
					1.2897,
					103.8501
				],
				"postal": "048508",
				"timezone": "Asia/Singapore"
			},
			{
				"ipType": "public",
				"ip": "150.222.108.124",
				"city": "Singapore",
				"region": "Singapore",
				"country": "SG",
				"loc": [
					1.2897,
					103.8501
				],
				"postal": "048508",
				"timezone": "Asia/Singapore"
			},
			{
				"ipType": "public",
				"ip": "13.229.188.59",
				"hostname": "ec2-13-229-188-59.ap-southeast-1.compute.amazonaws.com",
				"city": "Singapore",
				"region": "Singapore",
				"country": "SG",
				"loc": [
					1.2897,
					103.8501
				],
				"org": "AS16509 Amazon.com, Inc.",
				"postal": "048508",
				"timezone": "Asia/Singapore"
			}
		]
	};
	
	const domainName = document.getElementById("domainName").value;
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