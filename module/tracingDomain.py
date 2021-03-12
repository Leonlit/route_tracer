import module.utilities as utilities
import platform, subprocess, re, ipaddress, logging
import module.logOperation as log

def getTraceInfo (domainIP):
    result = traceDomain(domainIP)
    return result

__log = log.loggingInit("domainTracing")

# need to figure out how to use traceroute in mac
def traceDomain(domainIP):
    platformType = platform.system().lower()
    if platformType =='windows':
        osType = 1 
    elif platformType == 'Linux':
        osType = 0
    else:
        return False #not supported for MAC OS yet
    
    # constructing the command
    commandtype = ('traceroute' ,'tracert')
    filename = f"./{domainIP}_route.txt"
    command = [commandtype[osType], "-4", domainIP]

    # if somehow the command execution return an unexpected error
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
        print("done setting up data")
        __log.info(f"Route traced for [{domainIP}]")
        # returning a dictionary ^
        return data
    except Exception as e:
        __log.critical(f"Unexpected error occured! Could not trace route. for domain [{domainIP}]")
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