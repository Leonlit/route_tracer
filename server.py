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
    print(routesInfo)
    return (routesInfo["message"],routesInfo["status"]) #routesInfo.message,

@app.route("/pingDomain/<string:domainName>", methods=["GET"])
def pingDomain(domainName):
    print(domainName)
    domainNameAlive = initiate.checkIfDomainIsAlive(domainName)
    return (domainNameAlive, domainNameAlive["status"])

@app.route('/js/<path:path>')
def send_js(path): 
    return send_from_directory('assets/js', path)

@app.route('/css/<path:path>')
def send_css(path): 
    return send_from_directory('assets/css', path)

@app.route('/icon/<path:path>')
def send_icon(path): 
    return send_from_directory('assets/icon', path)

if __name__ == '__main__':
       app.run(debug = True)
