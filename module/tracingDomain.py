def getTraceInfo (domainIP):
    result = traceDomain(domainIP)
    if result:



def traceDomain(domainIP):
    osType = 1 if platform.system().lower()=='windows' else 0
    commandtype = ('traceroute' ,'tracert')
    filename = f"> {domainIP}_route.txt"
    command = [commandtype[osType], domainIP, f" > {filename}"]
    try:
        routeOutput = subprocess.check_output(command)
        filteredOutput = filterRouteOutput(routeOutput, osType)
        return filteredOutput
    except:
        print("Unexpected error occured! Could not trace route.")
    return False

def filterRouteOutput(output, osType):
    '''
        # Linux version (to google.com)
            1st         :  domain traced to 
            2nd         :  my internal network
            3-5th       :  normally bogon 
            6th         :  US's DNS
            7th-(n-1)th :  jump to multiple node (location/machine/routers)
            nth         :  the server i'm assigned to access to

    '''
    linux = "traceroute google.com | awk /./ | grep -E '([0-2][0-9]+)(.)?' | awk '{print $3}' | grep . | tr -d '()'"

    