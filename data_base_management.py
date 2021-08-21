import pymongo
import pandas as pd
from collections import OrderedDict
from operator import getitem
import analyze as anlz
from constants import godsDict, roles, ranks

client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

def clear_nonmatches(client):
    dblist = client.list_database_names()
    for db in dblist:
        if db == "Matches":
            print("Matches")
        else:
            client.drop_database(db)


def calc_total_matches(client):
    mydb = client["Matches"]
    mycol = mydb["matches"]
    games = 0
    for set in mycol.find():
        keys = list(set.keys())
        keys.pop(0)
        games += len(keys)
    return games


def get_last_day(client):
    mydb = client["Matches"]
    mycol = mydb["matches"]
    for set in mycol.find():
        keys = list(set.keys())
        keys.pop(0)
        print(set[keys[0]]["Entry_Datetime"])


def insert_matches():
    Total = calc_total_matches(client)
    mydb = client["Matches"]
    mycol = mydb["Total_Matches"]
    mycol.insert_one({"Total_Matches": Total})


def calc_ranks(client, role, rank="All Ranks"):
    allGods = {
        role: {},
    }
    if rank:
        minGames = 5
    else:
        minGames = 517

    for god in godsDict.keys():
        games, wins, winrate = anlz.get_extended_winrate(client, god, role, rank)
        if games > minGames:
            matches, bans, totalMatches = anlz.get_pb_rate(
                client, god, req="discord")
            if "All" in rank:
                counterMatchups = anlz.get_worst_matchups_by_rank(
                    client, god, role, rank, req="None")
            else:
                counterMatchups = anlz.get_worst_matchups(
                    client, god, role, req="None")
            allGods[role][god] = {"bans": bans, "god": god, "games": games, "pickRate": round(games/totalMatches * 100, 2),
            "banRate": round(bans/totalMatches * 100, 2), "role": role, "wins": wins, "winRate": winrate, "counterMatchups": counterMatchups}
        print(len(counterMatchups))
        print("god done: {} {}".format(god, role))
    return allGods

def make_tier_list(client, role, rank="All Ranks", gameMode="Conq"):
    if gameMode == "Omni":
        allDict = {}
    else:
        allDict = calc_ranks(client, role, rank)
        testDict = allDict[role]
        return testDict
    
def get_ranks(client):
    mydb = client["Matches"]
    mycol = mydb["matches"]
    playersId = []
    ranks = {}
    for doc in mycol.find():
        matches = list(doc.keys())
        for match in matches:
            if match != "_id": 
                for player in doc[match].keys():
                    if "player" in player:
                        if doc[match][player]["PlayerId"] not in playersId:
                            if doc[match][player]["Conquest_Tier"] in ranks.keys():
                                ranks[doc[match][player]["Conquest_Tier"]] += 1
                            else:
                                ranks[doc[match][player]["Conquest_Tier"]] = 1

                            if doc[match][player]["PlayerId"] != 0:
                                playersId.append(doc[match][player]["PlayerId"])
    return ranks


def get_mmrs(client):
    mydb = client["Matches"]
    mycol = mydb["matches"]
    playersId = []
    mmrs = {
        "0-250": 0,
        "251-500": 0,
        "501-750": 0,
        "751-1000": 0,
        "1001-1250": 0,
        "1251-1500": 0,
        "1501-1750": 0,
        "1751-2000": 0,
        "2001-2250": 0,
        "2251-2500": 0,
        "2501-2750": 0,
        "2751-3000": 0,
        "3001-3250": 0,
        "3251-3500": 0,
    }

    for doc in mycol.find():
        matches = list(doc.keys())
        for match in matches:
            if match != "_id": 
                for player in doc[match].keys():
                    if "player" in player:
                        if doc[match][player]["PlayerId"] not in playersId:
                            pass
                            # if doc[match][player]["Ranked_Stat_Conq"] <= 250:
                            #     mmrs["0-250"] +=1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 251 and doc[match][player]["Ranked_Stat_Conq"] <= 500:
                            #     mmrs["251-500"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 501 and doc[match][player]["Ranked_Stat_Conq"] <= 750:
                            #     mmrs["501-750"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 751 and doc[match][player]["Ranked_Stat_Conq"] <= 1000:
                            #     mmrs["751-1000"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 1001 and doc[match][player]["Ranked_Stat_Conq"] <= 1250:
                            #     mmrs["1001-1250"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 1251 and doc[match][player]["Ranked_Stat_Conq"] <= 1500:
                            #     mmrs["1251-1500"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 1501 and doc[match][player]["Ranked_Stat_Conq"] <= 1750:
                            #     mmrs["1501-1750"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 1751 and doc[match][player]["Ranked_Stat_Conq"] <= 2000:
                            #     mmrs["1751-2000"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 2001 and doc[match][player]["Ranked_Stat_Conq"] <= 2250:
                            #     mmrs["2001-2250"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 2251 and doc[match][player]["Ranked_Stat_Conq"] <= 2500:
                            #     mmrs["2251-2500"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 2501 and doc[match][player]["Ranked_Stat_Conq"] <= 2750:
                            #     mmrs["2501-2750"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 2751 and doc[match][player]["Ranked_Stat_Conq"] <= 3000:
                            #     mmrs["2751-3000"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 3001 and doc[match][player]["Ranked_Stat_Conq"] <= 3250:
                            #     mmrs["3000-3250"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 3251 and doc[match][player]["Ranked_Stat_Conq"] <= 3500:
                            #     mmrs["3251-3500"] += 1


# # for rank in ranks:
# #     for role in roles: 
# #         tList = make_tier_list(client, role, rank)
# #         mydb = client["Tier_List"]
# #         mycol = mydb["8/14/2021 - {} - {}".format(role, rank)]
# #         mycol.insert_one(tList)
# for role in roles:
#     tList = make_tier_list(client, role, rank="None")
#     mydb = client["Tier_List"]
#     mycol = mydb["8/14/2021 - {}".format(role)]
#     mycol.insert_one(tList)

if __name__ == "__main__":
    mydb = client["testing"]
    mycol = mydb["Omni"]