import module.ipUtilities as ip_utilities
import module.utilities as utilities
from module.logOperation import CustomLogger

from dotenv import load_dotenv
import os, platform, subprocess, requests, json, logging

IP_INFO_KEY = os.getenv("IPINFO_API_KEY")
IP_GEOLOCATION_KEY = os.getenv("IPGEOLOCATION_API_KEY")

newLogger = CustomLogger()

def getRequestData(url):
    try:
        response = requests.get(url)
        statsCode = response.status_code
        if (statsCode == 200):
            newLogger.operationLog(f"Request Successful for [{url}]")
            jsonData = response.json()
        else:
            manageRequestResponse(statsCode, url)
        return jsonData
    except requests.exceptions.HTTPError as e:
        newLogger.errorLog( f"Error when requesting data from API server{str(e)}")
    return False

# logging
def manageRequestResponse(statsCode, url):
    if statsCode == 400:
        newLogger.errorLog(f"User invalid parameter usage when requesting data from [{url}]")
    if statsCode == 422:
        newLogger.errorLog(f"[{url}] is an invalid IP address")
    if statsCode == 429:
        newLogger.errorLog(f"API rate limit achieved")


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
                 newLogger.errorLog(f"{e.__class__} {e} occurred. Continuing with the next entry.")
        routes["routes"][index] = obj
    if routes is not None:
        return routes
    return False

def pingDomainName(domainIP):
    param = '-n' if platform.system().lower()=='windows' else '-c'
    command = ['ping', param, '1', domainIP]
    try:
        result = subprocess.call(
            command,
            stdout=subprocess.DEVNULL, 
            stderr=subprocess.STDOUT
        )
        newLogger.operationLog(f"Ping operation for [{domainIP}] is sucessful")
        print(result)
    except:
        newLogger.errorLog(f"Could not PING {domainIP}")
        return False
    return result == 0