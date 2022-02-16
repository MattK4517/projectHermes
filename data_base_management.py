

from os import dup
from re import A, match
import pymongo
from collections import OrderedDict
from operator import getitem
import pandas as pd
from pymongo.encryption import Algorithm
import analyze as anlz
from constants import Tier_Three_items, godsDict, roles, ranks, single_combat_stats, single_objective_stats, Warriors
# from pandas.io.json import json_normalize
# import time
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

def merge_total_stats(client, patch, date):
    mydb = client["single_match_stats"]
    updatecol = mydb["Total Stats"]
    for god in godsDict:
        mycol = mydb[god]
        data = []
        #, "Entry_Datetime": date
        for x in mycol.find({"patch": patch}):
            data.append(x)
        print(f"{god}: {len(data)}")
        updatecol.insert_many(data)  

def create_match_dict(match, patch):
    match_dict = {}
    match_dict["Patch"] = patch
    match_dict["Entry_Datetime"] = match["Entry_Datetime"]
    match_dict["MatchId"] = match["MatchID"]
    return match_dict
    
if __name__ == "__main__":
    # calc_total_matches(client, ranks)
    # mydb = client["Matches"]
    # mycol = mydb["9.1 Matches"]
    # with open("match doc Ids.txt", "w") as f:
    #     for x in mycol.aggregate([
    #         {"$group": {"_id": "$MatchId", "count": {"$sum": 1} }},
    #         {"$sort": {"count": -1}}
    #     ]):
    #         f.writelines(f"ID: {x['_id']} count: {x['count']}\n")
