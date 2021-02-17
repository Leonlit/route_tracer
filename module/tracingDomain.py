import module.utilities as utilities
import platform, subprocess, re, ipaddress

def getTraceInfo (domainIP):
    result = traceDomain(domainIP)
    return result

def traceDomain(domainIP):
    platformType = platform.system().lower()
    if platformType =='windows':
        osType = 1 
    elif platformType == 'Linux':
        osType = 0
    else:
        return False #not supported for MAC OS yet
    
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
        data = {
            "domain": domainIP,
            "routes": filteredOutput
        }
        utilities.saveDataIntoFile(f"{domainIP}", data)
        print("done setting up data")
        print(data)
        return data
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
    if osType: # means its window
        ips = ips[1:]
    else:
        ips.pop(0)
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
        # if we can assign the ip address into the ipaddress's ip_address 
        # function, means that the ip address is valid (but not sure yet what type)
        ipaddress.ip_address(ipAddr)
        return True
    except ValueError as e: # when the ip address is invalid
        return False
