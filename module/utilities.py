import module.ipUtilities as ip_utilities
import module.utilities as utilities
import module.logOperation as log

from dotenv import load_dotenv
import os, platform, subprocess, requests, json

load_dotenv()
IP_INFO_KEY = os.getenv("IPINFO_API_KEY")

__log = log.loggingInit("utilities")

def getRequestData(url):
    try:
        response = requests.get(url)
        statsCode = response.status_code
        if (statsCode == 200):
            __log.info(f"API Request Successful for [{url}]")
            jsonData = response.json()
            return jsonData
        else:
            manageRequestResponse(statsCode, url)
    except requests.exceptions.HTTPError as e:
        __log.error( f"Error when requesting data from API server{str(e)}")

# logging
def manageRequestResponse(statsCode, url):
    if statsCode == 400:
        __log.error(f"User invalid parameter usage when requesting data from [{url}] - 400")
    if statsCode == 422:
        __log.error(f"[{url}] is an invalid IP address - 422")
    if statsCode == 429:
        __log.error(f"API rate limit achieved - 429")
        global rate_limit_reached
        rate_limit_reached = True


def getIpsInfoUsingAPI (routes):
    for index, ip in enumerate(routes["routes"]):
        ipType = ip_utilities.getIP_type(ip)
        obj = {
            "ipType": ipType
        }
        if not ip_utilities.isIP_public(ip):
            obj["ip"] = ip
        else:
            apiEndPoint = f"https://ipinfo.io/{ip}?token={IP_INFO_KEY}"
            try:
                ipInfo = getRequestData(apiEndPoint)
                if ipInfo is not None:
                    obj = obj | ipInfo # combining the data

                    coord_x, coord_y = obj["loc"].split(",")
                    newCoord = [float(coord_x),float(coord_y)]
                    obj["loc"] = newCoord
                    
            except Exception as e:
                __log.error(f"{e.__class__} {e} occurred. Continuing with the next entry.")
        routes["routes"][index] = obj
    if routes:
        return routes
    return False

def pingDomainName(domainIP):
    param = '-n' if platform.system().lower()=='windows' else '-c'
    command = ['ping', param, '1', "-4" ,domainIP]
    try:
        result = subprocess.call(
            command,
            stdout=subprocess.DEVNULL, 
            stderr=subprocess.STDOUT
        )
        __log.info(f"Ping operation for [{domainIP}] is sucessful")
    except Exception:
        __log.error(f"Could not PING {domainIP}")
        return False
    return result == 0