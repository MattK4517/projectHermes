from re import A, S, X
from datetime import datetime
import re
from main import client
from pymongo.message import kill_cursors
import errlogger as logger
import pymongo
from collections import OrderedDict
from operator import getitem
from math import sqrt
from constants import godsDict, slots, Tier_Three_items, Starter_items, roles, single_combat_stats, single_objective_stats
import analyze_players as anlzpy 

import pyrez
from pyrez.api import SmiteAPI
from pyrez.models import Smite
from pyrez.models.MatchHistory import MatchHistory
# info pull
# [godWR, godPR, godBR] - check, matchesPlayed - check
# relics used
# worst matchups - check
# item breakdown - check

def get_pb_rate(client, god, rank, role, patch, mode="Ranked"):
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
    startime = datetime.now()
    if rank == "Platinum+":
        myquery = { "rank": {"$in": ["Platinum", "Diamond", "Masters", "Grandmaster"]}, "patch": patch, "mode": f"{mode}Conq"}
    elif rank == "Diamond+":
        myquery = { "rank": {"$in":  ["Diamond", "Masters", "Grandmaster"]}, "patch": patch, "mode": f"{mode}Conq"}   
    elif rank != "All Ranks":
        myquery = { "rank": rank, "patch": patch, "mode": f"{mode}Conq"}
    else:
        myquery = { "patch": patch, "mode": f"{mode}Conq"}

    totalMatches = get_total_matches(client, rank, patch, mode)
    godBans = bancol.count_documents(myquery)
    games = get_games_played(client, god, rank, role, patch, mode)
    if totalMatches == 0:
        totalMatches = 1
    return {"godBans": godBans, "totalMatches": totalMatches, "banRate": round(godBans/totalMatches * 100, 2), "pickRate": round(games/totalMatches * 100, 2)}

def get_games_played(client, god, rank, role, patch, mode="Ranked"):
    mydb = client["single_match_stats"]
    mycol = mydb[god]
    if rank == "Platinum+":
        myquery = { "role": role, "rank": {"$in": ["Platinum", "Diamond", "Masters", "Grandmaster"]}, "patch": patch, "mode": f"{mode}Conq"}
    elif rank == "Diamond+":
        myquery = { "role": role, "rank": {"$in":  ["Diamond", "Masters", "Grandmaster"]}, "patch": patch, "mode": f"{mode}Conq"}    
    elif rank != "All Ranks":
        myquery = { "role": role, "rank": rank, "patch": patch, "mode": f"{mode}Conq"}
    else:
        myquery = { "role": role, "patch": patch, "mode": f"{mode}Conq"}
    print(myquery)
    games = mycol.count_documents(myquery)
    return games

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
    item = item.strip()
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

def get_item_data(client, item):
    if item:
        if "S8" in item and item not in ["S8 Magic Shell",
"S8 Magic Shell Upgrade",
"S8 Meditation Cloak",
"S8 Meditation Cloak Upgrade",
"S8 Phantom Veil",
"S8 Phantom Veil Upgrade"]:
            item = item[3:].strip()
        mydb = client["Item_Data"]
        mycol = mydb[item.strip()]
        
        for x in mycol.find():
            itemdata = x

        delKeys = ["_id", "ChildItemId", "ItemTier", "itemIcon_URL"]
        for element in delKeys:
            del itemdata[element]

        #itemdata = {**itemdata, **{"Descriptions": itemdata["ItemDescription"]["Menuitems"][0]["Description"]}, **{"Value1": itemdata["ItemDescription"]["Menuitems"][0]["Value"]}}
        itemdata = {**itemdata}
    else: 
        itemdata = {}
    return itemdata

def get_top_builds(client, god, role, patch, mode="Ranked", rank="All Ranks", data=None):
    top_dict = {slot: {} for slot in slots}
    top_dict = {
        **{f"relic{i+1}": {} for i in range(2)},
        **top_dict
    }
    mydb = client["single_match_stats"]
    mycol = mydb[god]
    if rank == "Platinum+":
        myquery = { "role": role, "rank": {"$in": ["Platinum", "Diamond", "Masters", "Grandmaster"]}, "patch": patch, "mode": f"{mode}Conq"}
    elif rank == "Diamond+":
        myquery = { "role": role, "rank": {"$in":  ["Diamond", "Masters", "Grandmaster"]}, "patch": patch, "mode": f"{mode}Conq"}    
    elif rank != "All Ranks":
        myquery = { "role": role, "rank": rank, "patch": patch, "mode": f"{mode}Conq"}
    else:
        myquery = { "role": role, "patch": patch, "mode": f"{mode}Conq"}

    # print(myquery)
    games = 0
    wins = 0
    if type(data) is list:
        for x in data:
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


    else:
        myquery = {
            **{god: {"$exists": True}},
            **myquery
        }
        for x in mycol.find(myquery, {"_id": 0, god: 1, "win_status": 1}):
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


    if games == 0:
        return {**{}, **{"games": games, "wins": wins, "winRate": 0}} 
    return {**sort_top_dict(dict(top_dict), client), **{"games": games, "wins": wins, "winRate": round(wins/games*100, 2)}}

def sort_top_dict(top_dict, client):
    items = ["item1", "item2"]
    all_dict = {slot: {item: {"item": "", "games": 0 } for item in items} for slot in slots}
    all_dict = {
        **{f"relic{i+1}": {item: {"item": "", "games": 0 } for item in items} for i in range(2)},
        **all_dict
    }
    for slot in top_dict:
        if "slot" in slot:
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

                    elif top_dict[slot][item]["games"] > all_dict[slot]["item2"]["games"]:
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

                    elif top_dict[slot][item]["games"] > all_dict[slot]["item2"]["games"]:
                        all_dict[slot]["item2"] = top_dict[slot][item]
        
        elif "relic" in slot:
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

                elif top_dict[slot][item]["games"] > all_dict[slot]["item2"]["games"]:
                    all_dict[slot]["item2"] = top_dict[slot][item]


    for slot in all_dict.keys():
        for item in all_dict[slot].keys():
            all_dict[slot][item] =  {**all_dict[slot][item], **get_item_data(client, all_dict[slot][item]["item"])}
            all_dict[slot][item]["url"] = get_item(all_dict[slot][item]["item"])


    return all_dict

def get_all_builds(client, god, role, patch, mode="Ranked", rank="All Ranks"):
    top_dict = {slot: {} for slot in slots}
    top_dict = {
        **{f"relic{i+1}": {} for i in range(4)},
        **top_dict
    }
    mydb = client["single_match_stats"]
    mycol = mydb[god]

    if rank == "Platinum+":
        myquery = { "role": role, "rank": {"$in": ["Platinum", "Diamond", "Masters", "Grandmaster"]}, "patch": patch, "mode": f"{mode}Conq"}
    elif rank == "Diamond+":
        myquery = { "role": role, "rank": {"$in":  ["Diamond", "Masters", "Grandmaster"]}, "patch": patch, "mode": f"{mode}Conq"}    
    elif rank != "All Ranks":
        myquery = { "role": role, "rank": rank, "patch": patch, "mode": f"{mode}Conq"}
    else:
        myquery = { "role": role, "patch": patch, "mode": f"{mode}Conq"}

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

            test_sort = OrderedDict(sorted(top_dict[slot].items(),
                key = lambda x: getitem(x[1], "games")))
            top_dict[slot] = dict(test_sort)

    if games == 0:
        games = 1
    return {**dict(top_dict), **{"games": games, "wins": wins, "winRate": round(wins/games*100, 2)}}

def get_worst_matchups(client, god, role, patch, mode="Ranked", rank="All Ranks", player=None):
    mydb = client["single_match_stats"]
    mycol = mydb[god]
    matchup_dict = {}
    if rank == "Platinum+":
        myquery = { "role": role, "rank": {"$in": ["Platinum", "Diamond", "Masters", "Grandmaster"]}, "patch": patch, "mode": f"{mode}Conq"}
    elif rank == "Diamond+":
        myquery = { "role": role, "rank": {"$in":  ["Diamond", "Masters", "Grandmaster"]}, "patch": patch, "mode": f"{mode}Conq"} 
    elif rank != "All Ranks":
        myquery = { "role": role, "rank": rank, "patch": patch, "mode": f"{mode}Conq"}
    else:
        myquery = { "role": role, "patch": patch, "mode": f"{mode}Conq"}

    if player:
        myquery = {**myquery, **{"player":  { "$regex" : f"{player}", "$options": "i" }}}

    if "All" in role:
        del myquery["role"]
    
    print(myquery)
    games = 0
    wins = 0
    # print(myquery)
    for matchup in mycol.find(myquery, {"_id": 0}):
        if player:
            # print(matchup)
            if anlzpy.verify_player(player, matchup["player"], "none", "none"):
                games += 1
                flag = False
                if matchup["enemy"]:
                    if matchup["win_status"] == "Winner":
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
        else:
            games += 1
            flag = False
            if matchup["enemy"]:
                if matchup["win_status"] == "Winner":
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

def get_winrate(client, god, role, patch, mode="Ranked", rank="All Ranks", matchup="None"):
    mydb = client["single_match_stats"]
    mycol = mydb[god]
    if rank == "Platinum+":
        myquery = { "role": role, "rank": {"$in": ["Platinum", "Diamond", "Masters", "Grandmaster"]}, "patch": patch, "mode": f"{mode}Conq"}
    elif rank == "Diamond+":
        myquery = { "role": role, "rank": {"$in":  ["Diamond", "Masters", "Grandmaster"]}, "patch": patch, "mode": f"{mode}Conq"}    
    elif rank != "All Ranks":
        myquery = { "role": role, "rank": rank, "patch": patch, "mode": f"{mode}Conq"}
    else:
        myquery = { "role": role, "patch": patch, "mode": f"{mode}Conq"}

    if matchup != "None":
        myquery = {**myquery, **{"enemy": matchup}}
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

    return {"wins": wins, "games": games, "win_rate": win_rate}


def get_total_matches(client, rank, patch, mode="Ranked"):
    mydb = client["Matches"]
    mycol = mydb["Total_Matches"]
    total_games = 0
    if rank == "Platinum+":
        myquery = {"rank": {"$in": ["Platinum", "Diamond", "Masters", "Grandmaster"]}, "patch": patch, "mode": f"{mode}Conq"}
    elif rank == "Diamond+":
        myquery = { "rank": {"$in":  ["Diamond", "Masters", "Grandmaster"]}, "patch": patch, "mode": f"{mode}Conq"}  
    else:
        myquery = {"rank": rank, "patch": patch, "mode": f"{mode}Conq"}

    for x in mycol.find(myquery, {"Total_Matches": 1, "_id": 0}):
        total_games += x["Total_Matches"]
    return total_games

def get_combat_stats(client, god, role, patch, rank="All Ranks"):
    mydb = client["single_match_stats"]
    mycol = mydb[god]
    combat_stats = {}
    if rank == "Platinum+":
        myquery = { "role": role, "rank": {"$in": ["Platinum", "Diamond", "Masters", "Grandmaster"]}, "patch": patch}
    elif rank == "Diamond+":
        myquery = { "role": role, "rank": {"$in":  ["Diamond", "Masters", "Grandmaster"]}, "patch": patch}    
    elif rank != "All Ranks":
        myquery = { "role": role, "rank": rank, "patch": patch}
    else:
        myquery = { "role": role, "patch": patch}
    
    for x in mycol.aggregate([
        {
            "$match": myquery
        },
        {
            "$group": {
                "_id": "$god",
                "kills": { "$avg": "$kills"},
                "deaths": { "$avg": "$deaths"},
                "damage_": { "$avg": "$damage_player"},
                "damageTaken": { "$avg": "$damage_taken"},
                "damageMitigated": { "$avg": "$damage_mitigated"},
                "healing": { "$avg": "$healing"},
                "selfHealing": { "$avg": "$healing_self"},
                "games": {"$sum": 1},
            }
        }
    ]):
        combat_stats = x
        for key, val in enumerate(combat_stats):
            if type(combat_stats[val]) is float or type(combat_stats[val]) is int:
                combat_stats[val] = round(combat_stats[val], 2)

    return combat_stats

def get_objective_stats(client, god, role, patch, rank="All Ranks"):
    mydb = client["single_match_stats"]
    mycol = mydb[god]
    if rank == "Platinum+":
        myquery = { "role": role, "rank": {"$in": ["Platinum", "Diamond", "Masters", "Grandmaster"]}, "patch": patch}
    elif rank == "Diamond+":
        myquery = { "role": role, "rank": {"$in":  ["Diamond", "Masters", "Grandmaster"]}, "patch": patch}    
    elif rank != "All Ranks":
        myquery = { "role": role, "rank": rank, "patch": patch}
    else:
        myquery = { "role": role, "patch": patch}
    combat_stats = {}
    for x in mycol.aggregate([
        {
            "$match": myquery
        },
        {
            "$group": {
                "_id": "$god",
                "gold": { "$avg": "$gold"},
                "damageBot": { "$avg": "$damage_bot"},
                "killsBot": { "$avg": "$kills_bot"},
                "towerKills": { "$avg": "$tower_kills"},
                "phoenixKills": { "$avg": "$phoenix_kills"},
                "towerDamage": { "$avg": "$tower_damage"},
                "wardsPlaced": { "$avg": "$wards_placed"},
                "games": {"$sum": 1},
            }
        }
    ]):
        # print(x)
        combat_stats = x
        for key, val in enumerate(combat_stats):
            if type(combat_stats[val]) is float or type(combat_stats[val]) is int:
                combat_stats[val] = round(combat_stats[val], 2)

    # del combat_stats["_id"]
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

# def calc_hardcarry_score():
    # Gold Share your % of the teams gold
    # Damage Share your % of the teams damage
    # Lane Level Diff
def get_carry_score(match):
    ret_data = {
        "goldScore":
            {
            "Winner": {
                "totalGold": 1,
            },
            "Loser": {
                "totalGold": 1,
            }
        },
        "damageScore":  {
            "Winner": {
                "totalDamage": 1,
            },
            "Loser": {
                "totalDamage": 1,
            }
        },
        "levelDiff": {
            "Winner": {
            },
            "Loser": {
            }
        },
        "killPart": {
        "Winner": {
            "totalKills": 0,
        },
        "Loser": {
            "totalKills": 0,
        }
    }
    }
    match_roles = []

    for key in match:
        if "player" in key:
            match_roles.append(match[key]["Role"])
    if check_roles(match_roles):
        for key in match:
            try:
                if "player" in key:
                    ret_data["goldScore"][match[key]["Win_Status"]]["totalGold"] += match[key]["Gold_Earned"]
                    ret_data["damageScore"][match[key]["Win_Status"]]["totalDamage"] += match[key]["Damage_Player"]
                    ret_data["levelDiff"][match[key]["Win_Status"]][match[key]["Role"]] = {"level": match[key]["Final_Match_Level"]}
                    ret_data["killPart"][match[key]["Win_Status"]]["totalKills"] += match[key]["Kills_Player"]

                    # for side in ret_data["levelDiff"]:
                    #     for role in ret_data["levelDiff"][side]:
                    #         if side == "Winner":
                    #             opp_side = "Loser"
                    #         elif side == "Loser":
                    #             opp_side = "Winner"
                    #         ret_data["levelDiff"][side][role]["level_diff"] = ret_data["levelDiff"][side][role]["level"] - ret_data["levelDiff"][opp_side][role]["level"]
                    for key in match:
                        if "player" in key and ret_data["killPart"][match[key]["Win_Status"]]["totalKills"] <= 0:
                            ret_data["killPart"][match[key]["Win_Status"]][match[key]["Role"]] = {"kills": match[key]["Kills_Player"], "assists": match[key]["Assists"], "killShare": 0}
                        elif "player" in key:
                            ret_data["killPart"][match[key]["Win_Status"]][match[key]["Role"]] = {"kills": match[key]["Kills_Player"], "assists": match[key]["Assists"],
                            "killShare": round((match[key]["Kills_Player"] + match[key]["Assists"]) / ret_data["killPart"][match[key]["Win_Status"]]["totalKills"]* 100, 2)}

                        if "player" in key:
                            ret_data["goldScore"][match[key]["Win_Status"]][match[key]["Role"]] = {"gold": match[key]["Gold_Earned"],
                                        "goldShare": round(match[key]["Gold_Earned"] / ret_data["goldScore"][match[key]["Win_Status"]]["totalGold"]* 100, 2)}
                            ret_data["damageScore"][match[key]["Win_Status"]][match[key]["Role"]] = {"damage": match[key]["Damage_Player"],
                                        "damageShare": round(match[key]["Damage_Player"] / ret_data["damageScore"][match[key]["Win_Status"]]["totalDamage"]* 100, 2)}
            except ZeroDivisionError:
                # print(ret_data)
                pass
    else:
        print(f"ERROR IN: {match['MatchId']}")
    return ret_data

def get_average_gold_share(average_gold_share):
    # average_gold_share = {role: {"goldShare": 0} for role in roles}
    # for team in data["carryScore"]:
    #     for role in data["carryScore"][team]:
    #         if role in roles:
    #             average_gold_share[role]["goldShare"] += data["carryScore"][team][role]["goldShare"]

    for role in average_gold_share:
        average_gold_share[role]["goldShare"] = round(average_gold_share[role]["goldShare"] / 2, 2)
    return average_gold_share

def get_gold_eff(kill_part, gold_eff):
    ret_data = {
        "Winner": {
        },
        "Loser": {
        }
    }
    match_roles = []
    for team in kill_part:
        for role in kill_part[team]:
            if role in roles:
                match_roles.append(role)

    if check_roles(match_roles):
        for team in kill_part:
            for role in kill_part[team]:
                if role in roles:
                    ret_data[team][role] = {"efficiency": round(kill_part[team][role]["killShare"]/gold_eff[team][role]["goldShare"], 2)}
    return ret_data


def check_roles(match_roles):
    # print(match_roles)
    match_roles.sort()
    if match_roles != ['Carry', 'Carry', 'Jungle', 'Jungle', 'Mid', 'Mid', 'Solo', 'Solo', 'Support', 'Support']:
        return False
    return True

def get_tier(win_rate, pick_rate, ban_rate):
    tier = (win_rate) + (pick_rate) + (.5 * ban_rate)
    if tier < 55:
        tier_letter = "D"

    elif tier < 57:
        tier_letter = "A"

    elif tier < 59:
        tier_letter = "S"

    else:
        tier_letter = "S+"

    return tier_letter

def get_specific_build(client, god, role, patch, matchup, rank="All Ranks", mode="Ranked"):
    mydb = client["single_match_stats"]
    mycol = mydb[god]
    match_ids = []
    if "All" in rank:
        myquery = {"enemy": matchup, "patch": patch, "role": role, "mode": f"{mode}Conq"}
    else:
        myquery = {"enemy": matchup, "patch": patch, "role": role, "rank": rank,  "mode": f"{mode}Conq"}

    for x in mycol.find(myquery, {"_id": 0}):
        match_ids.append(x["matchId"])

    builds = []
    itemsdb = client["single_match_stats"]
    itemscol = itemsdb[god]
    games = 0
    for x in itemscol.aggregate([
        {
                "$match": {"matchId": {"$in": match_ids}},
        },
        ]
    ):
        builds.append({**{god: x[god]}, **{"win_status": x["win_status"]}})


    return get_top_builds(client, god, role, patch, rank=rank, data=builds)

def get_matchups_stats(client, god: str, role: str, patch, mode, rank="All Ranks"):
    mydb = client["single_match_stats"]
    mycol = mydb[god]
    if "All" in rank:
        myquery = {"role": role, "patch": patch, "mode": f"{mode}Conq"}
    else:
        myquery = {"role": role, "patch": patch,
                   "rank": rank, "mode": f"{mode}Conq"}

    avg_dmg_dict = {}
    total_games = mycol.count_documents(myquery)
    for x in mycol.aggregate([
        {
            "$match": myquery
        },
        {
            "$group": {
                "_id": "$enemy",
                "avg_dmg_diff": {"$avg": "$damage_player"},
                "avg_kill_diff": {"$avg": "$kills"},
                "avg_gold_diff": {"$avg": "$gold"},
                "timesPlayed": {"$sum": 1},
            }
        }
    ]):
        # wins = matchupscol.count_documents({**myquery, **{"enemy": x["_id"], "win_status": "Winner"}})
        if "All" in rank:
            wins = mycol.count_documents(
                {"enemy": x["_id"], "win_status": "Winner", "patch": patch, "role": role, "mode": f"{mode}Conq"})
        else:
            wins = mycol.count_documents(
                {"enemy": x["_id"], "win_status": "Winner", "patch": patch, "rank": rank, "role": role, "mode": f"{mode}Conq"})

        if x["timesPlayed"] >= .01 * total_games:
            avg_dmg_dict[x["_id"]] = {
                "dmg": x["avg_dmg_diff"],
                "kills": x["avg_kill_diff"],
                "gold": x["avg_gold_diff"],
                "wr": round(wins/x["timesPlayed"]*100, 2),
                "games": x["timesPlayed"],
            }

    myquery = {**myquery, **{"enemy": god}}
    for god in avg_dmg_dict:
        mycol = mydb[god]
        for x in mycol.aggregate([
            {
                "$match": myquery
            },
            {
                "$group": {
                    "_id": "$enemy",
                    "avg_dmg_diff": {"$avg": "$damage_player"},
                    "avg_kill_diff": {"$avg": "$kills"},
                    "avg_gold_diff": {"$avg": "$gold"},
                }
            },
        ]):
            avg_dmg_dict[god]["god"] = god
            avg_dmg_dict[god]["dmg"] -= x["avg_dmg_diff"]
            avg_dmg_dict[god]["kills"] -= x["avg_kill_diff"]
            avg_dmg_dict[god]["gold"] -= x["avg_gold_diff"]

    return avg_dmg_dict

def get_build_path(client, god, role, patch, mode, rank="All Ranks"):
    mydb = client["single_match_stats"]
    mycol = mydb[god]
    index = 0
    games = 0
    builds = {}
    if "All" not in rank:
        myquery = {"role": role, "patch": patch, "rank": rank, "mode": f"{mode}Conq"}
    else:
        myquery = {"role": role, "patch": patch, "mode": f"{mode}Conq"}


    for x in mycol.aggregate(
        [
            {
                "$match": myquery,
            },
            {
                "$group": {
                    "_id": {
                        "slot1": f"${god}.slot1",
                        "slot2": f"${god}.slot2",
                        "slot3": f"${god}.slot3",
                        "win_status": "$win_status",
                    },
                    "count": {"$sum": 1},
                }
            },
            {"$sort": {"count": 1}},
        ]
    ):
        games += x["count"]
        if "{},{},{}".format(x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"]) not in builds.keys():
            builds["{},{},{}".format(x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"])] = {
                "slot1": x["_id"]["slot1"],
                "slot2": x["_id"]["slot2"],
                "slot3": x["_id"]["slot3"],
                "wins": 0,
                "losses": 0,
                }
        if x["_id"]["win_status"] == "Winner":
            builds["{},{},{}".format(x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"])]["wins"] += x["count"]
        elif x["_id"]["win_status"] == "Loser":
            builds["{},{},{}".format(x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"])]["losses"] += x["count"]
        index += 1
    print(builds)
    top_five = {}
    for x in list(builds)[-10:]:
            for key in builds[x].keys():
                    if "slot" in key:
                            builds[x][key] = get_item_data(client, builds[x][key])
            top_five[x] = builds[x]

    test_sort = OrderedDict(sorted(top_five.items(),
            key = lambda x: getitem(x[1], "wins")))
    builds = dict(test_sort)

    return builds

def get_lanes(client):
    duodb = client["Duo_Tierlist"]
    duocol = duodb["8.11 Matches"]
    lanes = {}
    myquery = {"Patch": {"$exists": True}}
    winning_lanes = []
    for x in duocol.aggregate(
            [
                {
                    "$match": myquery,
                },
                {
                    "$group": {
                        "_id": {
                            "carry": "$winningCarry",
                            "support": "$winningSupport",
                        },
                        "winningCarryWR": {"$avg": "$carryWinRate"},
                        "winningSupportWR": {"$avg": "$supportWinRate"},
                        "count": {"$sum": 1},
                    }
                },
                {"$sort": {"count": 1}},
            ]
            ):
                winning_lanes.append(x)

    losing_lanes = []
    for x in duocol.aggregate(
            [
                {
                    "$match": myquery,
                },
                {
                    "$group": {
                        "_id": {
                            "carry": "$losingCarry",
                            "support": "$losingSupport",

                        },
                        "winningCarryWR": {"$avg": "$carryWinRate"},
                        "winningSupportWR": {"$avg": "$supportWinRate"},
                        "count": {"$sum": 1},
                    },
                },
                {"$sort": {"count": 1}},
            ]
            ):
                losing_lanes.append(x)
    god_wrs = {"carry": {}, "support": {}}
    for winning_duo in winning_lanes:
        for losing_duo in losing_lanes:
            if winning_duo["count"] + losing_duo["count"] > 150:
                if winning_duo["_id"] == losing_duo["_id"]:
                    # if winning_duo["winningCarryWR"] > 100 or winning_duo["winningSupportWR"] > 100:
                    #     print(winning_duo)
                    # if winning_duo["_id"]["carry"] not in god_wrs["carry"]:
                    #     carryWinRate = winning_duo["winningCarryWR"]
                    #     god_wrs["carry"][winning_duo["_id"]["carry"]] = winning_duo["winningCarryWR"]
                    # else:
                    #     carryWinRate = god_wrs["carry"][winning_duo["_id"]["carry"]]

                    # if winning_duo["_id"]["support"] not in god_wrs["support"]:
                    #     supportWinRate = winning_duo["winningSupportWR"]
                    #     god_wrs["support"][winning_duo["_id"]["support"]] = winning_duo["winningSupportWR"]
                    # else:
                    #     supportWinRate = god_wrs["support"][winning_duo["_id"]["support"]]

                    syneryFactor = round(winning_duo["count"]/(winning_duo["count"]+losing_duo["count"])*100, 2) - sqrt(winning_duo["winningCarryWR"]* winning_duo["winningSupportWR"])
                    lanes[str(winning_duo["_id"]["carry"]) + str(winning_duo["_id"]["support"])] = {
                        **winning_duo,
                        **{"losses": losing_duo["count"], "winRate": round(winning_duo["count"]/(winning_duo["count"]+losing_duo["count"])*100, 2) },
                        **{"carryWinRate": winning_duo["winningCarryWR"], "supportWinRate": winning_duo["winningSupportWR"], "syneryFactor": syneryFactor},
                        }
    return lanes

if __name__ == "__main__":
    print(get_games_played(client, "Bellona", "All Ranks", "Solo", "9.1"))
    pass
    # print(get_worst_matchups(client, "Bellona", "Carry", "9.1", player="AleksEnglish"))