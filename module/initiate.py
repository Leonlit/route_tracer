import module.utilities as utilities

def initiateTracing (ipAddr):
    userIP = utilities.getUserIpInfo()
    return userIP # testing

def checkIfDomainIsAlive(domainIP):
    isDomainAlive = utilities.pingDomainName(domainIP)
    data = {
        "domainAlive": isDomainAlive
    }
    jsonData = utilities.constructJSON(data)
    return jsonData

