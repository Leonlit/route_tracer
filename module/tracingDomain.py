import module.utilities as utilities
import platform, subprocess, re, ipaddress

def getTraceInfo (domainIP):
    result = traceDomain(domainIP)
    return result

# need to figure out how to use traceroute in mac
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
    if  ipObj.is_link_local:
        return "public"
    return False

def isIP_valid(ipAddr):
    regex = ['^(https?:\\/\\/)?',                            # protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|', # domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))',                      # OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*',                  # port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?',                         # query string
		'(\\#[-a-z\\d_]*)?$']
    regexAll = "".join(regex)
    matched = re.match(regexAll, ipAddr)
    if matched:
        return True
    return False