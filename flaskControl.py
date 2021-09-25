from datetime import datetime
import analyze as anlz
import pandas as pd
from constants import godsDict, roles
from flask import Flask, render_template, request
# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address
from main import client

app = Flask(__name__, static_folder="../hermesfrontend", static_url_path="/")
# limiter = Limiter(
#         app,
#         key_func=get_remote_address,
#         default_limits=["250 per day", "50 per hour"]
# )

@app.route("/gods")
def get_all_gods():
        gdDict = anlz.get_gods()
        return gdDict

@app.route('/<god>/<rank>/<patch>', methods=["GET", "POST"])
def get_god_data(god, rank, patch):
        newgod = god.replace("_", " ")
        build = anlz.get_top_builds_rewrite(client, god, "Solo", "8.9")
        pb_rate = anlz.get_pb_rate(client, newgod, rank, patch)
        image = {"url": anlz.get_url(newgod)}
        data_dict = {**build, **pb_rate, **image}
        return data_dict


@app.route('/<god>/matchups', methods=["GET"])
def get_god_matchups(god):
        return anlz.get_worst_matchups(client, god , "Solo")

@app.route('/<god>/<role>/<rank>/<patch>', methods=["GET", "POST"])
def get_god_data_role(god, role, rank, patch):
        newgod = god.replace("_", " ")
        if "All" in rank and patch == "current":
                build = anlz.get_top_builds_rewrite(client, god, role, patch)
        else: 
                build = anlz.get_top_builds_rewrite(client, god, role, patch, rank)

        pb_rate = anlz.get_pb_rate(client, newgod, rank, patch)
        image = {"url": anlz.get_url(newgod)}
        data_dict = {**build, **pb_rate, **image}
        return data_dict
        
@app.route('/<god>/matchups/<role>/<rank>/<patch>')
def get_god_matchups_by_rank(god, role, rank, patch):
        newgod = god.replace("_", " ")
        if "All" in rank and patch == "current":
                matchups = anlz.get_worst_matchups_rewrite(client, god, role, patch)
        else: 
                matchups = anlz.get_worst_matchups_rewrite(client, god, role, patch, rank)

        del matchups["wins"], matchups["games"], matchups["winRate"]
        return matchups

@app.route('/<god>/abilities')
def get_god_abilities(god):
        return anlz.get_abilities(client, god)

@app.route("/gettierlist/<rank>/<role>/<tableType>/<patch>", methods=["GET", "POST"])
def get_tier_list(rank, role, tableType, patch):
        retData = {god: {} for god in godsDict}
        if tableType == "Regular":
                mydb = client["Tier_List"]
                mycol = mydb["Tierlist - Regular test"]
                rank = rank.replace("_", " ")
                if "All" in role:
                        myquery = {"rank": rank, "patch": patch}
                else:
                        myquery = {"rank": rank, "role": role, "patch": patch}
                
                for x in mycol.find(myquery, {"_id": 0}):
                        dict_god = x["god"]
                        dict_role = x["role"]
                        if not retData[dict_god]:
                                retData[dict_god] = {dict_role: x}
                        else:
                                retData[dict_god][dict_role] = x

        elif tableType == "Combat":
                mydb = client["Tier_List"]
                mycol = mydb["Tierlist - Combat test"]
                rank = rank.replace("_", " ")
                if "All" in role:
                        myquery = {"rank": rank, "patch": patch}
                else:
                        myquery = {"rank": rank, "role": role, "patch": patch}
                
                for x in mycol.find(myquery, {"_id": 0}):
                        dict_god = x["god"]
                        dict_role = x["role"]
                        if not retData[dict_god]:
                                retData[dict_god] = {dict_role: x}
                        else:
                                retData[dict_god][dict_role] = x
        
        print(myquery)
        return retData


@app.route("/getitemdata/<item>")
def get_item_data(item):
        return anlz.get_item_data(client, item)
        
@app.route('/<god>/items/<role>/<rank>/<patch>')
def get_all_items(god, role, rank, patch):
        newgod = god.replace("_", " ")
        items = anlz.get_top_builds_rewrite(client, god, role, patch, rank, "All")

        return items

@app.route("/getmatch/<matchID>")
def get_match(matchID):
        mydb = client["Matches"]
        mycol = mydb["8.8 Matches"]
        match = ""
        matchID = int(matchID)
        for x in mycol.find({"MatchId": matchID}, {'_id': 0}):
                match = x


        for key in match:
                if "player" in key:
                        build = [
                        match[key]["Item_Purch_1"],
                        match[key]["Item_Purch_2"],
                        match[key]["Item_Purch_3"],
                        match[key]["Item_Purch_4"],
                        match[key]["Item_Purch_5"],
                        match[key]["Item_Purch_6"],
                        ]

                        match[key] = {**match[key], **{"godBuild": anlz.get_build_stats(client, build)}}
                
        return match

# make a route for every god, in the
# temp idea for routing
# for each god
# @app.route("/godname"):
# def godName():
#     collect god info
#     render_template("godbuild.html", other params)