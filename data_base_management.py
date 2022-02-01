

from re import A, match
import pymongo
from collections import OrderedDict
from operator import getitem
import pandas as pd
from pymongo.encryption import Algorithm
import analyze as anlz
from constants import Tier_Three_items, godsDict, roles, ranks, single_combat_stats, single_objective_stats, Warriors
from pandas.io.json import json_normalize
import time
from main import client

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


def calc_total_matches(client, ranks):
    matchIds = []
    actTotalGames = 0
    for rank in ranks:
        if rank == "All Ranks":
             mycol.update_one({"rank": rank, "patch": "9.1", "mode": "RankedConq"}, {"$set": {"Total_Matches": len(matchIds)}})
             break
        mydb = client["single_match_stats"]
        total_games = 0
        for god in godsDict:
            mycol = mydb[god]
            myquery = {"rank": rank, "patch": "9.1", "mode": "RankedConq"}
            games = 0
            for x in mycol.find(myquery, {"_id": 0}):
                # if x["matchId"] not in matchIds:
                    matchIds.append(x["matchId"])
                    games += 1
            total_games += games
            print(f"{god} {games}, {total_games}")
        actTotalGames += total_games
        insert_games(rank, total_games)


def insert_games(rank, games):
    mydb = client["Matches"]
    mycol = mydb[f"Total_Matches"]
    mycol.update_one({"rank": rank, "patch": "9.1", "mode": "RankedConq"}, {"$set": {"Total_Matches": games}})
    print(f"{rank} done")

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

def remove_duplicates(client, dbs):
    # for db in dbs:
        mydb = client["CasualMatches"]
        mycol = mydb["9.1 Matches"]
        # for god in godsDict.keys():
        #     mycol = mydb[god]
        doc_ids = []
        for x in mycol.aggregate([
            {"$match": {"Entry_Datetime": "12/20/2021"}},
            {"$group": {"_id": "$MatchId", "count": {"$sum": 1} }}
        ]):
            if x["count"] > 1:
                for x in mycol.find({"MatchId": x["_id"]}, {"_id": 1}):
                    doc_ids.append(x["_id"])
                    if len(doc_ids) > 1:
                        mycol.delete_one({"_id": doc_ids[-1]})
                                # time.sleep(100)
            # ending_number = mycol.count_documents({})
            # with open("requirements.txt", "a") as f:
            #     f.writelines(f"{db} for {god} starting at {starting_number} end at {ending_number}. loss={round(100 -ending_number/starting_number * 100, 2)}\n")
            # print(f"{god} done")

def purge_date(client, dbs, date):
    for db in dbs:
        for god in godsDict.keys():
            delete_match_docs(client, db, god, "Entry_Datetime", date)
        
if __name__ == "__main__":
    # calc_total_matches(client, ranks)
    mydb = client["single_match_stats"]
    mycol = mydb["Total Stats"]
    winrate = 0
    games = 0
    skin = ""
    winning = []
    losing = []
    god = ""
    test = 0
    for x in mycol.aggregate(
        [
            {
                "$group": {
                    "_id": {
                        "skin": "$player",
                        "win_status": "$win_status",
                        # "god": "$god"
                    },
                    "count": {"$sum": 1},
                }
            },
            {"$sort": {"count": 1}},
        ], allowDiskUse = True
    ):
        test += 1
        if test % 1000 == 0:
            print(f"{test} players done")
        if x["_id"]["win_status"] == "Winner":
            winning.append(x)
        else:
            losing.append(x)
    

    for losingSkin in winning:
        for winningSkin in losing:
            if "skin" in winningSkin["_id"].keys() and "skin" in losingSkin["_id"].keys():
                if winningSkin["_id"]["skin"] == losingSkin["_id"]["skin"]:
                    if winningSkin["count"] + losingSkin["count"] > 0:
                        tempWin = 100 - round(losingSkin["count"] / (winningSkin["count"] + losingSkin["count"]) * 100,2 )
                        if tempWin > winrate:
                            winrate = tempWin
                            skin = winningSkin["_id"]["skin"]
                            games = winningSkin["count"] + losingSkin["count"]
                            # god = winningSkin["_id"]["god"]
    
    print(god, skin, winrate, games)


            
    # phys = []
    # mag = []
    # mydb = client["Item_Data"]
    # for item in Tier_Three_items:
    #     mycol = mydb[item]
    #     for x in mycol.find({}, {"_id": 0, "ItemDescription": 1, "DeviceName": 1}):
    #         for item in x["ItemDescription"]["Menuitems"]:
    #             if "Physical Power" in item["Description"]:
    #                 phys.append( {"id" :x["DeviceName"]} )
    #             elif "Magical Power" in item["Description"]:
    #                 mag.append( {"id": x["DeviceName"]} )
        
    # print(phys)
    # print(mag)

    # calc_total_matches(client, ranks)
    # mydb = client["single_match_stats"]
    # mycol = mydb["9.1 Matches"]
    # print(mycol.count_documents({"Entry_Datetime": "12/22/2021"}))
    # count = 0
    # god = "Achilles"
    # mycol = mydb[god]
    # print(mycol.count_documents({"patch": "9.1"}))
    # print(mycol.count_documents({"skin": {"$exists": True}}))
    # mycol = mydb[god]
    # for warrior in Warriors:
    #     games = 0
    #     wins = 0
    #     avgKills = 0
    #     for x in mycol.find({"time": {"$lte": 660}, "patch": "9.1", "enemy": warrior}):
    #         games += 1
    #         if x["win_status"] == "Winner":
    #             wins += 1
    #         avgKills += x["kills"]
    #     if games == 0:
    #         games = 1
    #     print(f"{god}: {round(wins/games*100, 2)}% v {warrior} Avg. Kills: {round(avgKills/games, 2)}")
    # print(count)
    # mycol = mydb["Atlas"]
    # for x in mycol.aggregate([
    #     {"$group": {"_id": "$matchId", "count": {"$sum": 1} }}
    # ]):
    #     if x["count"] > 1:
    #         print(x["count"], x["_id"])
    #         count += x["count"]
    # print(count)

    # mydb = client["Matches"]
    # cols = ["8.9 Matches", "8.10 Matches", "8.11 Matches"]
    # myquery = {**{f"player{i}.Ranked_Stat_Conq": 1 for i in range(10)}, **{f"player{i}.Player_Name": 1 for i in range(10)}, **{"_id": 0}}
    # low_elo = {}
    # count = 0
    # for col in cols:
    #     mycol = mydb[col]
    #     for x in mycol.find({}, myquery):
    #         for player in x:
    #             if x[player]["Ranked_Stat_Conq"] > 3300:
    #                 count += 1
    #                 playerName = x[player]["Player_Name"]
    #                 low_elo[playerName] = x[player]
    
    # test_sort = OrderedDict(sorted(low_elo.items(),
    # key = lambda x: getitem(x[1], "Ranked_Stat_Conq")))
    # low_elo = dict(test_sort)
    # print(low_elo)
    # print(len(low_elo))
    # print(count)
    # mydb = client["single_matchups"]
    # insertdb = client["single_match_stats"]
    # for god in godsDict:
    #     mycol = mydb[god]
    #     insertcol = insertdb[god]
    #     myquery = {"patch": "8.11"}
    #     for x in mycol.find(myquery, {"enemy": 1, "matchId": 1}):
    #         insertcol.update_one({"matchId": x["matchId"]}, {"$set": {"enemy": x["enemy"]}})


    # dbs = ["single_god_bans", "single_items", "single_matchups", "single_combat_stats", "single_objective_stats"]
    # purge_date(client, dbs, "11/4/2021")
    # delete_match_docs(client, "Matches", "8.11 Matches", "Entry_Datetime", "11/24/2021")

    # remove_duplicates(client, "none")
    # print(mycol.count_documents({"Entry_Datetime": "12/19/2021"}))
    # mydb = client["Matches"]
    # mycol = mydb["8.11 Matches"]
    # print(mycol.count_documents({"Entry_Datetime": "11/24/2021"}))

# if __name__ == "__main__":
#     # delete_match_docs(client, "Matches", "8.11 Matches", "Entry_Datetime", "12/10/2021")
#     mydb = client["CasualMatches"]
#     mycol = mydb["9.1 Matches"]
#     mycol.delete_many({"Entry_Datetime": "12/16/2021"})
    # print(mycol.count_documents({"Entry_Datetime": "12/10/2021"}))
    # mydb = client["single_items_test"]
    # mycol = mydb["Atlas"]
    # for x in mycol.aggregate([
    #     {"$group": {"_id": "$matchId", "count": {"$sum": 1} }}
    # ]):
    #     if x["count"] > 1:
    #         print(x["count"], x["_id"])
    # dbs = ["single_combat_stats", "single_god_bans", "single_items", "single_matchups", "single_objective_stats", "single_match_stats"]
    # for db in dbs:
    #     mydb = client[db]
    #     for god in godsDict.keys():
    #         if god != "Atlas":
    #             mycol = mydb[god]
    # mydb = client["Matches"]
    # mycol = mydb["9.1 Matches"]
    # mycol.update_many({}, {"$set": {"mode": "RankedConq"}})

    # fields = ["carryScore","damageScore", "levelDiff", "killPart", "efficiency"]
    # mydb = client["Matches"] 
    # mycol = mydb["8.9 Matches"]
    # for x in mycol.find({"MatchId": 1190137864}, {"_id": 0}):
    #     carryScore = anlz.get_gold_eff(anlz.get_kill_part(x), anlz.get_gold_score(x))
    # myquery = {"player"+str(i)+".Player_Name": 1 for i in range(10)}
    # myquery["_id"] = 0
    # df = pd.DataFrame(json_normalize(mycol.find({}, myquery)))
    # df.to_excel("names.xlsx")

# 2555
# 157274 + 42560 + 88166 + 37476 + 45612
# 371,088