from re import S, X
from datetime import datetime
import re

from pymongo.message import kill_cursors
import errlogger as logger
import pymongo
from collections import OrderedDict
from operator import getitem
from constants import godsDict, slots, Tier_Three_items, Starter_items, roles

# info pull
# [godWR, godPR, godBR] - check, matchesPlayed - check
# relics used 
# worst matchups - check
# item breakdown - check

def get_pb_rate(client, god, rank, role, patch):
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
    totalMatches = get_total_matches(client, rank, patch)
    if rank == "All Ranks":
        myquery = {"patch": patch}
    else:
        myquery = {"patch": patch, "rank": rank}

    godBans = bancol.count_documents(myquery)
    games = get_games_played(client, god, rank, role, patch)
    if totalMatches == 0:
        totalMatches = 1
    return {"godBans": godBans, "totalMatches": totalMatches, "banRate": round(godBans/totalMatches * 100, 2), "pickRate": round(games/totalMatches * 100, 2)}

def get_games_played(client, god, rank, role, patch):
    mydb = client["single_items"]
    mycol = mydb[god]
    if rank == "All Ranks":
        myquery = {"patch": patch, "role_played": role}
    else:
        myquery = {"patch": patch, "rank": rank, "role_played": role}
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
        mydb = client["Item_Data"]
        mycol = mydb[item]
        for x in mycol.find():
            itemdata = x

        delKeys = ["_id", "ActiveFlag", "ChildItemId", "IconId", "ItemId", "ItemTier", 
            "RootItemId", "StartingItem", "Type", "itemIcon_URL", "ret_msg"]
        for element in delKeys:
            del itemdata[element]

        #itemdata = {**itemdata, **{"Descriptions": itemdata["ItemDescription"]["Menuitems"][0]["Description"]}, **{"Value1": itemdata["ItemDescription"]["Menuitems"][0]["Value"]}}
        itemdata = {**itemdata, **{"itemStats": itemdata["ItemDescription"]["Menuitems"]}}
    else: 
        itemdata = {}
    return itemdata

def get_top_builds(client, god, role, patch, rank="All Ranks", data=None):
    top_dict = {slot: {} for slot in slots}
    mydb = client["single_items"]
    mycol = mydb[god]
    if rank != "All Ranks":
        myquery = { "role_played": role, "rank": rank, "patch": patch}
    else:
        myquery = { "role_played": role, "patch": patch}
    
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

            
    return {**sort_top_dict(dict(top_dict), client), **{"games": games, "wins": wins, "winRate": round(wins/games*100, 2)}}

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

def get_all_builds(client, god, role, patch, rank="All Ranks"):
    top_dict = {slot: {} for slot in slots}
    mydb = client["single_items"]
    mycol = mydb[god]
    if rank != "All Ranks":
        myquery = { "role_played": role, "rank": rank, "patch": patch}
    else:
        myquery = { "role_played": role, "patch": patch}
    
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
            
    return {**dict(top_dict), **{"games": games, "wins": wins, "winRate": round(wins/games*100, 2)}}

def get_worst_matchups(client, god, role, patch, rank="All Ranks"):
    mydb = client["single_matchups"]
    mycol = mydb[god]
    matchup_dict = {}
    if rank != "All Ranks":
        myquery = { "role_played": role, "rank": rank, "patch": patch}
    else:
        myquery = { "role_played": role, "patch": patch}


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

def get_winrate(client, god, role, patch, rank="All Ranks"):
    mydb = client["single_items"]
    mycol = mydb[god]
    if rank != "All Ranks":
        myquery = { "role_played": role, "rank": rank, "patch": patch}
    else:
        myquery = { "role_played": role, "patch": patch}

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


def get_total_matches(client, rank, patch):
    mydb = client["Matches"]
    mycol = mydb["Total_Matches"]
    total_games = 0
    myquery = {"rank": rank, "patch": patch}
    for x in mycol.find(myquery, {"Total_Matches": 1, "_id": 0}):
        total_games = x["Total_Matches"]
    return total_games

def get_combat_stats(client, god, role, patch, rank="All Ranks"):
    mydb = client["single_combat_stats"]
    mycol = mydb[god]
    if rank != "All Ranks":
        myquery = { "role": role, "rank": rank, "patch": patch}
    else:
        myquery = { "role": role, "patch": patch}
    
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

# def calc_hardcarry_score():
    # Gold Share your % of the teams gold
    # Damage Share your % of the teams damage
    # Lane Level Diff 
def get_carry_score(match):
    ret_data = {
        "goldScore":
            {
            "Winner": {
                "totalGold": 0,
            },
            "Loser": {
                "totalGold": 0,
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
            ret_data["goldScore"][match[key]["Win_Status"]]["totalGold"] += match[key]["Gold_Earned"]
            ret_data["damageScore"][match[key]["Win_Status"]]["totalDamage"] += match[key]["Damage_Player"]
            ret_data["levelDiff"][match[key]["Win_Status"]][match[key]["Role"]] = {"level": match[key]["Final_Match_Level"]}
            ret_data["killPart"][match[key]["Win_Status"]]["totalKills"] += match[key]["Kills_Player"]
            match_roles.append(match[key]["Role"])
    
    if check_roles(match_roles):
        for side in ret_data["levelDiff"]:
            for role in ret_data["levelDiff"][side]:
                if side == "Winner":
                    opp_side = "Loser"
                elif side == "Loser":
                    opp_side = "Winner"
                ret_data["levelDiff"][side][role]["level_diff"] = ret_data["levelDiff"][side][role]["level"] - ret_data["levelDiff"][opp_side][role]["level"]
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

def get_specific_build(client, god, role, patch, matchup, rank="All Ranks"):
    mydb = client["single_matchups"]
    mycol = mydb[god]
    match_ids = []
    if "All" in rank:
        myquery = {"enemy": matchup, "patch": patch, "role_played": role}
    else:
        myquery = {"enemy": matchup, "patch": patch, "role_played": role, "rank": rank}
    for x in mycol.find(myquery, {"_id": 0}):
        match_ids.append(x["matchId"])

    builds = []
    itemsdb = client["single_items"]
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
# if __name__ == "__main__":
#     client = pymongo.MongoClient(
#         "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")
#     print(get_winrate(client, "Achilles", "Solo", "8.10"))
#     print(get_pb_rate(client, "Achilles", "All Ranks", "Solo", "8.10"))

# print(get_worst_matchups_rewrite(client, "Camazotz", "Solo"))

# print(get_top_builds(client, "Achilles", "Solo"))
# print(get_item_data(client, "Ancile"))
# print(get_worst_matchups(client, "Achilles", "Solo"))
# print(get_worst_matchups_by_rank(client, "Vulcan", "Solo", "Grandmaster", req="flask"))
