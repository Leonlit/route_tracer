import utilities as utilities
import platform, subprocess, re, ipaddress

def getTraceInfo (domainIP):
    result = traceDomain(domainIP)
    return result

def traceDomain(domainIP):
    osType = 1 if platform.system().lower()=='windows' else 0
    commandtype = ('traceroute' ,'tracert')
    filename = f"./{domainIP}_route.txt"
    command = [commandtype[osType], domainIP]
    try:
        routeOutput = subprocess.run(
            command,
            capture_output=True
        )
        commandOutput = routeOutput.stdout.decode("utf-8")
        # now the results will be in list form
        filteredOutput = filterRouteOutput(commandOutput, osType)
        filteredOutput.insert(0, domainIP)
        data = {
            "domain": domainIP,
            "routes": filteredOutput
        }
        utilities.saveDataIntoFile(f"{domainIP}", data)
        return filteredOutput
    except Exception as e:
        print(e,"Unexpected error occured! Could not trace route.")
    return False

def filterRouteOutput(output, osType):
    outputContents = output.split("\n")
    #matching ip addresses
    regex = '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}'
    ips = []
    for line in outputContents:
        match = re.findall(regex, line)
        if match:
            ips.append(match[0])
    if not ips:
        return False
    return ips

# if its not an public IP the system will just filter it out
def isIP_public(ipAddr):
    if ipAddr is None:
        return False
    return ipaddress.ip_address(ipAddr).is_global

def getIP_type(ipAddr):
    ipObj = ipaddress.ip_address(ipAddr)
    if ipObj.is_private:
        return "private"
    if ipObj.is_multicast:
        return "multicast"
    if ipObj.is_unspecified:
        return "unspecified"
    if ipObj.is_reserved:
        return "reserved"
    if ipObj.is_loopback:
        return "loopback"
    if ipObj.is_link_local:
        return "link local"
    return "public"

def isIPValid(ipAddr):
    try:
        test = ipaddress.ip_address(ipAddr)
        return True
    except ValueError as e:
        return False
