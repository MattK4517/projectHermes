from re import S, X
from datetime import datetime
import errlogger as logger
import pymongo
from collections import OrderedDict
from operator import getitem
from constants import godsDict, slots, Tier_Three_items, Starter_items

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
    top_dict = {role: {slot: {} for slot in slots}}
    god = god.replace("_", " ")
    if rank != "All Ranks":
        mydb = client["Items_by_Rank"]
    else:
        mydb = client["Items"]
    mycol = mydb[god]
    games = 0
    wins = 0
    for data in mycol.find():
        data_keys = list(data.keys())
        data_keys.remove("_id")
        if rank != "All Ranks":
            target_dict = data[rank]
        else:
            target_dict = data

        for slot in target_dict[role].keys():
            for item in target_dict[role][slot]:
                if slot == "slot1":
                    games += target_dict[role][slot][item][0]
                    wins += target_dict[role][slot][item][1]
                if item:
                    if item not in top_dict[role][slot].keys():
                        top_dict[role][slot][item] = {"item": item, "games": target_dict[role][slot][item][0], "wins": target_dict[role][slot][item][1]}
                    elif item in top_dict[role][slot].keys():
                        top_dict[role][slot][item]["games"] += target_dict[role][slot][item][0]
                        top_dict[role][slot][item]["wins"] += target_dict[role][slot][item][1]
    
    items = ["item1", "item2"]
    all_dict = {slot: {item: {"items": "", "games":0} for item in items} for slot in slots}

    for slot in top_dict[role]:
        gamesplayed = []
        for item in top_dict[role][slot]:
            gamesplayed.append(top_dict[role][slot][item]["games"])
            if len(all_dict[slot]["item1"].keys()) < 1:
                all_dict[slot]["item1"] = top_dict[role][slot][item]

            elif top_dict[role][slot][item]["games"] > all_dict[slot]["item1"]["games"]:
                all_dict[slot]["item1"] = top_dict[role][slot][item]

            elif (len(all_dict[slot]["item1"].keys()) > 1 and len(all_dict[slot]["item2"].keys()) < 1
            and top_dict[role][slot][item]["games"] < all_dict[slot]["item1"]["games"]):
                all_dict[slot]["item2"] = top_dict[role][slot][item]

            elif (top_dict[role][slot][item]["games"] > all_dict[slot]["item2"]["games"]
            and top_dict[role][slot][item]["games"] < all_dict[slot]["item1"]["games"]):
                all_dict[slot]["item2"] = top_dict[role][slot][item]
    
    for slot in all_dict.keys():
        for item in all_dict[slot].keys():
            all_dict[slot][item] =  {**all_dict[slot][item], **get_item_data(client, all_dict[slot][item]["item"])}
            all_dict[slot][item]["url"] = get_item(all_dict[slot][item]["item"])
    

    if games == 0:
        games = 1
    return {**all_dict, **{"games": games, "wins": wins, "winRate": round(wins/games*100, 2)}}


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
    # Create a list of matchups for the 10 lowest win_rates of the remaining data
    # logger.log(role, "get_worst_matchups")
    god = god.replace("_", " ")
    matchup_dict = {}
    if rank == "All Ranks":
        mydb = client["Matchups"]
    else:
        mydb = client["Matchups_by_Rank"]
    mycol = mydb[god]
    win_rates = []
    toRemove = []
    games = 0
    wins = 0
    for data in mycol.find():
        for matchup in data:
            if matchup != "_id" and role in matchup:
                index = matchup.find(role)
                enemy = matchup[0:index].strip()
                if rank != "All Ranks":
                    matchup_role, matchup_rank = matchup[index:].split(" ")
                else:
                    matchup_rank = rank

                if matchup_rank == rank:
                    if enemy == god:
                        games += data[matchup][0]
                        wins += data[matchup][1]
                    else:
                        if enemy not in matchup_dict.keys():
                            matchup_dict[enemy] = {"enemy": enemy, "timesPlayed": data[matchup][0], "wins": data[matchup][1],
                            "winRate": round(data[matchup][1]/data[matchup][0] * 100, 2)}
                        else:
                            matchup_dict[enemy]["timesPlayed"] += data[matchup][0]
                            matchup_dict[enemy]["wins"] += data[matchup][1]
                            matchup_dict[enemy]["winRate"] = round(matchup_dict[enemy]["wins"]/matchup_dict[enemy]["timesPlayed"] * 100, 2)
    
    test_sort = OrderedDict(sorted(matchup_dict.items(),
        key = lambda x: getitem(x[1], "winRate")))

    min_games = games * 0.01

    to_remove = []
    for key in test_sort:
        if test_sort[key]["timesPlayed"] < min_games:
            to_remove.append(key)
    

    for god in to_remove:
        test_sort.pop(god)
    
    for key in test_sort.keys():
        test_sort[key]["url"] = get_url(key)
    
    if games == 0:
        games = 1
    return {**test_sort, **{"games": games, "wins": wins, "winRate": round(wins/games*100, 2)}}


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
    for data in mycol.find():
        for slot in data[role].keys():
            for item in data[role][slot]:
                if slot == "slot1":
                    games += data[role][slot][item][0]
                    wins += data[role][slot][item][1]
    return round(wins/games * 100, 2)

def get_item_data(client, item):
    mydb = client["Item_Data"]
    mycol = mydb[item]
    for x in mycol.find():
        itemdata = x

    delKeys = ["_id", "ActiveFlag", "ChildItemId", "DeviceName", "IconId", "ItemId", "ItemTier", 
        "RootItemId", "StartingItem", "Type", "itemIcon_URL", "ret_msg"]
    for element in delKeys:
        del itemdata[element]

    #itemdata = {**itemdata, **{"Descriptions": itemdata["ItemDescription"]["Menuitems"][0]["Description"]}, **{"Value1": itemdata["ItemDescription"]["Menuitems"][0]["Value"]}}
    itemdata = {**itemdata, **{"itemStats": itemdata["ItemDescription"]["Menuitems"]}}
    return itemdata

def get_top_builds_rewrite(client, god, role, rank="All Ranks"):
    top_dict = {slot: {} for slot in slots}
    mydb = client["single_items"]
    mycol = mydb[god]
    if rank != "All Ranks":
        myquery = { "role_played": role, "rank": rank}
    else:
        myquery = { "role_played": role}
    games = 0
    wins = 0
    for x in mycol.find(myquery, {"_id": 0}):
        games += 1
        flag = False 
        if x["win_status"] == "Winner":
            wins +=1
            flag = True
        for slot in x[god].keys():
            item = x[god][slot]
            if item:
                if item not in top_dict[slot].keys():
                    if flag:
                        top_dict[slot][item] = {"item": item, "games": 1, "wins": 1}
                    else:
                        top_dict[slot][item] = {"item": item, "games": 1, "wins": 0}
                elif item in top_dict[slot].keys():
                    top_dict[slot][item]["games"] += 1
                    if flag:
                        top_dict[slot][item]["wins"] += 1
    return {**sort_top_dict(top_dict, client), **{"games": games, "wins": wins, "winRate": round(wins/games*100, 2)}}

def sort_top_dict(top_dict, client):
    items = ["item1", "item2"]
    all_dict = {slot: {item: {"item": "", "games":0} for item in items} for slot in slots}
    for slot in top_dict:
        for item in top_dict[slot]:
            if not all_dict[slot]["item1"]["item"]:
                all_dict[slot]["item1"] = top_dict[slot][item]

            elif all_dict[slot]["item1"]["games"] < top_dict[slot][item]["games"]:
                all_dict[slot]["item2"] = all_dict[slot]["item1"]
                all_dict[slot]["item1"] = top_dict[slot][item]

            elif all_dict[slot]["item1"]["games"] == top_dict[slot][item]["games"]:
                if all_dict[slot]["item1"]["wins"] > top_dict[slot][item]["wins"]:
                    all_dict[slot]["item2"] == top_dict[slot][item]
                else:
                    all_dict[slot]["item2"] = all_dict[slot]["item1"]
                    all_dict[slot]["item1"] = top_dict[slot][item]

            elif not all_dict[slot]["item2"]["item"]:
                all_dict[slot]["item2"] = top_dict[slot][item]

            
    
    for slot in all_dict.keys():
        for item in all_dict[slot].keys():
            all_dict[slot][item] =  {**all_dict[slot][item], **get_item_data(client, all_dict[slot][item]["item"])}
            all_dict[slot][item]["url"] = get_item(all_dict[slot][item]["item"])

    return all_dict

def get_worst_matchups_rewrite(client, god, role, rank="All Ranks"):
    mydb = client["single_matchups"]
    mycol = mydb[god]
    matchup_dict = {}
    if rank != "All Ranks":
        myquery = { "role_played": role, "rank": rank}
    else:
        myquery = { "role_played": role}

    games = 0
    wins = 0
    for matchup in mycol.find(myquery, {"_id": 0}):
        games += 1
        flag = False
        if matchup[god] == "Winner":
            flag = True
            wins += 1
        if matchup["enemy"] not in matchup_dict:
            if flag:
                matchup_dict[matchup["enemy"]] = {"enemy": matchup["enemy"], "timesPlayed": 1, "wins": 1}
            else:
                matchup_dict[matchup["enemy"]] = {"enemy": matchup["enemy"], "timesPlayed": 1, "wins": 0}
        else:
            if flag:
                matchup_dict[matchup["enemy"]]["timesPlayed"] += 1
                matchup_dict[matchup["enemy"]]["wins"] += 1
            else: 
                matchup_dict[matchup["enemy"]]["timesPlayed"] += 1
            
        
    for matchup in matchup_dict:
        matchup_dict[matchup]["winRate"] = round(matchup_dict[matchup]["wins"]/matchup_dict[matchup]["timesPlayed"]*100, 2)
    
    test_sort = OrderedDict(sorted(matchup_dict.items(),
        key = lambda x: getitem(x[1], "winRate")))

    min_games = games * 0.01

    to_remove = []
    for key in test_sort:
        if test_sort[key]["timesPlayed"] < min_games:
            to_remove.append(key)
    

    for god in to_remove:
        test_sort.pop(god)
    
    for key in test_sort.keys():
        test_sort[key]["url"] = get_url(key)
    
    if games == 0:
        games = 1
    return {**test_sort, **{"games": games, "wins": wins, "winRate": round(wins/games*100, 2)}}

def get_winrate_rewrite(client, god, role, rank="All Ranks"):
    mydb = client["single_items"]
    mycol = mydb[god]
    if rank != "All Ranks":
        myquery = {"role_played": role, "rank": rank}
    else:
        myquery = {"role_played": role}

    games = 0
    wins = 0
    for x in mycol.find(myquery):
        games += 1
        if x["win_status"] == "Winner":
            wins += 1
    if games > 0:
        win_rate = round(wins/games*100, 2)
    else:
        win_rate = 0

    return [wins, games, win_rate]

def get_total_matches(client, rank):
    mydb = client["Matches"]
    total_games = 0
    if rank != "All Ranks":
        mycol = mydb[f"Total_Matches - {rank}"]
        for x in mycol.find():
            games = x
        total_games = games["Total_Matches"]
    else:
        mycol = mydb["8.8 Matches"]
        total_games = mycol.count_documents({})
    return total_games

def get_ban_rate(client, god):
    mydb = client["single_god_bans"]
    mycol = mydb[god]
    return mycol.count_documents({})


# client = pymongo.MongoClient(
#     "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

# print(get_worst_matchups_rewrite(client, "Achilles", "Solo"))

# print(get_top_builds_rewrite(client, "Bellona", "Solo"))
# print(get_top_builds(client, "Achilles", "Solo"))
# print(get_item_data(client, "Ancile"))
# print(get_worst_matchups(client, "Achilles", "Solo"))
# print(get_worst_matchups_by_rank(client, "Vulcan", "Solo", "Grandmaster", req="flask"))
