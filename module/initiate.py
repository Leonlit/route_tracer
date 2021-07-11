import module.utilities as utilities
import module.tracingDomain as trace
import module.ipUtilities as ip_utilities
import module.logOperation as log
from module.errorHandling import RequestType, RequestError

rate_limit_reached = False

__log = log.loggingInit("initiate")

def initiateTracing (ipAddr):
    if not ip_utilities.isDomain_and_IP_valid(ipAddr):
        obj = RequestType.invalidIP.getResponse()
        msg = obj["message"]
        __log.Error(f"{ipAddr} {msg}")
        return obj
    if not utilities.pingDomainName(ipAddr):
        obj = RequestType.serviceUnavailable.getResponse()
        msg = obj["message"]
        __log.Error(f"{ipAddr} {msg}")
        return obj

    fullRouteData = trace.getTraceInfo(ipAddr)
    if not fullRouteData:
        obj = RequestType.internalError.getResponse()
        msg = obj["message"]
        __log.Error(f"{ipAddr} {msg}")
        return obj
    fullrouteInfo = utilities.getIpsInfoUsingAPI(fullRouteData)
    global rate_limit_reached
    if rate_limit_reached:
        obj = RequestType.rateLimitReach.getResponse()
        msg = obj["message"]
        __log.Error(f"{ipAddr} {msg}")
        return obj
    req = RequestError(200, fullrouteInfo)
    return req.getResponse()

def checkIfDomainIsAlive(domainIP):
    if not ip_utilities.isDomain_and_IP_valid(domainIP):
        obj = RequestType.invalidIP.getResponse()
        msg = obj["message"]
        __log.Error(f"{domainIP} {msg}")
        return obj
    res = utilities.pingDomainName(domainIP)
    if not res:
        obj = RequestType.serviceUnavailable.getResponse()
        msg = obj["message"]
        __log.Error(f"{domainIP} {msg}")
        return obj
    return RequestType.success.getResponse()