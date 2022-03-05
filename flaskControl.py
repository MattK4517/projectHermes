from datetime import datetime
from queue import Empty
import analyze as anlz
import analyze_players as anlzpy
import pandas as pd
from constants import godsDict, roles
from flask import Flask, render_template, request
# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address
from __init__ import client
from collections import OrderedDict
from operator import getitem
import analyze_players as anlzpy
from duo_tier_list import get_lanes
import pyrez
from pyrez.api import SmiteAPI
import flaskHelper as fh
import json
from bson import json_util
from damage_calculator import calc_combo_damage_raw
from carry_score_analytics import get_carry_score_averages

app = Flask(__name__, static_folder="../hermesfrontend", static_url_path="/")
# limiter = Limiter(
#         app,
#         key_func=get_remote_address,
#         default_limits=["250 per day", "50 per hour"]
# )


@app.route("/api/gods")
def get_all_gods():
    gdDict = anlz.get_gods()
    return gdDict

@app.route('/api/main/<god>/<role>/<rank>/<patch>/<mode>/<matchup>', methods=["GET", "POST"])
@app.route('/api/main/<god>/<role>/<rank>/<patch>/<mode>', methods=["GET", "POST"])
def get_god_data(god, role, rank, patch, mode, matchup="None"):
    newgod = god.replace("_", " ")
    winrate = anlz.get_winrate(client, god, role, patch, mode, rank, matchup)
    pbrate = anlz.get_pb_rate(client, god, rank, role, patch, mode)
    # print(winrate, pbrate)
    return {
        **{
            "url": anlz.get_url(newgod),
            "tier": anlz.get_tier(client, winrate["win_rate"], pbrate["pickRate"], pbrate["banRate"], role, rank),
        },
        **pbrate,
        **winrate
    }


@app.route('/api/<god>/matchups', methods=["GET"])
def get_god_matchups(god):
    return anlz.get_worst_matchups(client, god, "Solo")


@app.route('/api/<god>/<role>/<rank>/<patch>/<mode>/<matchup>')
@app.route('/api/<god>/<role>/<rank>/<patch>/<mode>', methods=["GET", "POST"])
def get_god_data_role(god, role, rank, patch, mode, matchup="None"):
    newgod = god.replace("_", " ")
    if matchup != "None":
        return anlz.get_specific_build(client, god, role, patch, matchup, rank, mode)
    elif "All" in rank and matchup == "None":
        build = anlz.get_top_builds(client, god, role, patch, mode)
    elif matchup == "None":
        build = anlz.get_top_builds(client, god, role, patch, mode, rank)

    # pb_rate = anlz.get_pb_rate(client, newgod, rank, role, patch)
    image = {"url": anlz.get_url(newgod)}
    data_dict = {**build, **image}
    return data_dict


@app.route('/api/<god>/matchups/<role>/<rank>/<patch>/<mode>')
def get_god_matchups_by_rank(god, role, rank, patch, mode):
    if "All" in rank and patch == "current":
        matchups = anlz.get_worst_matchups(client, god, role, patch, mode)
    else:
        matchups = anlz.get_worst_matchups(
            client, god, role, patch, mode, rank)

    del matchups["wins"], matchups["games"], matchups["winRate"]
    return matchups


@app.route('/api/<god>/abilities')
def get_god_abilities(god):
    return anlz.get_abilities(client, god)


@app.route("/api/gettierlist/<rank>/<role>/<tableType>/<mode>", methods=["GET", "POST"])
def get_tier_list(rank, role, tableType, mode):
    rank = rank.replace("_", " ")
    retData = {god: {} for god in godsDict}
    mydb = client["Tier_list"]
    patch = "9.1"
    if tableType == "Regular":
        mycol = mydb["Regular List"]
        rank = rank.replace("_", " ")
        if "All" in role:
            myquery = {"rank": rank, "pickRate": {"$gte": 1}, "patch": patch}
        else:
            myquery = {"rank": rank, "role": role,
                       "pickRate": {"$gte": 1}, "patch": patch}

        myquery = {**myquery, **{"mode": f"{mode}Conq"}}
        print(myquery)
        print(mycol.count_documents(myquery))
        for x in mycol.find(myquery, {"_id": 0}).limit(25):
            dict_god = x["god"]
            dict_role = x["role"]
            if not retData[dict_god]:
                retData[dict_god] = {dict_role: x}
            else:
                retData[dict_god][dict_role] = x

    elif tableType == "Combat":
        mycol = mydb["Combat List"]
        rank = rank.replace("_", " ")
        if "All" in role:
            myquery = {"rank": rank, "pickRate": {"$gte": 1}, "patch": patch}
        else:
            myquery = {"rank": rank, "role": role,
                       "pickRate": {"$gte": 1}, "patch": patch}

        myquery = {**myquery, **{"mode": f"{mode}Conq"}}

        for x in mycol.find(myquery, {"_id": 0}):
            dict_god = x["god"]
            dict_role = x["role"]
            if not retData[dict_god]:
                retData[dict_god] = {dict_role: x}
            else:
                retData[dict_god][dict_role] = x

    elif tableType == "Objective":
        mycol = mydb["Objective List"]
        rank = rank.replace("_", " ")
        if "All" in role:
            myquery = {"rank": rank, "pickRate": {"$gte": 1}}
        else:
            myquery = {"rank": rank, "role": role, "pickRate": {"$gte": 1}}

        myquery = {**myquery, **{"mode": f"{mode}Conq"}}
        for x in mycol.find(myquery, {"_id": 0}):
            dict_god = x["god"]
            dict_role = x["role"]
            if not retData[dict_god]:
                retData[dict_god] = {dict_role: x}
            else:
                retData[dict_god][dict_role] = x

    elif tableType == "Duos":
        role_one, role_two = role.split("_")
        retData = get_lanes(role_one, role_two)

    return retData


@app.route("/api/getitemdata/<item>")
def get_item_data(item):
    return anlz.get_item_data(client, item)


@app.route('/api/<god>/items/<role>/<rank>/<patch>/<mode>')
def get_all_items(god, role, rank, patch, mode):
    items = anlz.get_all_builds(client, god, role, patch, mode, rank)
    return items


@app.route('/api/<god>/m/<role>/<rank>/<patch>/<mode>')
def get_all_matchups(god, role, rank, patch, mode):
    avg_dmg_dict = anlz.get_matchups_stats(client, god, role, patch, mode, rank)
    return avg_dmg_dict


@app.route("/api/getmatch/<matchID>")
def get_match(matchID):
    queue_type = "Ranked"
    mydb = client["Matches"]
    mycol = mydb["9.2 Matches"]
    match = {}
    matchID = int(matchID)
    myquery = {
        '$search': {
            'index': 'findMatch',
            'text': {
                'query': f'{matchID}',
                'path': {
                    'wildcard': '*'
                }
            }
        }
    }
    for x in mycol.aggregate([myquery]):
        print(x)
        match = x
    
    if len(match.keys()) == 0:
        mydb = client["CasualMatches"]
        mycol = mydb["9.2 Matches"]
        for x in mycol.aggregate([myquery]):
            print(x)
            match = x

    print(match)
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

            match[key] = {**match[key], 
                          **{"godBuild": anlz.get_build_stats(client, build)},
                          **{"godStats": anlz.get_god_stats(client, match[key]["godName"], match[key]["Final_Match_Level"])},
                          }

    retData = {
        **match, 
        **anlz.get_carry_score(match),
        **{"mode": queue_type},
        **{"carryScores": get_carry_score_averages()}
        }
    print(retData)
    return retData


@app.route('/api/<god>/buildpath/<role>/<rank>/<patch>/<mode>')
def get_build_path(god, role, rank, patch, mode):
    builds = anlz.get_build_path(client, god, role, patch, mode, rank)
    return builds


@app.route("/api/getplayergeneral/<playername>")
def get_player_general(playername):
    mydb = client["Players"]
    mycol = mydb["Player Basic"]
    if playername == "undefined":
        return {}

    if fh.validate_player(client, playername):
        for x in mycol.find({"NameTag": {"$regex": f"{playername}", "$options": "i"}}, {"_id": 0}):
            data = x
    else:
        with open("cred.txt", "r") as creds:
            lines = creds.readlines()
            smite_api = SmiteAPI(devId=lines[0].strip(
            ), authKey=lines[1].strip(), responseFormat=pyrez.Format.JSON)
            data = anlzpy.get_player_basic(smite_api.getPlayer(playername))
            mycol.insert_one(data)
    return anlzpy.create_player_return_dict(data)


@app.route("/api/getplayergods/<playername>/<mode>")
def get_player_god_info(playername, mode):
    mydb = client["Players"]
    mycol = mydb["Player Gods"]
    if playername == "undefined":
        return {}

    if fh.validate_gods(client, playername, mode):
        for x in mycol.find({"mode": f"{mode}Conq", "NameTag": {"$regex": f"{playername}", "$options": "i"}}, {"_id": 0}):
            data = x
    else:
        with open("cred.txt", "r") as creds:
            lines = creds.readlines()
            smite_api = SmiteAPI(devId=lines[0].strip(
            ), authKey=lines[1].strip(), responseFormat=pyrez.Format.JSON)
            data = anlzpy.create_player_god_dict(smite_api.getQueueStats(
                playername, fh.convert_mode(mode)), playername, mode)
            mycol.insert_one(data)
            return json.loads(json_util.dumps(data))
    # del data["_id"]
    return {**data, **anlzpy.get_player_winrate(data)}
    # with open("cred.txt", "r") as creds:
    #         lines = creds.readlines()
    #         smite_api = SmiteAPI(devId=lines[0].strip(), authKey=lines[1].strip(), responseFormat=pyrez.Format.JSON)
    # playerId = smite_api.getPlayerId(playername)

    # print(smite_api.getQueueStats(playerId, 451))
    return {}


@app.route("/api/getplayermatch/<playername>/<mode>/<patch>")
def get_player_match_info(playername, mode, patch):
    if playername == "undefined":
        return {}
    return json.loads(json_util.dumps(anlzpy.find_match_history(client, playername, mode, patch)))


@app.route("/api/getplayerspecificgod/<playername>/<god>/<role>/<mode>/<patch>")
def get_player_specific_god(playername, god, role, mode, patch):
    return anlzpy.get_player_god_stats(client, playername, god, role, mode, patch)


@app.route('/api/playermatchups/<playername>/<god>/<role>/<patch>/<mode>')
def get_god_matchups_by_player(playername, god, role, patch, mode):
    matchups = anlz.get_worst_matchups(
        client, god, role, patch, mode, player=playername)
    del matchups["wins"], matchups["games"], matchups["winRate"]
    return matchups


@app.route('/api/getdmgcalc/', methods=["GET", "POST"])
def get_dmg_calc():
    ret_data = {}
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        if data["god"].lower() in [god.lower() for god in godsDict]:
            ret_data = calc_combo_damage_raw(
                client, data["god"], data["levels"], data["power"], None)

    return ret_data


@app.route('/api/getbuildstats/', methods=["GET", "POST"])
def get_build_calc():
    ret_data = {}
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        build = []
        for key in data:
            if key != "god":
                build.append(data[key])
            else:
                ret_data["base"] = anlz.get_god_stats(client, data[key], 20)
        build_stats = anlz.get_build_stats(client, build)
        ret_data["build"] = build_stats
    return ret_data
