#!/usr/bin/env python

def getIpAddress():
    filename = "route.txt"
    with open(filename) as routeFile:
        routesList = routeFile.readlines()
    routesList = [ipAddr.rstrip() for ipAddr in routesList]
    print(routesList)
    return routesList

import urllib.request, json
def getIpInfoUsingAPI (IPs):
    ipsInfo = []
    for ip in IPs:
        apiEndPoint = f"https://ipinfo.io/{ip}?token="
        print(apiEndPoint)
        try:
            apiResponse = urllib.request.urlopen(apiEndPoint)
            jsonData = json.loads(apiResponse.read().decode())
            ipsInfo.append(jsonData)
        except Exception as e:
            print("Oops!", e.__class__, "occurred.")
            print("Next entry.")
    return ipsInfo

def saveInfoIntoFile(infoArr):
    with open('IPsInfo.json', 'w', encoding='utf-8') as fileObj:
        json.dump(infoArr, fileObj, ensure_ascii=False, indent=4)

routes = getIpInfoUsingAPI()
ipsInformation = constructIpInfo(routes)

saveInfoIntoFile(ipsInformation)
for ipInfo in ipsInformation:
    print(ipInfo)

