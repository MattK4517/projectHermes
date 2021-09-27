

from re import A
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

def add_patch_field(client, db, col):
    mydb = client[db]
    mycol = mydb[col]
    mycol.update_many(
        {"matchId": {"$lte": 1186797152}},
        {"$set": {"patch": "8.8"}},
    )

if __name__ == "__main__":
    # db = "single_items"
    # # calc_total_matches(ranks, db)
    # tier_types = ["Regular", "Combat"]
    # patches = ["8.9", "8.8"]
    # for tier_type in tier_types:
    #     for patch in patches:
    #         make_tier_list(ranks, roles, tier_type, patch)
    # add_new_urls(client, "Charybdis")
    # for god in godsDict:
    delete_match_docs(client, "single_combat_stats", "Achilles")