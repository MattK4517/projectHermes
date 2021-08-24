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
        build = anlz.get_top_builds(client, newgod, "Solo")
        pb_rate = anlz.get_pb_rate(client, newgod)
        image = {"url": anlz.get_url(newgod)}
        data_dict = {**build, **pb_rate, **image}
        return data_dict


@app.route('/<god>/matchups', methods=["GET"])
def get_god_matchups(god):
        return anlz.get_worst_matchups(client, god , "Solo")

@app.route('/<god>/<role>/<rank>', methods=["GET", "POST"])
def get_god_data_role(god, role, rank):
        newgod = god.replace("_", " ")
        if "All" in rank:
                build = anlz.get_top_builds(client, newgod, role)
        else:
                build = anlz.get_top_builds(client, newgod, role, rank)

        pb_rate = anlz.get_pb_rate(client, newgod)
        image = {"url": anlz.get_url(newgod)}
        data_dict = {**build, **pb_rate, **image}
        return data_dict

@app.route('/<god>/matchups/<role>')
def get_god_matchups_by_role(god, role):
        return anlz.get_worst_matchups(client, god , role)

@app.route('/<god>/matchups/<role>/<rank>')
def get_god_matchups_by_rank(god, role, rank):
        if "All" not in rank:
                matchups =  anlz.get_worst_matchups(client, god, role, rank)
                del matchups["wins"], matchups["games"], matchups["winRate"]
                return matchups
        else:   
                matchups = anlz.get_worst_matchups(client, god, role)
                del matchups["wins"], matchups["games"], matchups["winRate"]
                return matchups


@app.route('/<god>/abilities')
def get_god_abilities(god):
        return anlz.get_abilities(client, god)

@app.route("/gettierlist/<rank>/<role>", methods=["GET", "POST"])
def get_tier_list(rank, role):
        print(rank, role)
        retData = {}
        mydb = client["Tier_List"]
        if "All" in role:
                roles = ["Carry", "Support", "Mid", "Jungle", "Solo"]
        else:
                roles = [role]
        totalData = {}
        for role in roles:
                if "All" in rank:
                        mycol = mydb["8/14/2021 - {}".format(role)]
                else:
                        mycol = mydb["8/14/2021 - {} - {}".format(role, rank)]
                for x in mycol.find():
                        retData = x
                del retData["_id"]
                totalData[role] = retData       
        return totalData

@app.route("/getitemdata/<item>")
def get_item_data(item):
        return anlz.get_item_data(client, item)
        
# make a route for every god, in the
# temp idea for routing
# for each god
# @app.route("/godname"):
# def godName():
#     collect god info
#     render_template("godbuild.html", other params)