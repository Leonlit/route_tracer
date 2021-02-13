#! /bin/python3

from flask import Flask, render_template
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

@app.route("/checkDomain/<string:domainName>")
def tracedInfo(domainName):
    routesInfo = initiate.initiateTracing(ipAddr)
    return routesInfo

if __name__ == '__main__':
       app.run(debug = True)
