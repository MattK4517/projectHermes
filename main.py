from collections import _OrderedDictItemsView, OrderedDict
from operator import getitem
from re import match
import pyrez
from pyrez.api import SmiteAPI
import analyze as anlz
import pymongo
from datetime import datetime
from constants import roles, patch
# from data_pull_insert import run_pull, get_new_id
# from data_pull_formatting_rewrite import run_format
import pandas as pd
client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

if __name__ == "__main__":
    # starttime = datetime.now()
    # with open("cred.txt", "r") as creds:
    #     lines = creds.readlines()
    #     smite_api = SmiteAPI(devId=lines[0].strip(), authKey=lines[1].strip(), responseFormat=pyrez.Format.JSON)
    # get_new_id(client, smite_api)
    # run_pull(patch, "20211020")
    # run_format(patch, "10/19/2021")
    mydb = client["single_items"]
    mycol = mydb["Kali"]
    dmg_dict = {}
    index = 0
    builds = {}
    index = 0
    for x in mycol.aggregate([
            { 
                "$match": {"role_played": "Jungle", "patch": "8.10", "rank": "Gold" } 
            }, 
            { 
                "$group": {"_id": {"slot1": "$Kali.slot1", "slot2": "$Kali.slot2", "slot3": "$Kali.slot3", "win_status": "$win_status"}, "count": {"$sum": 1} }
            },
            {
                "$sort" : {"count": 1}
            }
    ]):
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

    to_remove = []
    for build in builds:
        if (builds[build]["wins"] + builds[build]["losses"]) < index * 1.5/100:
            to_remove.append(build)
    
    for element in to_remove:
        del builds[element]

    test_sort = OrderedDict(sorted(builds.items(),
            key = lambda x: getitem(x[1], "wins")))
    
    builds = dict(test_sort)
    print(builds)
                

## 5 looops 2507 matches in 2:23:46
## 1 large loop