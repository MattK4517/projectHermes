from datetime import datetime
import analyze as anlz
import pandas as pd
from hermesBot import Assassins, Guardians, Hunters, Mages, Warriors
from flask import Flask, render_template, request
from main import client

app = Flask(__name__)

@app.route("/gods")
def get_all_gods():
        return anlz.get_gods()

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
        return anlz.get_abilities(god)

@app.route("/gettierlist", methods=["GET", "POST"])
def get_tier_list():
        mydb = client["Tier_List"]
        mycol = mydb["8/4/2021 - Solo"]
        x = mycol.find()
        print(x)
        return x

# make a route for every god, in the
# temp idea for routing
# for each god
# @app.route("/godname"):
# def godName():
#     collect god info
#     render_template("godbuild.html", other params)