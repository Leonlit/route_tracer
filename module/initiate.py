import utilities as utilities
import tracingDomain as trace
from errorHandling import RequestType, RequestError

def initiateTracing (ipAddr):
    #if (not trace.isIPValid(ipAddr) or 
     #   not utilities.pingDomainName(ipAddr)):
     #   return str(RequestType.invalidIP)
    data = {}
    # userIP = utilities.getUserIpInfo()
    # print(userIP)
    fullRouteData = trace.getTraceInfo(ipAddr)
    print ("full route")
    print(fullRouteData)
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

initiateTracing("google.com")