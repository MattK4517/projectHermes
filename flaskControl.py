from datetime import datetime
import analyze as anlz
import pandas as pd
from hermesBot import Assassins, Guardians, Hunters, Mages, Warriors
from flask import Flask, render_template, request
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from main import client

app = Flask(__name__)
limiter = Limiter(
        app,
        key_func=get_remote_address,
        default_limits=["250 per day", "50 per hour"]
)

@app.route("/gods")
def get_all_gods():
        gdDict = anlz.get_gods()
        return gdDict

@app.route('/<god>', methods=["GET", "POST"])
def get_god_data(god):
        dataSheet = pd.read_excel("God Abilities & Items.xlsx", sheet_name="all_items")
        newgod = god.replace("_", " ")
        build = anlz.get_top_builds_discord(client, newgod, "Solo", dataSheet, req='flask')
        pbRate = anlz.get_pb_rate(client, newgod, req='flask')
        image = anlz.get_url(newgod)
        dataDict = {**build, **pbRate, **image}
        return dataDict


@app.route('/<god>/matchups', methods=["GET"])
def get_god_matchups(god):
        return anlz.get_worst_matchups(client, god , "Solo", req='flask')

@app.route('/<god>/<role>', methods=["GET", "POST"])
def get_god_data_role(god, role):
        dataSheet = pd.read_excel("God Abilities & Items.xlsx", sheet_name="all_items")
        newgod = god.replace("_", " ")
        build = anlz.get_top_builds_discord(client, newgod, role, dataSheet, req='flask')
        pbRate = anlz.get_pb_rate(client, newgod, req='flask')
        image = anlz.get_url(newgod)
        dataDict = {**build, **pbRate, **image}
        return dataDict

@app.route('/<god>/matchups/<role>')
def get_god_matchups_byrole(god, role):
        return anlz.get_worst_matchups(client, god , role, req='flask')


@app.route('/<god>/abilities')
def get_god_abilities(god):
        return anlz.get_abilities(client, god)

@app.route("/gettierlist", methods=["GET", "POST"])
def get_tier_list():
        mydb = client["Tier_List"]
        roles = ["Carry", "Support", "Mid", "Jungle", "Solo"]
        totalData = {}
        for role in roles:
                mycol = mydb["8/11/2021 - {}".format(role)]
                for x in mycol.find():
                        retData = x
                del retData["_id"]
                totalData[role] = retData
        return totalData

# make a route for every god, in the
# temp idea for routing
# for each god
# @app.route("/godname"):
# def godName():
#     collect god info
#     render_template("godbuild.html", other params)