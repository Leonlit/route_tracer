import module.utilities as utilities
import module.tracingDomain as trace
from module.errorHandling import RequestType, RequestError

def initiateTracing (ipAddr):
    #if (not trace.isIPValid(ipAddr) or 
     #   not utilities.pingDomainName(ipAddr)):
     #   return str(RequestType.invalidIP)
    data = {}
    # userIP = utilities.getUserIpInfo()
    # print(userIP)
    fullRouteData = trace.getTraceInfo(ipAddr)
    if not fullRouteData:
        return False
        #error
    return fullRouteData # testing

def checkIfDomainIsAlive(domainIP):
    req = RequestError(
        200 ,{
            "domainAlive": utilities.pingDomainName(domainIP)
        }
    )
    return req.getResponse()