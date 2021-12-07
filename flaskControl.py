from datetime import datetime
import analyze as anlz
import pandas as pd
from constants import godsDict, roles
from flask import Flask, render_template, request
# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address
from main import client
from collections import OrderedDict
from operator import getitem
from duo_tier_list import get_lanes
import pyrez
from pyrez.api import SmiteAPI

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

@app.route('/main/<god>/<role>/<rank>/<patch>', methods=["GET", "POST"])
def get_god_data(god, role, rank, patch):
        newgod = god.replace("_", " ")
        winrate = anlz.get_winrate(client, god, role, patch, rank)
        pbrate = anlz.get_pb_rate(client, god, rank, role, patch)
        return {**{
                "url": anlz.get_url(newgod), 
                "tier": anlz.get_tier(winrate["win_rate"], pbrate["pickRate"], pbrate["banRate"]),
                },
                **pbrate,
                **winrate
                 }

@app.route('/<god>/matchups', methods=["GET"])
def get_god_matchups(god):
        return anlz.get_worst_matchups(client, god , "Solo")

@app.route('/<god>/<role>/<rank>/<patch>/<matchup>')
@app.route('/<god>/<role>/<rank>/<patch>', methods=["GET", "POST"])
def get_god_data_role(god, role, rank, patch, matchup="None"):
        newgod = god.replace("_", " ")
        if matchup != "None":
                return anlz.get_specific_build(client, god, role, patch, matchup, rank)
        elif "All" in rank and matchup == "None":
                build = anlz.get_top_builds(client, god, role, patch)
        elif matchup =="None": 
                build = anlz.get_top_builds(client, god, role, patch, rank)

        # pb_rate = anlz.get_pb_rate(client, newgod, rank, role, patch)
        image = {"url": anlz.get_url(newgod)}
        data_dict = {**build, **image}
        return data_dict
        
@app.route('/<god>/matchups/<role>/<rank>/<patch>')
def get_god_matchups_by_rank(god, role, rank, patch):
        newgod = god.replace("_", " ")
        if "All" in rank and patch == "current":
                matchups = anlz.get_worst_matchups(client, god, role, patch)
        else: 
                matchups = anlz.get_worst_matchups(client, god, role, patch, rank)

        del matchups["wins"], matchups["games"], matchups["winRate"]
        return matchups

@app.route('/<god>/abilities')
def get_god_abilities(god):
        return anlz.get_abilities(client, god)

@app.route("/gettierlist/<rank>/<role>/<tableType>", methods=["GET", "POST"])
def get_tier_list(rank, role, tableType):
        retData = {god: {} for god in godsDict}
        mydb = client["Tier_list"]
        if tableType == "Regular":
                mycol = mydb["Regular List"]
                rank = rank.replace("_", " ")
                if "All" in role:
                        myquery = {"rank": rank, "pickRate": {"$gte": 1}}
                else:
                        myquery = {"rank": rank, "role": role, "pickRate": {"$gte": 1}}
                
                for x in mycol.find(myquery, {"_id": 0}):
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
                        myquery = {"rank": rank, "pickRate": {"$gte": 1}}
                else:
                        myquery = {"rank": rank, "role": role, "pickRate": {"$gte": 1}}
                
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
                
                for x in mycol.find(myquery, {"_id": 0}):
                        dict_god = x["god"]
                        dict_role = x["role"]
                        if not retData[dict_god]:
                                retData[dict_god] = {dict_role: x}
                        else:
                                retData[dict_god][dict_role] = x
        
        elif tableType == "Duos":
                retData = get_lanes()
        return retData


@app.route("/getitemdata/<item>")
def get_item_data(item):
        return anlz.get_item_data(client, item)
        
@app.route('/<god>/items/<role>/<rank>/<patch>')
def get_all_items(god, role, rank, patch):
        items = anlz.get_all_builds(client, god, role, patch, rank)
        return items

@app.route('/<god>/m/<role>/<rank>/<patch>')
def get_all_matchups(god, role, rank, patch):
    mydb = client["single_match_stats"]
    mycol = mydb[god]
    matchupsdb = client["single_matchups"]
    matchupscol = matchupsdb[god]
    if "All" in rank:
        myquery = {"role": role, "patch": patch}
    else:
        myquery = {"role": role, "patch": patch, "rank": rank}


    avg_dmg_dict = {}
    total_games = mycol.count_documents(myquery)
    for x in mycol.aggregate([
        {
            "$match": myquery
        },
        {
            "$group": {
                "_id": "$enemy",
                "avg_dmg_diff": { "$avg": "$damage_player"},
                "avg_kill_diff": { "$avg": "$kills"},
                "avg_gold_diff": { "$avg": "$gold"},
                "timesPlayed": {"$sum": 1},
            }
        }
    ]):
        # wins = matchupscol.count_documents({**myquery, **{"enemy": x["_id"], "win_status": "Winner"}})
        if "All" in rank:
                wins = matchupscol.count_documents({"enemy": x["_id"], f"{god}": "Winner", "patch": patch, "role_played": role})
        else:
                wins = matchupscol.count_documents({"enemy": x["_id"], f"{god}": "Winner", "patch": patch, "rank": rank, "role_played": role})
        if x["timesPlayed"] >= .01 * total_games:
            avg_dmg_dict[x["_id"]] = {"dmg": x["avg_dmg_diff"], "kills": x["avg_kill_diff"], "gold": x["avg_gold_diff"], "wr": round(wins/x["timesPlayed"]*100, 2)}
    
    myquery = {**myquery, **{"enemy": god}}
    for god in avg_dmg_dict:
        mycol = mydb[god]
        for x in mycol.aggregate([
            {
                "$match": myquery
            },
            {
                "$group": {
                    "_id": "$enemy",
                    "avg_dmg_diff": { "$avg": "$damage_player"},
                    "avg_kill_diff": { "$avg": "$kills"},
                    "avg_gold_diff": { "$avg": "$gold"},
                }
            },
        ]):
            avg_dmg_dict[god]["god"] = god
            avg_dmg_dict[god]["dmg"] -= x["avg_dmg_diff"]
            avg_dmg_dict[god]["kills"] -= x["avg_kill_diff"]
            avg_dmg_dict[god]["gold"] -= x["avg_gold_diff"]
        
    return avg_dmg_dict


@app.route("/getmatch/<matchID>")
def get_match(matchID):
        mydb = client["Matches"]
        mycol = mydb["8.8 Matches"]
        match = ""
        matchID = int(matchID)
        if mycol.count_documents({"MatchId": matchID}) == 0:
                mycol = mydb["8.9 Matches"]
        for x in mycol.find({"MatchId": matchID}, {'_id': 0}):
                match = x


        if match["Entry_Datetime"] < "9/25/2021":
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

@app.route('/<god>/buildpath/<role>/<rank>/<patch>')
def get_build_path(god, role, rank, patch):
    mydb = client["single_items"]
    mycol = mydb[god]
    index = 0
    games = 0
    builds = {}
    if "All" not in rank:
        myquery = {"role_played": role, "patch": patch, "rank": rank}
    else:
        myquery = {"role_played": role, "patch": patch}
    
    
    for x in mycol.aggregate(
        [
            {
                "$match": myquery,
            },
            {
                "$group": {
                    "_id": {
                        "slot1": f"${god}.slot1",
                        "slot2": f"${god}.slot2",
                        "slot3": f"${god}.slot3",
                        "win_status": "$win_status",
                    },
                    "count": {"$sum": 1},
                }
            },
            {"$sort": {"count": 1}},
        ]
    ):
        games += x["count"]
        if "{},{},{}".format(x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"]) not in builds.keys():
            builds["{},{},{}".format(x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"])] = { 
                "slot1": x["_id"]["slot1"],
                "slot2": x["_id"]["slot2"],
                "slot3": x["_id"]["slot3"],
                "wins": 0,
                "losses": 0,
                }
        if x["_id"]["win_status"] == "Winner":
            builds["{},{},{}".format(x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"])]["wins"] += x["count"]
        elif x["_id"]["win_status"] == "Loser":
            builds["{},{},{}".format(x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"])]["losses"] += x["count"]
        index += 1
    top_five = {}
    for x in list(builds)[-10:]:
            for key in builds[x].keys():
                    if "slot" in key:
                            builds[x][key] = anlz.get_item_data(client, builds[x][key])
            top_five[x] = builds[x]

    test_sort = OrderedDict(sorted(top_five.items(),
            key = lambda x: getitem(x[1], "wins")))
            
    builds = dict(test_sort)

    return builds


@app.route("/getplayer/<playername>")
def get_player_info(playername):
        return anlz.find_match_history(client, playername)
        
@app.route("/getplayergeneral/<playername>")
def get_player_general(playername):
        # with open("cred.txt", "r") as creds:
        #         lines = creds.readlines()
        #         smite_api = SmiteAPI(devId=lines[0].strip(), authKey=lines[1].strip(), responseFormat=pyrez.Format.JSON)
        return anlz.create_player_return_dict({
  "ActivePlayerId": 6935006,
  "Avatar_URL": "http://webcdn.hirezstudios.com/smite-app/wp-content/uploads/2015/06/Icon_Player_Ra_Alienware.png",
  "Created_Datetime": "6/4/2015 2:41:37 PM",
  "HoursPlayed": 2232,
  "Id": 6935006,
  "Last_Login_Datetime": "11/25/2021 11:57:29 AM",
  "Leaves": 90,
  "Level": 151,
  "Losses": 3134,
  "MasteryLevel": 114,
  "MergedPlayers": None,
  "MinutesPlayed": 133958,
  "Name": "Jurse",
  "Personal_Status_Message": "mm is sh!t,community is worse",
  "Platform": "Steam",
  "Rank_Stat_Conquest": 1963.83472,
  "Rank_Stat_Conquest_Controller": 1500,
  "Rank_Stat_Duel": 2831.5144,
  "Rank_Stat_Duel_Controller": 1500,
  "Rank_Stat_Joust": 1903.49353,
  "Rank_Stat_Joust_Controller": 1500,
  "RankedConquest": {
    "Leaves": 0,
    "Losses": 14,
    "Name": "League",
    "Points": 0,
    "PrevRank": 0,
    "Rank": 0,
    "Rank_Stat": 1963.83472,
    "Rank_Stat_Conquest": None,
    "Rank_Stat_Joust": None,
    "Rank_Variance": 24,
    "Round": 0,
    "Season": 8,
    "Tier": 22,
    "Trend": 0,
    "Wins": 8,
    "player_id": None,
    "ret_msg": None
  },
  "RankedConquestController": {
    "Leaves": 0,
    "Losses": 0,
    "Name": "League Controller",
    "Points": 0,
    "PrevRank": 0,
    "Rank": 0,
    "Rank_Stat": 1500,
    "Rank_Stat_Conquest": None,
    "Rank_Stat_Joust": None,
    "Rank_Variance": 21,
    "Round": 0,
    "Season": 0,
    "Tier": 0,
    "Trend": 0,
    "Wins": 0,
    "player_id": None,
    "ret_msg": None
  },
  "RankedDuel": {
    "Leaves": 0,
    "Losses": 6,
    "Name": "Duel",
    "Points": 113,
    "PrevRank": 66,
    "Rank": 66,
    "Rank_Stat": 2831.5144,
    "Rank_Stat_Conquest": None,
    "Rank_Stat_Joust": None,
    "Rank_Variance": 24,
    "Round": 0,
    "Season": 8,
    "Tier": 26,
    "Trend": 0,
    "Wins": 18,
    "player_id": None,
    "ret_msg": None
  },
  "RankedDuelController": {
    "Leaves": 0,
    "Losses": 0,
    "Name": "Duel Controller",
    "Points": 0,
    "PrevRank": 0,
    "Rank": 0,
    "Rank_Stat": 1500,
    "Rank_Stat_Conquest": None,
    "Rank_Stat_Joust": None,
    "Rank_Variance": 21,
    "Round": 0,
    "Season": 0,
    "Tier": 0,
    "Trend": 0,
    "Wins": 0,
    "player_id": None,
    "ret_msg": None
  },
  "RankedJoust": {
    "Leaves": 0,
    "Losses": 0,
    "Name": "Joust",
    "Points": 95,
    "PrevRank": 12,
    "Rank": 12,
    "Rank_Stat": 1903.49353,
    "Rank_Stat_Conquest": None,
    "Rank_Stat_Joust": None,
    "Rank_Variance": 24,
    "Round": 0,
    "Season": 8,
    "Tier": 19,
    "Trend": 0,
    "Wins": 1,
    "player_id": None,
    "ret_msg": None
  },
  "RankedJoustController": {
    "Leaves": 0,
    "Losses": 0,
    "Name": "Joust Controller",
    "Points": 0,
    "PrevRank": 0,
    "Rank": 0,
    "Rank_Stat": 1500,
    "Rank_Stat_Conquest": None,
    "Rank_Stat_Joust": None,
    "Rank_Variance": 21,
    "Round": 0,
    "Season": 0,
    "Tier": 0,
    "Trend": 0,
    "Wins": 0,
    "player_id": None,
    "ret_msg": None
  },
  "Region": "Europe",
  "TeamId": 0,
  "Team_Name": "",
  "Tier_Conquest": 22,
  "Tier_Duel": 26,
  "Tier_Joust": 19,
  "Total_Achievements": 167,
  "Total_Worshippers": 78765,
  "Wins": 3935,
  "hz_gamer_tag": None,
  "hz_player_name": "jurse",
  "ret_msg": None
})
 
@app.route("/getplayergods/<playername>")
def get_player_god_info(playername):
        # with open("cred.txt", "r") as creds:
        #         lines = creds.readlines()
        #         smite_api = SmiteAPI(devId=lines[0].strip(), authKey=lines[1].strip(), responseFormat=pyrez.Format.JSON)
        # playerId = smite_api.getPlayerId(playername)

        # print(smite_api.getQueueStats(playerId, 451))
        return {}
# make a route for every god, in the
# temp idea for routing
# for each god
# @app.route("/godname"):
# def godName():
#     collect god info
#     render_template("godbuild.html", other params)