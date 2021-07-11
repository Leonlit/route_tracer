import platform, subprocess, re
import module.logOperation as log

def getTraceInfo (domainIP):
    result = traceDomain(domainIP)
    # saveResult(result)  # save file needed 
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
            "routes": filteredOutput[0],
            "avgTime": filteredOutput[1]
        }
        print("done setting up data")
        __log.info(f"Route traced for [{domainIP}]")
        # returning a dictionary 
        return data
    except Exception as e:
        __log.error(f"Unexpected error occured! Could not trace route. for domain [{domainIP}]")
    return False

def calculateAveTime(result):
    for idx in range(len(result)):
        result[idx] = int(result[idx].replace(" m", ""))
    return round(sum(result)/len(result), 4)
    

def filterRouteOutput(output, osType):
    outputContents = output.split("\n")
    #matching ip addresses
    ipRegex = '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}'
    msRegex = '\d{1,} m'
    ips = []
    avgTimes = []
    for line in outputContents:
        ipMatch = re.findall(ipRegex, line)
        avgMatch = re.findall(msRegex, line)
        if ipMatch:
            ips.append(ipMatch[0])
            if avgMatch:
                avgTime = calculateAveTime(avgMatch)
                avgTimes.append(avgTime)
    if not ips:
        return False
    if osType: # means its window
        ips = ips[1:]
    else:
        ips.pop(0)
    return [ips, avgTimes]