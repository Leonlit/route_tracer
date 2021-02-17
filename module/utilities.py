#!/usr/bin/env python
from dotenv import load_dotenv
import os, platform, subprocess

IP_INFO_KEY = os.getenv("IPINFO_API_KEY")
IP_GEOLOCATION_KEY = os.getenv("IPGEOLOCATION_API_KEY")

def getIpAddress():
    filename = "route.txt"
    with open(filename) as routeFile:
        routesList = routeFile.readlines()
    routesList = [ipAddr.rstrip() for ipAddr in routesList]
    print(routesList)
    return routesList

import requests, json
def getIpInfoUsingAPI (IPs):
    ipsInfo = []
    for ip in IPs:
        apiEndPoint = f"https://ipinfo.io/{ip}?token={IP_INFO_KEY}"
        try:
            ipInfo = getRequestData(apiEndPoint)
            if ipInfo is not None:
                ipsInfo.append(ipInfo)
        except Exception as e:
            print(e.__class__, "occurred. Continuing with the next entry.")
    if ipsInfo is not None:
        return ipsInfo
    return False

def getRequestData(url):
    try:
        response = requests.get(url)
        jsonData = json.loads(response.content)
        return jsonData
    except requests.exceptions.HTTPError as e:
        print(f"Error when requesting data from API server{str(e)}")
    return False

def getUserIpInfo():
    # URL to send the request to
    apiEndPoint = f'https://api.ipgeolocation.io/ipgeo?apiKey={IP_GEOLOCATION_KEY}'
    ipInfo = getRequestData(apiEndPoint)
    if ipInfo is not None:
        return ipInfo
    return False

def saveDataIntoFile(filename, data):
    with open(f'{filename}.txt', 'w', encoding='utf-8') as fileObj:
        json.dump(data, fileObj, ensure_ascii=False, indent=4)

def pingDomainName(domainIP):
    param = '-n' if platform.system().lower()=='windows' else '-c'
    command = ['ping', param, '1', domainIP]
    return subprocess.call(
        command,
        stdout=subprocess.DEVNULL, 
        stderr=subprocess.STDOUT
    ) == 0

def constructJSON(dataList):
    return json.dumps(dataList)