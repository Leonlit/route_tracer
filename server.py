#! /usr/bin/env python

from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def homePage():
    return render_template("index.html")

@app.route("/tracedInfo/<string:domain>")
def tracedInfo(domain):
    return render_template('tracedInfo.html', domainName = domain)


if __name__ == '__main__':
       app.run(debug = True)
