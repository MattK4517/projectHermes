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
    with open("cred.txt", "r") as creds:
            lines = creds.readlines()
            smite_api = SmiteAPI(devId=lines[0].strip(), authKey=lines[1].strip(), responseFormat=pyrez.Format.JSON)
    playerId = smite_api.getPlayerId("jurse")
    matches = smite_api.getQueueStats(playerId[0].player_id, 451)
    with open("tierList.txt", "a") as f:
        for match_data in matches:
            f.write(anlz.create_player_return_dict(match_data))

    


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