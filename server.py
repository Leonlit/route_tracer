#! /usr/bin/env python

from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def homePage():
    return render_template("index.html")

# when user inputted the domain that he/she would like to trace
import module.utilities as utilities
@app.route("/tracedInfo/<string:jsonData>")
def tracedInfo(jsonData):
    # utilities.getUserIpLocation()
    return render_template('tracedInfo.html', routesInfo = jsonData)


if __name__ == '__main__':
       app.run(debug = True)
