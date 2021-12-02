from collections import _OrderedDictItemsView, OrderedDict
from operator import getitem
from re import match
import pyrez
from pyrez.api import SmiteAPI
import analyze as anlz
import pymongo
from datetime import datetime
from constants import roles, patch, godsDict
from data_pull_insert import run_pull, get_new_id
from data_pull_formatting_rewrite import run_format
import pandas as pd
client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:9gR7C1aDKclng4jA@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

if __name__ == "__main__":
    dFilter = {**{f"player{i}.Region": 1 for i in range(10)}, **{f"player{i}.godName": 1 for i in range(10)}}
    mydb = client["Matches"]
    mycol = mydb["8.9 Matches"]
    match_ids = []
    for x in mycol.find({}, dFilter):
        for player in x:
            if "player" in player:
                if x[player]["Region"] == "EU":
                    godsDict[x[player]["godName"]] += 1
    
    


    # print(builds)
    # print(games)
    # builds = []
    # for matchId in match_ids:
    #     for x in itemscol.find({"matchId": matchId}, {"_id": 0, "Achilles": 1, "win_status": 1}):
    #         builds.append({**x["Achilles"], **{"win_status": x["win_status"]}})

    # print(builds)
    # print(anlz.get_top_builds(client, "Achilles", "Solo", "8.10", data=builds))
                

## 5 looops 2507 matches in 2:23:46
## 1 large loop