

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
    mycol.delete_many({"patch": "8.8 Bonus"})


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


def make_tier_list(ranks, roles, list_type, patch):
    for rank in ranks:
        for role in roles:
            if list_type == "Regular":
                calc_tier_list(rank, role, patch)
            elif list_type == "Combat":
                calc_combat_tier_list(rank, role, patch)


def calc_tier_list(rank, role, patch):
    total_games = anlz.get_total_matches(client, rank, patch)
    if total_games == 0 and rank == "Grandmaster":
        total_games = anlz.get_total_matches(client, "Masters", patch)
    mydb = client["Matches"]
    if rank != "All Ranks":
        mycol = mydb[f"Total_Matches - {rank}"]

    tierlistdb = client["Tier_List"]
    tiercol = tierlistdb["Tierlist - Regular test"]
    # for x in mycol.find():
    #     games = x

    min_games = round(total_games * .005)
    if min_games < 1:
        min_games = 1
    for god in godsDict:
        wins, games, win_rate = anlz.get_winrate_rewrite(
            client, god, role, patch, rank)
        if games >= min_games:
            bans = anlz.get_pb_rate(client, god, rank, patch)
            counter_matchups = anlz.get_worst_matchups_rewrite(
               client, god, role, "8.8", rank)
            del counter_matchups["games"], counter_matchups["wins"], counter_matchups["winRate"]
            to_remove = []
            for key, index in enumerate(counter_matchups):
               if key > 9:
                   to_remove.append(index)
            for key in to_remove:
                counter_matchups.pop(key)
           
           
            tiercol.insert_one({
               "Entry_Datetime": "9/25/2021",
               "patch": patch,
               "rank": rank,
               "role": role,
               "god": god,
               "tier": "A",
               "winRate": win_rate,
               "pickRate": round(games/total_games * 100, 2),
               "banRate": bans["banRate"],
               "counterMatchups": counter_matchups,
               "games": games,
               "wins": wins,
           })

        print(f"{rank}-{role}-{god} Done")
        
def calc_combat_tier_list(rank, role, patch):
    total_games = anlz.get_total_matches(client, rank, patch)
    if total_games == 0 and rank == "Grandmaster":
        total_games = anlz.get_total_matches(client, "Masters", patch)
    mydb = client["Matches"]
    if rank != "All Ranks":
        mycol = mydb[f"Total_Matches - {rank}"]
     
    tierlistdb = client["Tier_List"]
    tiercol = tierlistdb["Tierlist - Combat test"]
    # for x in mycol.find():
    #     games = x

    min_games = round(total_games * .005)
    if min_games < 1:
        min_games = 1
    for god in godsDict:
        wins, games, win_rate = anlz.get_winrate_rewrite(
            client, god, role, patch, rank)
        if games >= min_games:
            insert_data = anlz.get_combat_stats(client, god, role, patch, rank)
            tiercol.insert_one({**{"Entry_Datetime": "9/25/2021", "patch": patch}, **insert_data})
        print(f"{rank}-{role}-{god} Done")

if __name__ == "__main__":
    db = "single_items"
    # calc_total_matches(ranks, db)
    tier_types = ["Regular", "Combat"]
    patches = ["8.9", "8.8"]
    for tier_type in tier_types:
        for patch in patches:
            make_tier_list(ranks, roles, tier_type, patch)
    # delete_match_docs(client, "single_matchups", "Achilles")
