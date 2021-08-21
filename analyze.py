from re import S, X
from datetime import datetime
import errlogger as logger
import pymongo
from collections import OrderedDict
from operator import getitem
from constants import godsDict, slots, Tier_Three_items, Starter_items

import pandas as pd

# info pull
# [godWR, godPR, godBR] - check, matchesPlayed - check
# relics used 
# worst matchups - check
# item breakdown - check

def get_top_builds(client, god, role, rank="All Ranks"):
    """ return the top builds of a given god

    Args:
        client ([PyMongo client object]): pymongo database connection
        god ([String]): String of god getting pulled
        role ([String]): Role the god is played in
    
    Returns:
        if req == discord:
            a list containing the builds dict, and then a nested list of the gods games, wins, wr
            the builds dict format is below, nested keys follow [role][slot][different items]
    """ 
    topDict = {role: {slot: {} for slot in slots}}
    god = god.replace("_", " ")
    if rank != "All Ranks":
        mydb = client["Items_by_Rank"]
    else:
        mydb = client["Items"]
    mycol = mydb[god]
    games = 0
    wins = 0
    i = 0
    for data in mycol.find():
        dataKeys = list(data.keys())
        dataKeys.remove("_id")
        if rank != "All Ranks":
            targetDict = data[rank]
        else:
            targetDict = data

        for slot in targetDict[role].keys():
            for item in targetDict[role][slot]:
                if slot == "slot1":
                    games += targetDict[role][slot][item][0]
                    wins += targetDict[role][slot][item][1]
                if item:
                    if item not in topDict[role][slot].keys():
                        topDict[role][slot][item] = {"item": item, "games": targetDict[role][slot][item][0], "wins": targetDict[role][slot][item][1]}
                    elif item in topDict[role][slot].keys():
                        topDict[role][slot][item]["games"] += targetDict[role][slot][item][0]
                        topDict[role][slot][item]["wins"] += targetDict[role][slot][item][1]
    
    items = ["item1", "item2"]
    allDict = {slot: {item: {"items": "", "games":0} for item in items} for slot in slots}

    for slot in topDict[role]:
        gamesplayed = []
        for item in topDict[role][slot]:
            gamesplayed.append(topDict[role][slot][item]["games"])
            if len(allDict[slot]["item1"].keys()) < 1:
                allDict[slot]["item1"] = topDict[role][slot][item]
            elif topDict[role][slot][item]["games"] > allDict[slot]["item1"]["games"]:
                allDict[slot]["item1"] = topDict[role][slot][item]
            elif len(allDict[slot]["item1"].keys()) > 1 and len(allDict[slot]["item2"].keys()) < 1 and topDict[role][slot][item]["games"] < allDict[slot]["item1"]["games"]:
                allDict[slot]["item2"] = topDict[role][slot][item]
            elif topDict[role][slot][item]["games"] > allDict[slot]["item2"]["games"] and topDict[role][slot][item]["games"] < allDict[slot]["item1"]["games"]:
                allDict[slot]["item2"] = topDict[role][slot][item]
    
    for slot in allDict.keys():
        for item in allDict[slot].keys():
            allDict[slot][item]["url"] = get_item(allDict[slot][item]["item"])
    

    if games == 0:
        games = 1
    return {**allDict, **{"games": games, "wins": wins, "winRate": round(wins/games*100, 2)}}


def get_worst_matchups(client, god, role, rank="All Ranks"):
    """ return the worst matchups of a given god in a role

    Args:
        client ([PyMongo client object]): pymongo database connection
        god ([String]): String of god getting pulled
        role ([String]): Role the god is played in
    
    Returns:
        if req == discord:
            a list containing the matchups dict, and then a nested list of the gods games, wins, wr
            the matcups dict format is below, nested keys follow [matchup] : {timesPlayed: int, wins: int, winRate: float, enemy: str}
    """

    # get all matchups in a given role per god
    # aggregate data from each data set
    # throw out all matchups with only 1 game played or > 90% winRate
    # Create a list of matchups for the 10 lowest winRates of the remaining data
    # logger.log(role, "get_worst_matchups")
    god = god.replace("_", " ")
    matchupDict = {}
    if rank == "All Ranks":
        mydb = client["Matchups"]
    else:
        mydb = client["Matchups_by_Rank"]
    mycol = mydb[god]
    winRates = []
    toRemove = []
    games = 0
    wins = 0
    x = 0
    for data in mycol.find():
        for matchup in data:
            if matchup != "_id" and role in matchup:
                index = matchup.find(role)
                enemy = matchup[0:index].strip()
                if rank != "All Ranks":
                    matchupRole, matchupRank = matchup[index:].split(" ")
                else:
                    matchupRank = rank

                if matchupRank == rank:
                    if enemy == god:
                        games += data[matchup][0]
                        wins += data[matchup][1]
                    else:
                        if enemy not in matchupDict.keys():
                            matchupDict[enemy] = {"enemy": enemy, "timesPlayed": data[matchup][0], "wins": data[matchup][1], "winRate": round(data[matchup][1]/data[matchup][0] * 100, 2)}
                        else:
                            matchupDict[enemy]["timesPlayed"] += data[matchup][0]
                            matchupDict[enemy]["wins"] += data[matchup][1]
                            matchupDict[enemy]["winRate"] = round(matchupDict[enemy]["wins"]/matchupDict[enemy]["timesPlayed"] * 100, 2)

    # go thru dict and look for a min number of matchups played
    for key in matchupDict.keys():
        if matchupDict[key]["timesPlayed"] > round(games/100):
            winRates.append(matchupDict[key]["winRate"])
    winRates.sort()
    ## sort the matchups played enough times then pop the greatest wrs
    while len(winRates) > 10:
        winRates.pop()
    
    ## keep track of the num of games played with wrs in the list
    games_cache = []
    for key in matchupDict.keys():
        if matchupDict[key]["winRate"] not in winRates:
            toRemove.append(key)
        else:
            games_cache.append(matchupDict[key]["timesPlayed"])

    ## remove matchups played the least
    games_cache.sort()
    games_cache = games_cache[-10:]

    for key in matchupDict.keys():
        if matchupDict[key]["timesPlayed"] not in games_cache:
            toRemove.append(key)
    
    for i in range(len(toRemove)):
        if toRemove[i] in matchupDict.keys():
            matchupDict.pop(toRemove[i])

    toRemove = []
    if len(matchupDict.keys()) > 10:
        for key in matchupDict.keys():
            if matchupDict[key]["timesPlayed"] in games_cache and matchupDict[key]["winRate"] in winRates:
                toRemove.append(key)
    
    for key in matchupDict.keys():
        matchupDict[key]["url"] = get_url(key)
    
    if games == 0:
        games = 1
    return {**matchupDict, **{"games": games, "wins": wins, "winRate": round(wins/games*100, 2)}}


def get_pb_rate(client, god):
    """ # need to grab # of matches played by god, number of matches played, number of bans

    Args:
        client ([type]): [description]
        god ([type]): [description]
        role ([type]): [description]`
    """
    god = god.replace("_"," ")
    totalMatches = 0
    godBans = 0
    mydb = client["Matches"]
    bandb = client["godBans"]
    bancol = bandb[god]
    totalcol = mydb["Total_Matches"]
    for set in totalcol.find():
        totalMatches = set["Total_Matches"]
    for set in bancol.find():
        godBans += set["bans"]

    return {"godBans": godBans, "totalMatches": totalMatches}

def get_url(god):
    god = god.replace("_"," ")
    god = god.replace(" ", "-")
    if god == "Chang\'e":
        god = "change"
    url = "https://webcdn.hirezstudios.com/smite/god-icons/{}.jpg".format(god.lower())
    return url

def get_abilities(client, god):
    god = god.replace("_"," ")
    mydb = client["URLS"]
    mycol = mydb[god]
    for x in mycol.find():
        abDict = x
    del abDict["_id"]
    abilities = {}
    for x in range(len(abDict["Abilities"])):
        abilities["Ability{}".format(x+1)] = {"name": abDict["Abilities"][x], "url": abDict["Abilities_urls"][x]}
    return abilities

def get_item(item):
    item = item.replace("_"," ")
    item = item.replace(" ", "-")
    item = item.replace("'", "")
    url = "https://webcdn.hirezstudios.com/smite/item-icons/{}.jpg".format(item.lower())
    return url

def get_gods():
    frontEndDict = {}
    for god in godsDict.keys():
        frontEndDict[god] = {"url": get_url(god), "name": god}
    return frontEndDict

def get_winrate(client, god, role):
    god = god.replace("_", " ")
    mydb = client["Items"]
    mycol = mydb[god]
    games = 0
    wins = 0
    i = 0
    for data in mycol.find():
        for slot in data[role].keys():
            for item in data[role][slot]:
                if slot == "slot1":
                    games += data[role][slot][item][0]
                    wins += data[role][slot][item][1]
    return round(wins/games * 100, 2)

def get_extended_winrate(client, god, role, rank="All Ranks"):
    god = god.replace("_", " ")
    if rank != "None":
        mydb = client["Items_by_Rank"]
    else:
        mydb = client["Items"]
    mycol = mydb[god]
    games = 0
    wins = 0
    i = 0
    for data in mycol.find():
        if rank != "None":
            targetDict = data[rank]
        else:
            targetDict = data
        for slot in targetDict[role].keys():
            for item in targetDict[role][slot]:
                if slot == "slot1":
                    games += targetDict[role][slot][item][0]
                    wins += targetDict[role][slot][item][1]
    if games > 0:
        return [games, wins, round(wins/games * 100, 2)]
    else:
        return [games, wins, 0]

def get_item_data(client, item):
    mydb = client["Item_Data"]
    mycol = mydb[item]
    for x in mycol.find():
            itemdata = x

    del itemdata["_id"], itemdata["ActiveFlag"], itemdata["ChildItemId"]

    #itemdata = {**itemdata, **{"Descriptions": itemdata["ItemDescription"]["Menuitems"][0]["Description"]}, **{"Value1": itemdata["ItemDescription"]["Menuitems"][0]["Value"]}}
    itemdata = {**itemdata, **{"item_stats": itemdata["ItemDescription"]["Menuitems"]}}
    return itemdata

# get_top_builds(client, "Achilles")
# starttime = datetime.now()
# dataSheet = pd.read_excel("God Abilities & Items.xlsx", sheet_name="all_items")
# get_top_builds(client, "Achilles", dataSheet,req="flask")
# print(datetime.now() - starttime)


# client = pymongo.MongoClient(
#     "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

# get_item_data(client, "Ancile")
# print(get_worst_matchups_by_rank(client, "Vulcan", "Solo", "Grandmaster", req="flask"))
