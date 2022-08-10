#! /bin/python3
import time
from flask import Flask, render_template, send_from_directory, request, abort, after_this_request
import module.initiate as initiate
import module.rateLimiting as rateLimiting

app = Flask(__name__)

@app.route('/')
def homePage():
    return render_template("index.html")

# for a dirty implementation for rate limiting
global rate, prevTimestamp
rate = 0
prevTimestamp = time.time()

# when user inputted the domain that he/she would like to trace
@app.route("/tracedInfo/<string:ipAddr>", methods=["GET"])
def tracedInfo(ipAddr):
    cookies = request.cookies
    rateLimited = rateLimiting.serverRateLimiting(cookies)
    if rateLimited is not True:
        routesInfo = initiate.initiateTracing(ipAddr)
        if type(rateLimited) is dict:
            return rateLimiting.resetCookie(routesInfo, routesInfo["status"])
        return rateLimiting.increaseCounter(cookies, routesInfo, routesInfo["status"])
    else:
        abort(429)


# checking if the host can be reached
@app.route("/pingDomain/<string:domainName>", methods=["GET"])
def pingDomain(domainName):
    cookies = request.cookies
    rateLimited = rateLimiting.serverRateLimiting(cookies)
    if rateLimited is not True:
        domainNameAlive = initiate.checkIfDomainIsAlive(domainName)
        if type(rateLimited) is dict:
            return rateLimiting.resetCookie(domainNameAlive, domainNameAlive["status"])
        return rateLimiting.increaseCounter(cookies, domainNameAlive, domainNameAlive["status"])
    else:
        abort(429)

# for providing js, css, media file and as well as media files
@app.route('/js/<path:path>')
def route_JS_File(path): 
    return send_from_directory('assets/js', path)

@app.route('/css/<path:path>')
def route_CSS_File(path): 
    return send_from_directory('assets/css', path)

@app.route('/icon/<path:path>')
def route_Image_File(path): 
    return send_from_directory('assets/icon', path)

@app.route('/external/<path:path>')
def route_External_File(path): 
    return send_from_directory('assets/external', path)

if __name__ == '__main__':
    app.run()
    app.config.update(
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
    )
