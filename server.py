#! /bin/python3

from flask import Flask, render_template, send_from_directory
app = Flask(__name__)

@app.route('/')
def homePage():
    return render_template("index.html")

# when user inputted the domain that he/she would like to trace
import module.initiate as initiate
@app.route("/tracedInfo/<string:ipAddr>")
def tracedInfo(ipAddr):
    routesInfo = initiate.initiateTracing(ipAddr)
    return routesInfo

@app.route("/pingDomain/<string:domainName>")
def pingDomain(domainName):
    domainNameAlive = initiate.checkIfDomainIsAlive(domainName)
    return domainNameAlive

@app.route('/js/<path:path>')
def send_js(path): 
    return send_from_directory('js', path)

if __name__ == '__main__':
       app.run(debug = True)
