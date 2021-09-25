from re import S, X
from datetime import datetime
import re

from pymongo.message import kill_cursors
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

def get_pb_rate(client, god, rank, patch):
    """ # need to grab # of matches played by god, number of matches played, number of bans

    Args:
        client ([type]): [description]
        god ([type]): [description]
        role ([type]): [description]`
    """
    god = god.replace("_"," ")
    totalMatches = 0
    godBans = 0
    bandb = client["single_god_bans"]
    bancol = bandb[god]
    totalMatches = get_total_matches(client, rank, patch)
    if patch == "8.9":
        myquery = {"patch": patch}
    else:
        myquery = {}

    for set in bancol.find(myquery):
        godBans += 1

    if totalMatches == 0:
        totalMatches = 1
    return {"godBans": godBans, "totalMatches": totalMatches, "banRate": round(godBans/totalMatches * 100, 2)}

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

def get_top_builds_rewrite(client, god, role, patch, rank="All Ranks", items="Top"):
    top_dict = {slot: {} for slot in slots}
    mydb = client["single_items"]
    mycol = mydb[god]
    if rank != "All Ranks":
        myquery = { "role_played": role, "rank": rank, "patch": patch}
    else:
        myquery = { "role_played": role, "patch": patch}
    
    if patch != "8.9":
        if rank != "All Ranks":
            myquery = { "role_played": role, "rank": rank}
        else:
            myquery = { "role_played": role}
    games = 0
    wins = 0
    starttime = datetime.now()
    for x in mycol.find(myquery, {"_id": 0}):
        games += 1
        flag = False 
        if x["win_status"] == "Winner":
            wins +=1
            flag = True
        for slot in x[god].keys():
            item = x[god][slot]
            if item and items == "Top":
                if item not in top_dict[slot].keys():
                    if flag:
                        top_dict[slot][item] = {"item": item, "games": 1, "wins": 1}
                    else:
                        top_dict[slot][item] = {"item": item, "games": 1, "wins": 0}
                elif item in top_dict[slot].keys():
                    top_dict[slot][item]["games"] += 1
                    if flag:
                        top_dict[slot][item]["wins"] += 1
            elif item and items == "All":
                if slot == "slot1":
                    if item not in top_dict[slot].keys():
                        if flag:
                            top_dict[slot][item] = {"item": item, "games": 1, "wins": 1}
                        else:
                            top_dict[slot][item] = {"item": item, "games": 1, "wins": 0}
                    elif item in top_dict[slot].keys():
                        top_dict[slot][item]["games"] += 1
                        if flag:
                            top_dict[slot][item]["wins"] += 1

                elif (item in Tier_Three_items or item in Starter_items) and slot != "slot1":
                    if item not in top_dict[slot].keys():
                        if flag:
                            top_dict[slot][item] = {"item": item, "games": 1, "wins": 1}
                        else:
                            top_dict[slot][item] = {"item": item, "games": 1, "wins": 0}
                    elif item in top_dict[slot].keys():
                        top_dict[slot][item]["games"] += 1
                        if flag:
                            top_dict[slot][item]["wins"] += 1



            test_sort = OrderedDict(sorted(top_dict[slot].items(),
                key = lambda x: getitem(x[1], "games")))
            top_dict[slot] = dict(test_sort)
            
    if items == "Top":
        return {**sort_top_dict(dict(top_dict), client), **{"games": games, "wins": wins, "winRate": round(wins/games*100, 2)}}
    elif items == "All":
        return (dict(top_dict))

def sort_top_dict(top_dict, client):
    items = ["item1", "item2"]
    all_dict = {slot: {item: {"item": "", "games": 0 } for item in items} for slot in slots}
    for slot in top_dict:
        for item in top_dict[slot]:
            if (item in Tier_Three_items or item in Starter_items) and slot != "slot1":
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
            elif slot == "slot1":
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

def get_worst_matchups_rewrite(client, god, role, patch, rank="All Ranks"):
    mydb = client["single_matchups"]
    mycol = mydb[god]
    matchup_dict = {}
    if rank != "All Ranks":
        myquery = { "role_played": role, "rank": rank, "patch": patch}
    else:
        myquery = { "role_played": role, "patch": patch}
    
    if patch != "8.9":
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

def get_winrate_rewrite(client, god, role, patch, rank="All Ranks"):
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

def get_total_matches(client, rank, patch):
    mydb = client["Matches"]
    total_games = 0
    if rank != "All Ranks":
        mycol = mydb[f"Total_Matches - {rank}"]
        for x in mycol.find():
            games = x
        total_games = games["Total_Matches"]
    else:
        mycol = mydb["{} Matches".format(patch)]
        total_games = mycol.count_documents({})
    return total_games

def get_combat_stats(client, god, role, patch, rank="All Ranks"):
    mydb = client["single_combat_stats"]
    mycol = mydb[god]
    if rank != "All Ranks":
        myquery = { "role_played": role, "rank": rank, "patch": patch}
    else:
        myquery = { "role_played": role, "patch": patch}
    
    if patch != "8.9":
        if rank != "All Ranks":
            myquery = { "role_played": role, "rank": rank}
        else:
            myquery = { "role_played": role}

    kills = 0
    deaths = 0
    assists = 0
    damage = 0
    damageTaken = 0
    damageMitigated = 0
    healing = 0
    selfHealing = 0
    games = 0
    wins = 0

    for x in mycol.find(myquery):
        games += 1
        kills += x["kills"]
        deaths += x["deaths"]
        assists += x["assists"]
        damage += x["damage_player"]
        damageTaken += x["damage_taken"]
        damageMitigated += x["damage_mitigated"]
        healing += x["healing"]
        selfHealing += x["healing_self"]
        if x["win_status"] == "Winner":
            wins += 1
    
    if games == 0:
        games = 1

    combat_stats = {
        "rank": rank,
        "role": role,
        "god": god,
        "winRate": round(wins/games * 100, 2),
        "kills": round(kills/games, 2),
        "deaths": round(deaths/games, 2),
        "assists": round(assists/games, 2),
        "damage_": round(damage/games),
        "damageTaken": round(damageTaken/games),
        "damageMitigated": round(damageMitigated/games),
        "healing": round(healing/games),
        "selfHealing": round(selfHealing/games),
        "games": games,

    }

    return combat_stats

def get_build_stats(client, build):
    item_data_db = client["Item_Data"]
    ret_build = {slot: {} for slot in slots}
    slot_num = 1
    for item in build:
        if item:
            item_data_col = item_data_db[item]
            for x in item_data_col.find({}, {
                "_id": 0,
                "ActiveFlag": 0,
                "ChildItemId": 0,
                "IconId": 0,
                }):
                data = x
            ret_build["slot{}".format(slot_num)] = data
            slot_num += 1
    return ret_build

def get_god_stats(client, god, level):
    god_data_db = client["God_Data"]
    god_data_col = god_data_db[god]
    god_stats = {}
    base_stats = {}
    keys_idc = ['Ability1', 'Ability2', 'Ability3', 'Ability4', 'Ability5', 
                'AbilityId1', 'AbilityId2', 'AbilityId3', 'AbilityId4', 'AbilityId5', 
                'Ability_1', 'Ability_2', 'Ability_3', 'Ability_4', 'Ability_5',
                "AutoBanned", "Cons", "Lore", "Name", "OnFreeRotation", "Pantheon", 
                "Pros", "Roles", "Title", "Type", "basicAttack",
                'abilityDescription1', 'abilityDescription2', 'abilityDescription3', 'abilityDescription4', 
                'abilityDescription5', 'godAbility1_URL', 'godAbility2_URL', 'godAbility3_URL', 'godAbility4_URL', 
                'godAbility5_URL', 'godCard_URL', 'godIcon_URL', 'id', 'latestGod', "ret_msg"
                ]
    per_level_stats = {}
    for x in god_data_col.find({}, {"_id": 0}):
        god_stats = x

    for element in keys_idc:
        del god_stats[element]
    
    for key in god_stats:
        if "PerLevel" in key:
            per_level_stats[key] = god_stats[key]
        else:
            base_stats[key] = god_stats[key]
    
    ret_stats = {
        "AttackSpeed": round(base_stats["AttackSpeed"] + (per_level_stats["AttackSpeedPerLevel"] * level), 3),
        "Health": round(base_stats["Health"] + (per_level_stats["HealthPerLevel"] * level), 2), 
        "HP5": round(base_stats["HealthPerFive"] + (per_level_stats["HP5PerLevel"] * level), 2),
        "MagicProtection": round(base_stats["MagicProtection"] + (per_level_stats["MagicProtectionPerLevel"] * level)),
        "MagicalPower": round(base_stats["MagicalPower"] + (per_level_stats["MagicalPowerPerLevel"] * level), 2) * (1/5),
        "Mana": round(base_stats["Mana"] + (per_level_stats["ManaPerLevel"] * level), 2),
        "MP5": round(base_stats["ManaPerFive"] + (per_level_stats["MP5PerLevel"] * level), 2),
        "PhysicalPower": round(base_stats["PhysicalPower"] + (per_level_stats["PhysicalPowerPerLevel"] * level), 2),
        "PhysicalProtection": round(base_stats["PhysicalProtection"] + (per_level_stats["PhysicalProtectionPerLevel"] * level)),
        "Speed": base_stats["Speed"]
    }

    if ret_stats["PhysicalPower"] > 0:
        ret_stats["BasicAttackDamage"] = ret_stats["PhysicalPower"]
    elif ret_stats["MagicalPower"]:
        ret_stats["BasicAttackDamage"] = ret_stats["MagicalPower"] * (1/5)
    
    return ret_stats


# client = pymongo.MongoClient(
#     "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

# get_god_stats(client, "Agni", 20)

# print(get_worst_matchups_rewrite(client, "Camazotz", "Solo"))

# print(get_top_builds(client, "Achilles", "Solo"))
# print(get_item_data(client, "Ancile"))
# print(get_worst_matchups(client, "Achilles", "Solo"))
# print(get_worst_matchups_by_rank(client, "Vulcan", "Solo", "Grandmaster", req="flask"))
