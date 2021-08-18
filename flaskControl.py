from datetime import datetime
import analyze as anlz
import pandas as pd
from hermesBot import Assassins, Guardians, Hunters, Mages, Warriors
from flask import Flask, render_template, request
# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address
from main import client

app = Flask(__name__)
# limiter = Limiter(
#         app,
#         key_func=get_remote_address,
#         default_limits=["250 per day", "50 per hour"]
# )

@app.route("/gods")
def get_all_gods():
        gdDict = anlz.get_gods()
        return gdDict

@app.route('/<god>', methods=["GET", "POST"])
def get_god_data(god):
        newgod = god.replace("_", " ")
        build = anlz.get_top_builds_discord(client, newgod, "Solo", req='flask')
        pbRate = anlz.get_pb_rate(client, newgod, req='flask')
        image = anlz.get_url(newgod)
        dataDict = {**build, **pbRate, **image}
        return dataDict


@app.route('/<god>/matchups', methods=["GET"])
def get_god_matchups(god):
        return anlz.get_worst_matchups(client, god , "Solo", req='flask')

@app.route('/<god>/<role>/<rank>', methods=["GET", "POST"])
def get_god_data_role(god, role, rank):
        newgod = god.replace("_", " ")
        if rank == "All_Ranks":
                build = anlz.get_top_builds_discord(client, newgod, role, req='flask')
        else:
                build = anlz.get_top_builds_discord_by_rank(client, newgod, role, rank, req='flask')
        pbRate = anlz.get_pb_rate(client, newgod, req='flask')
        image = anlz.get_url(newgod)
        dataDict = {**build, **pbRate, **image}
        return dataDict

@app.route('/<god>/matchups/<role>')
def get_god_matchups_by_role(god, role):
        return anlz.get_worst_matchups(client, god , role, req='flask')

@app.route('/<god>/matchups/<role>/<rank>')
def get_god_matchups_by_rank(god, role, rank):
        if rank != "All Ranks":
                return anlz.get_worst_matchups_by_rank(client, god, role, rank, req='flask')
        else:
                return anlz.get_worst_matchups(client, god, role, req='flask')


@app.route('/<god>/abilities')
def get_god_abilities(god):
        return anlz.get_abilities(client, god)

@app.route("/gettierlist/<rank>", methods=["GET", "POST"])
def get_tier_list(rank):
        retData = {}
        mydb = client["Tier_List"]
        roles = ["Carry", "Support", "Mid", "Jungle", "Solo"]
        totalData = {}
        for role in roles:
                if rank == "All_Ranks":
                        mycol = mydb["8/14/2021 - {}".format(role)]
                else:
                        mycol = mydb["8/14/2021 - {} - {}".format(role, rank)]
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