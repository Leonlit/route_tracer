import module.utilities as utilities
import module.tracingDomain as trace
from module.errorHandling import RequestType, RequestError

def initiateTracing (ipAddr):
    if not trace.isIP_valid(ipAddr):
        return RequestType.invalidIP.getResponse()
    if not utilities.pingDomainName(ipAddr):
        return RequestType.invalidIP.serviceUnavailable()
    data = {}
    #userIP = utilities.getUserIpInfo()

    fullRouteData = trace.getTraceInfo(ipAddr)
    if not fullRouteData:
        return RequestType.internalError.getResponse()
    req = RequestError(200, fullRouteData)
    return req.getResponse()

def checkIfDomainIsAlive(domainIP):
    if not trace.isIP_valid(domainIP):
        return RequestType.invalidIP.getResponse()
    res = utilities.pingDomainName(domainIP)
    if not res:
        return RequestType.serviceUnavailable.getResponse()
    return RequestType.success.getResponse()