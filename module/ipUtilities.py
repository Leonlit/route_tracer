import ipaddress, re

# if its not an public IP the system will just filter it out
def isIP_public(ipAddr):
    if ipAddr is None:
        return False
    return ipaddress.ip_address(ipAddr).is_global

def getIP_type(ipAddr):
    ipObj = ipaddress.ip_address(ipAddr)
    if ipObj.is_private:
        return "private"
    if ipObj.is_multicast:
        return "multicast"
    if ipObj.is_unspecified:
        return "unspecified"
    if ipObj.is_reserved:
        return "reserved"
    if ipObj.is_loopback:
        return "loopback"
    if ipObj.is_link_local:
        return "link local"
    if  ipObj.is_global:
        return "public"
    return False

def isDomain_and_IP_valid(ipAddr):
    regex = ['^(https?:\\/\\/)?',                            # protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|', # domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))',                      # OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*',                  # port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?',                         # query string
		'(\\#[-a-z\\d_]*)?$']
    regexAll = "".join(regex)
    matched = re.match(regexAll, ipAddr)
    if matched:
        return True
    return False