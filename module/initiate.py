import module.utilities as utilities
import module.tracingDomain as trace
import module.ipUtilities as ip_utilities
import module.logOperation as log
from module.errorHandling import RequestType, RequestError
import logging

def initiateTracing (ipAddr):
    if not ip_utilities.isDomain_and_IP_valid(ipAddr):
        return RequestType.invalidIP.getResponse()
    if not utilities.pingDomainName(ipAddr):
        return RequestType.serviceUnavailable.getResponse()

    fullRouteData = trace.getTraceInfo(ipAddr)
    if not fullRouteData:
        return RequestType.internalError.getResponse()
    fullrouteInfo = utilities.getIpsInfoUsingAPI(fullRouteData)
    req = RequestError(200, fullrouteInfo)
    return req.getResponse()

def checkIfDomainIsAlive(domainIP):
    if not ip_utilities.isDomain_and_IP_valid(domainIP):
        return RequestType.invalidIP.getResponse()
    res = utilities.pingDomainName(domainIP)
    if not res:
        return RequestType.serviceUnavailable.getResponse()
    return RequestType.success.getResponse()