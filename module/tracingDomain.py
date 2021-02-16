import module.utilities as utilities
def getTraceInfo (domainIP):
    domainAlive = utilities.pingDomainName(domainIP)
    if not domainAlive:
        return False
    result = traceDomain(domainIP)
    return result

import platform, subprocess 
def traceDomain(domainIP):
    osType = 1 if platform.system().lower()=='windows' else 0
    commandtype = ('traceroute' ,'tracert')
    filename = f"{domainIP}_route.txt"
    command = [commandtype[osType], domainIP]
    try:
        routeOutput = subprocess.check_output(command)
        print(routeOutput)
        # now the results will be in list form
        filteredOutput = filterRouteOutput(routeOutput, osType)
        filteredOutput.insert(0, domainIP)
        return filteredOutput
    except Exception as e:
        print(e,"Unexpected error occured! Could not trace route.")
    return False

import re
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

import ipaddress
# if its not an public IP the system will just filter it out
def isIP_Public(ipAddr):
    if ipAddr is None:
        return False    
    return ipaddress.ip_address(ipAddr).is_global
