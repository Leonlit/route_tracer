import time
from flask import make_response

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
    cookieValid = checkIfRequiredCookiePresent(cookies)
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

