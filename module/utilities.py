import module.ipUtilities as ip_utilities
import module.utilities as utilities
from dotenv import load_dotenv
import os, platform, subprocess, requests, json, logging

IP_INFO_KEY = os.getenv("IPINFO_API_KEY")
IP_GEOLOCATION_KEY = os.getenv("IPGEOLOCATION_API_KEY")

def getIpAddress():
    filename = "route.txt"
    with open(filename) as routeFile:
        routesList = routeFile.readlines()
    routesList = [ipAddr.rstrip() for ipAddr in routesList]
    return routesList

def getRequestData(url):
    try:
        response = requests.get(url)
        statsCode = response.status_code
        if (statsCode == 200):
            jsonData = response.json()
        else:
            manageRequestResponse(statsCode)
        
        return jsonData
    except requests.exceptions.HTTPError as e:
        print(f"Error when requesting data from API server{str(e)}")
    return False

# logging
def manageRequestResponse(statsCode):
    #
    print("test")
    
    

def getIpsInfoUsingAPI (routes):
    for index, ip in enumerate(routes["routes"]):
        ipType = ip_utilities.getIP_type(ip)
        obj = {
            "ipType": ipType
        }
        if not ip_utilities.isIP_public(ip):
            obj["ip"] = ip
        else:
            print(IP_INFO_KEY)
            apiEndPoint = f"https://ipinfo.io/{ip}?token={IP_INFO_KEY}"
            try:
                ipInfo = getRequestData(apiEndPoint)
                
                if ipInfo is not None:
                    obj = obj | ipInfo # combining the data
                    coord_x, coord_y = obj["loc"].split(",")
                    newCoord = [float(coord_x),float(coord_y)]
                    obj["loc"] = newCoord
            except Exception as e:
                print(e.__class__, e, "occurred. Continuing with the next entry.")
        routes["routes"][index] = obj

    if routes is not None:
        utilities.saveDataIntoFile(routes["domain"]+"_info", routes)
        print(routes)
        return routes
        
    return False

def getUserIpInfo():
    # URL to send the request to
    apiEndPoint = f'https://api.ipgeolocation.io/ipgeo?apiKey={IP_GEOLOCATION_KEY}'
    ipInfo = getRequestData(apiEndPoint)
    if ipInfo is not None:
        return ipInfo
    return False

def saveDataIntoFile(filename, data):
    with open(f'./cache/{filename}.txt', 'w', encoding='utf-8') as fileObj:
        json.dump(data, fileObj, ensure_ascii=False, indent=4)

def pingDomainName(domainIP):
    param = '-n' if platform.system().lower()=='windows' else '-c'
    command = ['ping', param, '1', domainIP]
    try:
        result = subprocess.call(
            command,
            stdout=subprocess.DEVNULL, 
            stderr=subprocess.STDOUT
        )
        print(result)
    except:
        return False
    return result == 0