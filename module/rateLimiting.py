import time
from flask import make_response
# - use make_response instead of straight away return,
#   then when return give the response code also
# - check previous cookie if exists or not
# - if yes, check if the timestamp is less than 1 min
#   - if less than 1 min, get the request for the route
#     and increase the other cookie value by one
#   - for now setting to 5 request per min
# - if no then, set the new cookies with the timestamps and counts

def checkIfRequiredCookiePresent (cookies):
    return all(cookies.get(x) for x in ("rateTimestamp", "rateCounter"))

def resetCookie (response, statsCode):
    timestamp = time.time()
    resp = make_response(response, statsCode)
    resp.set_cookie("rateCounter", "1",max_age=60, httponly=True)
    resp.set_cookie("rateTimestamp", str(timestamp), max_age=60, httponly=True)
    return resp

def increaseCounter(cookie, response, statsCode):
    resp = make_response(response, statsCode)
    newCounter = int(cookie.get("rateCounter")) + 1
    resp.set_cookie("rateCounter", str(newCounter), max_age=60, httponly=True)
    return resp

# time for rate is in seconds
def serverRateLimiting (cookies):
    print(cookies.get("rateTimestamp"), cookies.get("rateCounter"))
    cookieValid = checkIfRequiredCookiePresent(cookies)
    print("cookieValid", cookieValid)
    newCookieNeeded = {"newCookieNeeded": True}
    try:
        if not cookieValid:
            return newCookieNeeded
        else:
            prevTimestamp = float(cookies.get("rateTimestamp"))
            curr = time.time()
            counter = int(cookies.get("rateCounter"))
            if curr - prevTimestamp < 60 * 1:
                if counter > 2:
                    return True
                else:
                    return False
            else:
                return newCookieNeeded
    except Exception as ex:
        print(ex)

