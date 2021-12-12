

from re import A, match
import pymongo
from collections import OrderedDict
from operator import getitem
import pandas as pd
from pymongo.encryption import Algorithm
import analyze as anlz
from constants import godsDict, roles, ranks, single_combat_stats, single_objective_stats

from pandas.io.json import json_normalize

client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:9gR7C1aDKclng4jA@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")


def clear_nonmatches(client):
    db_list = client.list_database_names()
    for db in db_list:
        if db == "Matches":
            print("Matches")
        else:
            client.drop_database(db)


def get_last_day(client):
    mydb = client["Matches"]
    mycol = mydb["matches"]
    for set in mycol.find():
        keys = list(set.keys())
        keys.pop(0)
        print(set[keys[0]]["Entry_Datetime"])


def delete_match_docs(client, db, col, field, value):
    mydb = client[db]
    mycol = mydb[col]
    mycol.delete_many({field: value})


def calc_total_matches(ranks, db, rank="All Ranks"):
    if rank != "All Ranks":
        ranks = [rank]
    matchIds = []
    actTotalGames = 0
    for rank in ranks:
        if rank == "All Ranks":
             mycol.update_one({"rank": rank, "patch": "8.11"}, {"$set": {"Total_Matches": len(matchIds)}})
             break
        mydb = client[db]
        total_games = 0
        for god in godsDict:
            mycol = mydb[god]
            myquery = {"rank": rank, "patch": "8.11"}
            games = 0
            for x in mycol.find(myquery, {"_id": 0}):
                # if x["matchId"] not in matchIds:
                    matchIds.append(x["matchId"])
                    games += 1
            total_games += games
        actTotalGames += total_games
        insert_games(rank, total_games)


def insert_games(rank, games):
    mydb = client["Matches"]
    mycol = mydb[f"Total_Matches"]
    mycol.update_one({"rank": rank, "patch": "8.11"}, {"$set": {"Total_Matches": games}})

def add_new_urls(client, god):
    god_info_db = client["God_Data"]
    god_info_col = god_info_db[god]
    for x in god_info_col.find():
        data = x
    ability_names = [
        data["Ability1"],
        data["Ability2"],
        data["Ability3"],
        data["Ability4"],
        data["Ability5"],
    ]
    ability_urls = [
        data["godAbility1_URL"],
        data["godAbility2_URL"],
        data["godAbility3_URL"],
        data["godAbility4_URL"],
        data["godAbility5_URL"],
    ]
    mydb = client["URLS"]
    mycol = mydb[god]
    mycol.insert_one({
        "Abilities": ability_names,
        "Abilities_urls": ability_urls,
    })

def add_patch_field(client, db, col, matchId, carry_score, field_key):
    mydb = client[db]
    mycol = mydb[col]
    # print(matchId)
    mycol.update_one(
        {"MatchId": matchId},
        {"$set": {field_key: carry_score}},
    )

def get_one_match(client, db, col):
    mydb = client[db]
    mycol = mydb[col]
    for x in mycol.find({"MatchId": 1191575208}, {"_id": 0}):
        return x

def add_carry_score(client, db, col, field_key):
    myquery = {"Patch": "8.9"}
    mydb = client[db]
    mycol = mydb[col]
    carry_score = {}
    for x in mycol.find(myquery, {"_id": 0}):
        matchId = x["MatchId"]
        carry_score = anlz.get_gold_score(x)
        add_patch_field(client, db, col, matchId, carry_score, field_key)

def add_damage_score(client, db, col, field_key):
    myquery = {"Patch": "8.9"}
    mydb = client[db]
    mycol = mydb[col]
    damage_score = {}
    for x in mycol.find(myquery, {"_id": 0}):
        matchId = x["MatchId"]
        damage_score = anlz.get_damage_score(x)
        add_patch_field(client, db, col, matchId, damage_score, field_key)

def add_level_diff(client, db, col, field_key):
    myquery = {"Patch": "8.9"}
    mydb = client[db]
    mycol = mydb[col]
    level_diff = {}
    for x in mycol.find(myquery, {"_id": 0}):
        matchId = x["MatchId"]
        level_diff = anlz.get_level_diff(x)
        add_patch_field(client, db, col, matchId, level_diff, field_key)

def add_kill_part(client, db, col, field_key):
    myquery = {"Patch": "8.9"}
    mydb = client[db]
    mycol = mydb[col]
    kill_part = {}
    for x in mycol.find(myquery, {"_id": 0}):
        matchId = x["MatchId"]
        kill_part = anlz.get_kill_part(x)
        add_patch_field(client, db, col, matchId, kill_part, field_key)

def add_gold_eff(client, db, col, field_key):
    myquery = {"Patch": "8.9"}
    mydb = client[db]
    mycol = mydb[col]
    gold_eff = {}
    for x in mycol.find(myquery, {"carryScore": 1, "killPart": 1,"_id": 0, "MatchId": 1}):
        matchId = x["MatchId"]
        gold_eff = anlz.get_gold_eff(x["killPart"], x["carryScore"])
        add_patch_field(client, db, col, matchId, gold_eff, field_key)


if __name__ == "__main__":
    calc_total_matches(ranks, "single_items")
    # delete_match_docs(client, "Matches", "8.11 Matches", "Entry_Datetime", "12/10/2021")
    # mydb = client["Matches"]
    # mycol = mydb["8.11 Matches"]
    # print(mycol.count_documents({"Entry_Datetime": "12/10/2021"}))

    # dbs = ["single_combat_stats", "single_god_bans", "single_items", "single_matchups", "single_objective_stats", "single_match_stats"]
    # for db in dbs:
    #     mydb = client[db]
    #     for god in godsDict.keys():
    #             mycol = mydb[god]
    #             mycol.delete_many({"Entry_Datetime": "12/10/2021"})

    # fields = ["carryScore","damageScore", "levelDiff", "killPart", "efficiency"]
    # mydb = client["Matches"] 
    # mycol = mydb["8.9 Matches"]
    # for x in mycol.find({"MatchId": 1190137864}, {"_id": 0}):
    #     carryScore = anlz.get_gold_eff(anlz.get_kill_part(x), anlz.get_gold_score(x))
    # myquery = {"player"+str(i)+".Player_Name": 1 for i in range(10)}
    # myquery["_id"] = 0
    # df = pd.DataFrame(json_normalize(mycol.find({}, myquery)))
    # df.to_excel("names.xlsx")











#     count = 0
#     compCount = 0
#     for x in mycol.find({"Entry_Datetime": "10/3/2021"}, {"_id": 0}):
#         if "carryScore" not in x.keys():
#             for field in fields:
#                 if field == "carryScore":
#                     carry_score = anlz.get_gold_score(x)
#                 elif field == "damageScore":
#                     carry_score = anlz.get_damage_score(x)
#                 elif field == "levelDiff":
#                     carry_score = anlz.get_level_diff(x)
#                 elif field == "killPart":
#                     carry_score = anlz.get_kill_part(x)
#                 elif field == "efficiency":
#                     carry_score = anlz.get_gold_eff(anlz.get_kill_part(x), anlz.get_gold_score(x))
#                 add_patch_field(client, "Matches", "8.9 Matches", x["MatchId"], carry_score, field)
#                 count += 1
#             print("Match Done: {}".format(x["MatchId"]))
# print("number remaining 9858")
### 1192921877