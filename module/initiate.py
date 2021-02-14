import module.utilities as utilities
import module.tracingDomain as trace
def initiateTracing (ipAddr):
    data = {}
    userIP = utilities.getUserIpInfo()
    print(userIP)
    fullRouteData = trace.getTraceInfo(ipAddr)
    return fullRouteData # testing

def checkIfDomainIsAlive(domainIP):
    isDomainAlive = utilities.pingDomainName(domainIP)
    data = {
        "domainAlive": isDomainAlive
    }
    jsonData = utilities.constructJSON(data)
    return jsonData

