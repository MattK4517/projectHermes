

from re import A, match
import pymongo
from collections import OrderedDict
from operator import getitem

from pymongo.encryption import Algorithm
import analyze as anlz
from constants import godsDict, roles, ranks

client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")


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


def delete_match_docs(client, db, col):
    mydb = client[db]
    mycol = mydb[col]
    mycol.delete_many({"patch": 8.8})


def calc_total_matches(ranks, db, rank="All Ranks"):
    if rank != "All Ranks":
        ranks = [rank]
    matchIds = []
    actTotalGames = 0
    for rank in ranks:
        mydb = client[db]
        total_games = 0
        for god in godsDict:
            mycol = mydb[god]
            myquery = {"rank": rank}
            games = 0
            for x in mycol.find(myquery, {"_id": 0}):
                if x["matchId"] not in matchIds:
                    matchIds.append(x["matchId"])
                    games += 1
            total_games += games
        actTotalGames += total_games
        insert_games(rank, total_games)


def insert_games(rank, games):
    mydb = client["Matches"]
    mycol = mydb[f"Total_Matches - {rank}"]
    mycol.insert_one({"Total_Matches": games})

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

def add_patch_field(client, db, col, matchId, carry_score):
    mydb = client[db]
    mycol = mydb[col]
    print(matchId)
    mycol.update_one(
        {"MatchId": matchId},
        {"$set": {"levelDiff": carry_score}},
    )

def add_gold_score(client, db, col):
    myquery = {"Patch": "8.9"}
    mydb = client[db]
    mycol = mydb[col]
    carry_score = {}
    for x in mycol.find(myquery, {"_id": 0}):
        matchId = x["MatchId"]
        carry_score = anlz.get_gold_score(x)
        add_patch_field(client, db, col, matchId, carry_score)

def get_one_match(client, db, col):
    mydb = client[db]
    mycol = mydb[col]
    for x in mycol.find({"MatchId": 1191575208}, {"_id": 0}):
        return x

def add_damage_score(client, db, col):
    myquery = {"Patch": "8.9"}
    mydb = client[db]
    mycol = mydb[col]
    damage_score = {}
    for x in mycol.find(myquery, {"_id": 0}):
        matchId = x["MatchId"]
        damage_score = anlz.get_damage_score(x)
        add_patch_field(client, db, col, matchId, damage_score)

def add_level_diff(client, db, col):
    myquery = {"Patch": "8.9"}
    mydb = client[db]
    mycol = mydb[col]
    level_diff = {}
    for x in mycol.find(myquery, {"_id": 0}):
        matchId = x["MatchId"]
        level_diff = anlz.get_level_diff(x)
        add_patch_field(client, db, col, matchId, level_diff)

if __name__ == "__main__":

    ### CODE FOR AVERAGE LEVEL DIFF ###
    # average_level_diff = {role: {"levelDiff": 0} for role in roles}
    # mydb = client["test"]
    # mycol = mydb["8.9 Matches"]
    # count = 0
    # for x in mycol.find({}, {"levelDiff": 1, "_id": 0}):
    #     if "levelDiff" in x.keys():
    #         for role in x["levelDiff"]["Winner"]:
    #             if role in average_level_diff.keys():
    #                 average_level_diff[role]["levelDiff"] += x["levelDiff"]["Winner"][role]["level_diff"]
    #         count += 1
    # for role in average_level_diff:
    #     average_level_diff[role]["levelDiff"] = round(average_level_diff[role]["levelDiff"] / count)
    
    # print(average_level_diff)

    ### CODE FOR AVERAGE DAMAGE SHARE ###
    # average_damage_share = {role: {"damageShare": 0} for role in roles}
    # mydb = client["test"]
    # mycol = mydb["8.9 Matches"]
    # count = 0
    # for x in mycol.find({}, {"damageScore": 1, "_id": 0}):
    #     if "damageScore" in x.keys():
    #         for team in x["damageScore"]:
    #             del x["damageScore"][team]["totalDamage"]
    #             for role in x["damageScore"][team]:
    #                 if role in average_damage_share.keys():
    #                     average_damage_share[role]["damageShare"] += x["damageScore"][team][role]["damageShare"] / 2
    #         count += 1
    #     print(count)

    # for role in average_damage_share:
    #     average_damage_share[role]["damageShare"] = round(average_damage_share[role]["damageShare"] / count, 2)
    # print(average_damage_share)


    ### CALCS AVERAGE GOLD SHARE FOR THE ROLES
    # average_gold_share = {role: {"goldShare": 0} for role in roles}
    # mydb = client["Matches"]
    # mycol = mydb["8.9 Matches"]
    # count = 0
    # for x in mycol.find({}, {"carryScore": 1, "_id": 0}):
    #     if "carryScore" in x.keys():
    #         for team in x["carryScore"]:
    #             del x["carryScore"][team]["totalGold"]
    #             for role in x["carryScore"][team]:
    #                 if role in average_gold_share.keys():
    #                     average_gold_share[role]["goldShare"] += x["carryScore"][team][role]["goldShare"] / 2
    #         count += 1
    #         print(count)

    # for role in average_gold_share:
    #     average_gold_share[role]["goldShare"] = round(average_gold_share[role]["goldShare"] / count, 2)
    # print(average_gold_share)