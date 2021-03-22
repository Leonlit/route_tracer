#! /bin/python3
from flask import Flask, render_template, send_from_directory
import module.initiate as initiate

app = Flask(__name__)

@app.route('/')
def homePage():
    return render_template("index.html")

# when user inputted the domain that he/she would like to trace
@app.route("/tracedInfo/<string:ipAddr>", methods=["GET"])
def tracedInfo(ipAddr):
    routesInfo = initiate.initiateTracing(ipAddr)
    return (routesInfo["message"],routesInfo["status"])

# checking if the host can be reached
@app.route("/pingDomain/<string:domainName>", methods=["GET"])
def pingDomain(domainName):
    domainNameAlive = initiate.checkIfDomainIsAlive(domainName)
    return (domainNameAlive, domainNameAlive["status"])

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
       app.run(debug = True)
