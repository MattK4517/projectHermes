from collections import _OrderedDictItemsView, OrderedDict
from operator import getitem
from re import match
import pyrez
from pyrez.api import SmiteAPI
import analyze as anlz
import pymongo
from datetime import datetime
from constants import roles, patch
from data_pull_insert import run_pull, get_new_id
from data_pull_formatting_rewrite import run_format
import pandas as pd
client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:9gR7C1aDKclng4jA@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

if __name__ == "__main__":
    god = "Achilles"
    mydb = client["single_matchups"]
    mycol = mydb[god]
    match_ids = []
    for x in mycol.find({"enemy": "Anubis", "patch": "8.10", "role_played": "Solo"}):
        match_ids.append(x["matchId"])

    builds = []
    itemsdb = client["single_items"]
    itemscol = itemsdb[god]
    games = 0
    for x in itemscol.aggregate([
        {
                "$match": {"matchId": {"$in": match_ids}},
        },
            # {
            #     "$group": {
            #         "_id": {
            #             "slot1": f"${god}.slot1",
            #             "slot2": f"${god}.slot2",
            #             "slot3": f"${god}.slot3",
            #             "win_status": "$win_status",
            #         },
            #         "count": {"$sum": 1},
            #     }
            # },
            # {"$sort": {"count": 1}},
        ]
    ):
        builds.append(x)
        # games += x["count"]
        # if "{},{},{}".format(x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"]) not in builds.keys():
        #     builds["{},{},{}".format(x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"])] = { 
        #         "slot1": x["_id"]["slot1"],
        #         "slot2": x["_id"]["slot2"],
        #         "slot3": x["_id"]["slot3"],
        #         "wins": 0,
        #         "losses": 0,
        #         }
        # if x["_id"]["win_status"] == "Winner":
        #     builds["{},{},{}".format(x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"])]["wins"] += x["count"]
        # elif x["_id"]["win_status"] == "Loser":
        #     builds["{},{},{}".format(x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"])]["losses"] += x["count"]


    # print(builds)
    # print(games)
    # builds = []
    # for matchId in match_ids:
    #     for x in itemscol.find({"matchId": matchId}, {"_id": 0, "Achilles": 1, "win_status": 1}):
    #         builds.append({**x["Achilles"], **{"win_status": x["win_status"]}})

    # print(builds)
    print(anlz.get_top_builds(client, "Achilles", "Solo", "8.10", data=builds))
                

## 5 looops 2507 matches in 2:23:46
## 1 large loop