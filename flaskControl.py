
from generate_report import Report
from carry_score_analytics import get_carry_score_averages
from damage_calculator import calc_dps, calc_combo_damage_raw
from bson import json_util
import json
import flaskHelper as fh
from pyrez.api import SmiteAPI
import pyrez
from duo_tier_list import get_lanes
from operator import getitem
from collections import OrderedDict
from main import client
from flask import Flask, render_template, request
from constants import godsDict, roles, id_dict, Tier_Three_items, Starter_items
import pandas as pd
import analyze_players as anlzpy
import analyze as anlz
import re
from re import L, M
from queue import Empty
from datetime import datetime
# from sklearn.linear_model import GammaRegressor
# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address


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


@app.route('/api/main/<god>/<role>/<rank>/<patch>/<queue_type>/<mode>/<matchup>', methods=["GET", "POST"])
@app.route('/api/main/<god>/<role>/<rank>/<patch>/<queue_type>/<mode>', methods=["GET", "POST"])
def get_god_data(god, role, rank, patch, queue_type, mode, matchup="None"):
    newgod = god.replace("_", " ")
    print(role)
    winrate = anlz.get_winrate(
        client, god, role, patch, queue_type, rank, matchup=matchup, mode=mode)
    pbrate = anlz.get_pb_rate(client, god, rank, role,
                              patch, queue_type=queue_type, mode=mode)
    print(winrate, pbrate)
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


@app.route('/api/<god>/<role>/<rank>/<patch>/<queue_type>/<mode>/<matchup>')
@app.route('/api/<god>/<role>/<rank>/<patch>/<queue_type>/<mode>', methods=["GET", "POST"])
def get_god_data_role(god, role, rank, patch, queue_type, mode, matchup="None"):
    newgod = god.replace("_", " ")
    if matchup != "None":
        return anlz.get_specific_build(client, god, role, patch, matchup, rank, queue_type, mode)
        build = anlz.get_top_builds(
            client, god, role, patch, queue_type, mode=mode)
    elif matchup == "None":
        build = anlz.get_top_builds(
            client, god, role, patch, queue_type, rank, mode=mode)

    image = {"url": anlz.get_url(newgod)}
    data_dict = {**build, **image}
    return data_dict


@app.route('/api/<god>/matchups/<role>/<rank>/<patch>/<queue_type>/<mode>')
def get_god_matchups_by_rank(god, role, rank, patch, queue_type, mode):
    if "All" in rank and patch == "current":
        matchups = anlz.get_worst_matchups(
            client, god, role, patch, queue_type=queue_type, mode=mode)
    else:
        matchups = anlz.get_worst_matchups(
            client, god, role, patch, queue_type=queue_type, rank=rank, mode=mode)

    del matchups["wins"], matchups["games"], matchups["winRate"]
    return matchups


@app.route('/api/<god>/abilities')
def get_god_abilities(god):
    return anlz.get_abilities(client, god)


@app.route("/api/gettierlist/<rank>/<role>/<tableType>/<queue_type>/<patch>/<mode>", methods=["GET", "POST"])
def get_tier_list(rank, role, tableType, queue_type, patch, mode):
    print(rank, role, tableType, queue_type, patch, mode)
    rank = rank.replace("_", " ")
    retData = {god: {} for god in godsDict}
    mydb = client["Tier_list"]
    if not tableType == "Duos":
        mycol = mydb["Combined List"]
        rank = rank.replace("_", " ")
        if "All" in role:
            myquery = {"rank": rank, "pickRate": {"$gte": 1}, "patch": patch}
        else:
            myquery = {"rank": rank, "role": role,
                       "pickRate": {"$gte": 1}, "patch": patch}

        myquery = {**myquery, **{"queue_type": queue_type, "mode": mode}}

        if mode == "Joust":
            myquery["pickRate"] = {"$gte": 1.5}

        elif mode == "Duel":
            myquery["pickRate"] = {"$gte": 1}
        # print(myquery, mycol.count_documents(myquery))

        my_filter = fh.get_filter(tableType)
        # print(my_filter)
        for x in mycol.find(myquery, my_filter):
            dict_god = x["god"]
            dict_role = x["role"]
            if not retData[dict_god]:
                retData[dict_god] = {dict_role: x}
            else:
                retData[dict_god][dict_role] = x

    elif tableType == "Duos":
        role_one, role_two = role.split("_")
        retData = get_lanes(role_one, role_two, patch)

    return json.loads(json_util.dumps(retData))


@app.route("/api/getitemdata/<item>")
def get_item_data(item):
    return anlz.get_item_data(client, item)


@app.route('/api/<god>/items/<role>/<rank>/<patch>/<queue_type>/<mode>')
def get_all_items(god, role, rank, patch, queue_type, mode):
    items = anlz.get_all_builds(
        client, god, role, patch, queue_type, rank, mode)
    return items


@app.route('/api/<god>/m/<role>/<rank>/<patch>/<queue_type>/<mode>')
def get_all_matchups(god, role, rank, patch, queue_type, mode):
    avg_dmg_dict = anlz.get_matchups_stats(
        client, god, role, patch, queue_type, rank, mode)
    return avg_dmg_dict


@app.route("/api/getmatch/<matchID>")
def get_match(matchID):
    queue_type = "Ranked"
    mydb = client["Matches"]
    mode = "Conquest"
    mycol = mydb["9.4 Matches"]
    match = {}
    matchID = int(matchID)
    modes = ["Joust", "Duel"]
    index = 0
    count = mycol.find({"MatchId": matchID}, {"MatchId": 1}).count()
    print(count)
    while count == 0:
        mycol = mydb[f"9.4 {modes[index]} Matches"]
        count = mycol.find({"MatchId": matchID}, {"MatchId": 1}).count()
        mode = modes[index]
        index += 1

    for x in mycol.find({"MatchId": matchID}, {"_id": 0}):
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

            build_data = anlz.get_build_stats(client, build)
            match[key] = {**match[key],
                          **{"godBuild": [build_data[slot] for slot in build_data]},
                          **{"godStats": anlz.get_god_stats(client, match[key]["godName"], match[key]["Final_Match_Level"])},
                          }

    retData = {
        **match,
        **anlz.get_carry_score(match),
        **{"Queue_Type": queue_type},
        **{"Mode": mode},
        **{"carryScores": get_carry_score_averages()}
    }
    print(retData)
    return json.loads(json_util.dumps(retData))


@app.route('/api/<god>/buildpath/<role>/<rank>/<patch>/<queue_type>/<mode>')
def get_build_path(god, role, rank, patch, queue_type, mode):
    builds = anlz.get_build_path(
        client, god, role, patch, queue_type, rank, mode)
    return builds


@app.route("/api/getplayergeneral/<playername>")
def get_player_general(playername):
    mydb = client["Players"]
    mycol = mydb["Player Basic"]
    if playername == "undefined":
        return {}

    # TODO find a way to only pull from database weekly
    if fh.validate_player(client, playername):
        for x in mycol.find({"NameTag": {"$regex": f"{playername}", "$options": "i"}}, {"_id": 0}):
            data = x
    else:
        with open("cred.txt", "r") as creds:
            lines = creds.readlines()
            smite_api = SmiteAPI(devId=lines[0].strip(
            ), authKey=lines[1].strip(), responseFormat=pyrez.Format.JSON)
            player_id = fh.get_player_id(smite_api, playername)
            test_data = smite_api.getPlayer(player_id)
            data = anlzpy.get_player_basic(test_data)
            mycol.insert_one(data)
    # anlzpy.create_player_return_dict(data)
    return json.loads(json_util.dumps(data))


@app.route("/api/getplayergods/<playername>/<queue_type>/<mode>/<input_type>")
# @app.route("/api/getplayergods/<playername>/<queue_type>/<mode>/")
def get_player_god_info(playername, queue_type, mode, input_type="KBM"):
    mydb = client["Players"]
    mycol = mydb["Player Gods"]
    data = {}
    if playername == "undefined":
        return {}

    # if fh.validate_gods(client, playername, queue_type, mode, input_type):
    #     for x in mycol.find({"queue_type": queue_type, "mode": mode, "input_type": input_type, "NameTag": {"$regex": f"{playername}", "$options": "i"}}, {"_id": 0}):
    #         data = x
    # else:
    with open("cred.txt", "r") as creds:
        lines = creds.readlines()

        smite_api = SmiteAPI(devId=lines[0].strip(
        ), authKey=lines[1].strip(), responseFormat=pyrez.Format.JSON)
        player_id = fh.get_player_id(smite_api, playername)
        queue_id = fh.get_queue_id(queue_type, mode, input_type)
        print(queue_id)
        data = anlzpy.create_player_god_dict(smite_api.getQueueStats(
            player_id, queue_id), playername, queue_type, mode, input_type)
        mycol.insert_one(data)
        return json.loads(json_util.dumps({**data, **anlzpy.get_player_winrate(data)}))

    if data == {}:
        return {}
    else:
        return {**data, **anlzpy.get_player_winrate(data)}


@app.route("/api/getplayermatch/<playername>/<queue_type>/<patch>/<mode>")
def get_player_match_info(playername, queue_type, patch, mode):
    if playername == "undefined":
        return {}
    return json.loads(json_util.dumps(anlzpy.find_match_history(client, playername, queue_type, patch, mode)))


@app.route("/api/getplayerspecificgod/<playername>/<god>/<role>/<queue_type>/<patch>")
def get_player_specific_god(playername, god, role, queue_type, patch):
    return anlzpy.get_player_god_stats(client, playername, god, role, queue_type, patch)


@app.route('/api/playermatchups/<playername>/<god>/<role>/<patch>/<queue_type>/<mode>')
def get_god_matchups_by_player(playername, god, role, patch, queue_type, mode):
    matchups = anlz.get_worst_matchups(
        client, god, role, patch, queue_type, mode=mode,  player=playername)
    del matchups["wins"], matchups["games"], matchups["winRate"]
    return matchups


@app.route('/api/playeraccounts/<playername>')
def get_player_accounts(playername):
    return anlzpy.query_player_accounts(playername)


@app.route('/api/getdmgcalc/', methods=["GET", "POST"])
def get_dmg_calc():
    ret_data = {}
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        if data["god"].lower() in [god.lower() for god in godsDict]:
            ret_data = calc_combo_damage_raw(
                client, data["god"], data["levels"], data["build"], "Odin", [], 20, 20)

    return ret_data


@app.route('/api/getautodmgcalc/', methods=["GET", "POST"])
def get_auto_dmg_calc():
    ret_data = {}
    if request.method == 'POST':
        data = request.get_json()
        if data["god"].lower() in [god.lower() for god in godsDict]:
            ret_data = calc_dps(
                client, data["god"], data["build"], "Odin", [], 20, 20)

    return ret_data


@app.route('/api/getbuildstats/', methods=["GET", "POST"])
def get_build_calc():
    ret_data = {}
    if request.method == 'POST':
        data = request.get_json()
        build = data["build"]
        ret_data["base"] = anlz.get_god_stats(client, data["god"], 20)

        build_stats = anlz.get_build_stats(client, build)
        ret_data["build"] = build_stats
    return ret_data


@app.route('/api/skins/<god>/<role>/<rank>/<patch>/<queue_type>/<mode>/<matchup>', methods=["GET", "POST"])
@app.route('/api/skins/<god>/<role>/<rank>/<patch>/<queue_type>/<mode>', methods=["GET", "POST"])
def get_god_skins(god, role, rank, patch, queue_type, mode, matchup=None):
    ret_data = {"skins": []}
    mydb = client["Skins"]
    mycol = mydb[god]
    if mycol.count_documents({}) == 0:
        with open("cred.txt", "r") as creds:
            lines = creds.readlines()
            smite_api = SmiteAPI(devId=lines[0].strip(
            ), authKey=lines[1].strip(), responseFormat=pyrez.Format.JSON)

            god_id = id_dict[god]
            data = smite_api.getGodSkins(god_id)

            skin_stats = anlz.get_skin_stats(
                god, role, patch, rank=rank, queue_type=queue_type, mode=mode, matchup=matchup)

            for skin in data:
                try:
                    skin_name = skin["skin_name"]
                    if skin["skin_name"] == f"Standard {god}":
                        skin_name = god
                    temp_dict = {
                        "godSkin_URL": skin["godSkin_URL"],
                        "obtainability": skin["obtainability"],
                        "price_favor": skin["price_favor"],
                        "price_gems": skin["price_gems"],
                        "skin_name": skin["skin_name"],
                        "games": skin_stats[skin_name]["games"],
                        "wins": skin_stats[skin_name]["wins"],
                        "winRate": skin_stats[skin_name]["win_rate"],
                    }
                    ret_data["skins"].append(temp_dict)
                except KeyError:
                    temp_dict = {
                        "godSkin_URL": skin["godSkin_URL"],
                        "obtainability": skin["obtainability"],
                        "price_favor": skin["price_favor"],
                        "price_gems": skin["price_gems"],
                        "skin_name": skin["skin_name"],
                        "games": 0,
                        "wins": 0,
                        "winRate": 0,
                    }
                    ret_data["skins"].append(temp_dict)
                mycol.insert_one({
                    "godSkin_URL": skin["godSkin_URL"],
                    "obtainability": skin["obtainability"],
                    "price_favor": skin["price_favor"],
                    "price_gems": skin["price_gems"],
                    "skin_name": skin["skin_name"]})
    else:
        skin_stats = anlz.get_skin_stats(
            god, role, patch, rank=rank, queue_type=queue_type, mode=mode, matchup=matchup)
        for x in mycol.find({}, {"_id": 0}):
            if x["skin_name"] == f"Standard {god}":
                x["skin_name"] = god
            if x["skin_name"] in skin_stats:
                ret_data["skins"].append({**x, **{"games": skin_stats[x['skin_name']]["games"],
                                                  "wins": skin_stats[x['skin_name']]["wins"],
                                                  "winRate": skin_stats[x['skin_name']]["win_rate"]}})
    return ret_data


@app.route('/api/skinstats/<god>/<skin>/<role>/<rank>/<patch>/<queue_type>/<mode>', methods=["GET", "POST"])
def get_single_skin(god, skin, role, rank, patch, queue_type, mode):
    print(god, skin, role, rank, patch, queue_type, mode)
    # TODO add patch back in
    skin_stats = anlz.get_single_skin_stats(
        god, skin, role, patch, rank=rank, queue_type=queue_type, mode=mode)

    return skin_stats


@app.route('/api/generatereport', methods=["GET", "POST"])
def create_report():
    if request.method == "POST":
        report = Report()
        report.set_params(request.get_json())
        report.create_report()
        report.upload_report()
        # print("REPORT", report.params)
    return ""


@app.route('/api/goditems/<god>')
def get_god_items(god):
    mydb = client["Item_Data"]
    print("\n\n\n GETTING HERE \n\n\n")
    items = Tier_Three_items + Starter_items
    ret_data = {"data": []}
    god_class = fh.get_class(god)
    for item in items:
        mycol = mydb[item]
        for x in mycol.find({"ActiveFlag": "y"}, {"DeviceName": 1, "RestrictedRoles": 1, "_id": 0}):
            if god_class not in x["RestrictedRoles"]:
                ret_data["data"].append(x["DeviceName"])

    ret_data["data"].sort()
    return ret_data
