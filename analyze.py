from audioop import avg
from re import A, M, S, X
from datetime import datetime
import re
from main import client
from pymongo.message import kill_cursors
import errlogger as logger
import pymongo
from collections import OrderedDict
from operator import getitem
from math import sqrt
from constants import (
    godsDict,
    slots,
    Tier_Three_items,
    Starter_items,
    roles,
    single_combat_stats,
    single_objective_stats,
    ranks,
    Assassins,
    Guardians,
    Warriors,
    Mages,
    Hunters,
    single_stats,
)
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


def get_query(rank, role, patch, queue_type, mode):
    if rank == "Platinum+":
        myquery = {
            "rank": {"$in": ["Platinum", "Diamond", "Masters", "Grandmaster"]},
            "patch": patch,
            "queue_type": f"{queue_type}",
        }
    elif rank == "Diamond+":
        myquery = {
            "rank": {"$in": ["Diamond", "Masters", "Grandmaster"]},
            "patch": patch,
            "queue_type": f"{queue_type}",
        }
    elif rank != "All Ranks":
        myquery = {"rank": rank, "patch": patch, "queue_type": f"{queue_type}"}
    else:
        myquery = {"patch": patch, "queue_type": f"{queue_type}"}

    if "All" not in role:
        myquery["role"] = role
    myquery["mode"] = mode

    if patch == "All Patches":
        del myquery["patch"]

    if mode != "Conquest" and "role" in myquery.keys():
        del myquery["role"]

    if role == "" and "role" in myquery:
        del myquery["role"]

    return myquery


def return_pipeline(god, rank, role, patch, queue_type, mode):
    if god:
        myquery = get_query(rank, role, patch, queue_type, mode)
        if "rank" in myquery:
            if "$in" in myquery["rank"]:
                myquery["rank"] = myquery["rank"]["$in"]
        filter_list = [
            {"text": {"query": myquery[key], "path": key}} for key in myquery
        ]
        filter_list.append({"text": {"query": god, "path": "god"}})
        mypipeline = {"$search": {"compound": {"filter": filter_list}}}
    else:
        mypipeline = {
            "$search": {
                "compound": {"filter": {"text": {"query": "none", "path": "rank"}}}
            }
        }
    return mypipeline


def get_pb_rate(client, god, rank, role, patch, queue_type="Ranked", mode="Conquest"):
    """# need to grab # of matches played by god, number of matches played, number of bans
    Args:
        client ([type]): [description]
        god ([type]): [description]
        role ([type]): [description]`
    """
    god = god.replace("_", " ")
    totalMatches = 0
    godBans = 0
    bandb = client["single_god_bans"]
    bancol = bandb[god]
    myquery = get_query(rank, role, patch, queue_type, mode)

    totalMatches = get_total_matches(
        client, rank, patch, queue_type=queue_type, mode=mode
    )
    print(totalMatches)
    # if "All" not in rank:
    #     totalMatches = totalMatches / 10

    if "role" in myquery.keys():
        del myquery["role"]
    del myquery["queue_type"]
    godBans = bancol.count_documents(myquery)
    games = get_games_played(
        client, god, rank, role, patch, queue_type=queue_type, mode=mode
    )
    if totalMatches == 0:
        totalMatches = 1
    return {
        "godBans": godBans,
        "totalMatches": totalMatches,
        "banRate": round(godBans / totalMatches * 100, 2),
        "pickRate": round(games / totalMatches * 100, 2),
    }


def get_games_played(
    client, god, rank, role, patch, queue_type="Ranked", mode="Conquest"
):
    games = 0
    mydb = client["single_match_stats"]
    mycol = mydb[patch + "-" + mode + "-" + queue_type]
    mypipeline = return_pipeline(god, rank, role, patch, queue_type, mode)
    for x in mycol.aggregate(
        [mypipeline, {"$group": {"_id": "$god", "count": {"$sum": 1}}}]
    ):
        games = x["count"]
    return games


def get_url(god):
    god = god.replace("_", " ")
    god = god.replace(" ", "-")
    if god == "Chang'e":
        god = "change"
    url = "https://webcdn.hirezstudios.com/smite/god-icons/{}.jpg".format(god.lower())
    return url


def get_abilities(client, god):
    god = god.replace("_", " ")
    mydb = client["URLS"]
    mycol = mydb[god]
    for x in mycol.find():
        abDict = x
    del abDict["_id"]
    abilities = {}
    for x in range(len(abDict["Abilities"])):
        abilities["Ability{}".format(x + 1)] = {
            "name": abDict["Abilities"][x],
            "url": abDict["Abilities_urls"][x],
        }
    return abilities


def get_item(item):
    item = item.strip()
    item = item.replace("_", " ")
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
        if "S8" in item and item not in [
            "S8 Magic Shell",
            "S8 Magic Shell Upgrade",
            "S8 Meditation Cloak",
            "S8 Meditation Cloak Upgrade",
            "S8 Phantom Veil",
            "S8 Phantom Veil Upgrade",
        ]:
            item = item[3:].strip()
        mydb = client["Item_Data"]
        mycol = mydb[item.strip()]

        for x in mycol.find():
            itemdata = x

        delKeys = ["_id", "ChildItemId", "ItemTier", "itemIcon_URL"]
        for element in delKeys:
            del itemdata[element]

        # itemdata = {**itemdata, **{"Descriptions": itemdata["ItemDescription"]["Menuitems"][0]["Description"]}, **{"Value1": itemdata["ItemDescription"]["Menuitems"][0]["Value"]}}
        itemdata = {**itemdata}
    else:
        itemdata = {}
    return itemdata


def get_top_builds(
    client,
    god,
    role,
    patch,
    queue_type="Ranked",
    rank="All Ranks",
    mode="Conquest",
    data=None,
):
    top_dict = {slot: {} for slot in slots}
    top_dict = {**{f"relic{i+1}": {} for i in range(2)}, **top_dict}
    mydb = client["single_match_stats"]
    mycol = mydb[patch + "-" + mode + "-" + queue_type]
    games = 0
    wins = 0
    mypipeline = return_pipeline(god, rank, role, patch, queue_type, mode)
    if type(data) is list:
        for x in data:
            games += 1
            flag = False
            if x["win_status"] == "Winner":
                wins += 1
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
        for x in mycol.aggregate(
            [
                mypipeline,
                {"$project": {god: 1, "build": 1, "win_status": 1, "_id": 0, "god": 1}},
            ]
        ):
            if x["god"] == god:
                games += 1
                flag = False
                if x["win_status"] == "Winner":
                    wins += 1
                    flag = True
                if god in x.keys() and x[god].keys():
                    for slot in x[god].keys():
                        item = x[god][slot]
                        if item:
                            if item not in top_dict[slot].keys():
                                if flag:
                                    top_dict[slot][item] = {
                                        "item": item,
                                        "games": 1,
                                        "wins": 1,
                                    }
                                else:
                                    top_dict[slot][item] = {
                                        "item": item,
                                        "games": 1,
                                        "wins": 0,
                                    }
                            elif item in top_dict[slot].keys():
                                top_dict[slot][item]["games"] += 1
                                if flag:
                                    top_dict[slot][item]["wins"] += 1
                elif "build" in x.keys():
                    for slot in x["build"].keys():
                        item = x["build"][slot]
                        if item:
                            if item not in top_dict[slot].keys():
                                if flag:
                                    top_dict[slot][item] = {
                                        "item": item,
                                        "games": 1,
                                        "wins": 1,
                                    }
                                else:
                                    top_dict[slot][item] = {
                                        "item": item,
                                        "games": 1,
                                        "wins": 0,
                                    }
                            elif item in top_dict[slot].keys():
                                top_dict[slot][item]["games"] += 1
                                if flag:
                                    top_dict[slot][item]["wins"] += 1

    if games == 0:
        return {**{}, **{"games": games, "wins": wins, "winRate": 0}}
    return {
        **sort_top_dict(dict(top_dict), client),
        **{"games": games, "wins": wins, "winRate": round(wins / games * 100, 2)},
    }


def sort_top_dict(top_dict, client):
    items = ["item1", "item2"]
    all_dict = {
        slot: {item: {"item": "", "games": 0} for item in items} for slot in slots
    }
    all_dict = {
        **{
            f"relic{i+1}": {item: {"item": "", "games": 0} for item in items}
            for i in range(2)
        },
        **all_dict,
    }
    for slot in top_dict:
        if "slot" in slot:
            for item in top_dict[slot]:
                if (
                    item in Tier_Three_items or item in Starter_items
                ) and slot != "slot1":
                    if not all_dict[slot]["item1"]["item"]:
                        all_dict[slot]["item1"] = top_dict[slot][item]

                    elif (
                        all_dict[slot]["item1"]["games"] < top_dict[slot][item]["games"]
                    ):
                        all_dict[slot]["item2"] = all_dict[slot]["item1"]
                        all_dict[slot]["item1"] = top_dict[slot][item]

                    elif (
                        all_dict[slot]["item1"]["games"]
                        == top_dict[slot][item]["games"]
                    ):
                        if (
                            all_dict[slot]["item1"]["wins"]
                            > top_dict[slot][item]["wins"]
                        ):
                            all_dict[slot]["item2"] == top_dict[slot][item]
                        else:
                            all_dict[slot]["item2"] = all_dict[slot]["item1"]
                            all_dict[slot]["item1"] = top_dict[slot][item]

                    elif not all_dict[slot]["item2"]["item"]:
                        all_dict[slot]["item2"] = top_dict[slot][item]

                    elif (
                        top_dict[slot][item]["games"] > all_dict[slot]["item2"]["games"]
                    ):
                        all_dict[slot]["item2"] = top_dict[slot][item]
                elif slot == "slot1":
                    if not all_dict[slot]["item1"]["item"]:
                        all_dict[slot]["item1"] = top_dict[slot][item]

                    elif (
                        all_dict[slot]["item1"]["games"] < top_dict[slot][item]["games"]
                    ):
                        all_dict[slot]["item2"] = all_dict[slot]["item1"]
                        all_dict[slot]["item1"] = top_dict[slot][item]

                    elif (
                        all_dict[slot]["item1"]["games"]
                        == top_dict[slot][item]["games"]
                    ):
                        if (
                            all_dict[slot]["item1"]["wins"]
                            > top_dict[slot][item]["wins"]
                        ):
                            all_dict[slot]["item2"] == top_dict[slot][item]
                        else:
                            all_dict[slot]["item2"] = all_dict[slot]["item1"]
                            all_dict[slot]["item1"] = top_dict[slot][item]

                    elif not all_dict[slot]["item2"]["item"]:
                        all_dict[slot]["item2"] = top_dict[slot][item]

                    elif (
                        top_dict[slot][item]["games"] > all_dict[slot]["item2"]["games"]
                    ):
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
            all_dict[slot][item] = {
                **all_dict[slot][item],
                **get_item_data(client, all_dict[slot][item]["item"]),
            }
            # all_dict[slot][item]["url"] = get_item(all_dict[slot][item]["item"])

    return all_dict


def get_all_builds(
    client, god, role, patch, queue_type="Ranked", rank="All Ranks", mode="Conquest"
):
    top_dict = {slot: {} for slot in slots}
    top_dict = {**{f"relic{i+1}": {} for i in range(4)}, **top_dict}
    mydb = client["single_match_stats"]
    mycol = mydb[patch + "-" + mode + "-" + queue_type]
    games = 0
    wins = 0
    mypipeline = return_pipeline(god, rank, role, patch, queue_type, mode)
    for x in mycol.aggregate(
        [mypipeline, {"$project": {"_id": 0, god: 1, "build": 1, "win_status": 1}}]
    ):
        games += 1
        flag = False
        if x["win_status"] == "Winner":
            wins += 1
            flag = True
        if "build" in x.keys():
            for slot in x["build"].keys():
                item = x["build"][slot]
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

                test_sort = OrderedDict(
                    sorted(top_dict[slot].items(), key=lambda x: getitem(x[1], "games"))
                )
                top_dict[slot] = dict(test_sort)
    if games == 0:
        games = 1
    return {
        **dict(top_dict),
        **{"games": games, "wins": wins, "winRate": round(wins / games * 100, 2)},
    }


def get_worst_matchups(
    client,
    god,
    role,
    patch,
    queue_type="Ranked",
    rank="All Ranks",
    mode="Conquest",
    player=None,
):
    mydb = client["single_match_stats"]
    mycol = mydb[patch + "-" + mode + "-" + queue_type]
    matchup_dict = {}

    if player:
        myquery = {**myquery, **{"player": {"$regex": f"{player}", "$options": "i"}}}

    if "All" in role and "role" in myquery.keys():
        del myquery["role"]

    games = 0
    wins = 0
    mypipeline = return_pipeline(god, rank, role, patch, queue_type, mode)
    for matchup in mycol.aggregate(
        [
            mypipeline,
            {"$project": {"_id": 0, "enemy": 1, "enemies": 1, "win_status": 1}},
        ]
    ):
        if player:
            # #print(matchup)
            if anlzpy.verify_player(player, matchup["player"], "none", "none"):
                games += 1
                flag = False
                if matchup["enemy"]:
                    if matchup["win_status"] == "Winner":
                        flag = True
                        wins += 1
                    if matchup["enemy"] not in matchup_dict:
                        if flag:
                            matchup_dict[matchup["enemy"]] = {
                                "enemy": matchup["enemy"],
                                "games": 1,
                                "wins": 1,
                            }
                        else:
                            matchup_dict[matchup["enemy"]] = {
                                "enemy": matchup["enemy"],
                                "games": 1,
                                "wins": 0,
                            }
                    else:
                        if flag:
                            matchup_dict[matchup["enemy"]]["games"] += 1
                            matchup_dict[matchup["enemy"]]["wins"] += 1
                        else:
                            matchup_dict[matchup["enemy"]]["games"] += 1
        else:
            games += 1
            flag = False
            if mode in ["Conquest", "Duel"]:
                if matchup["enemy"]:
                    if matchup["win_status"] == "Winner":
                        flag = True
                        wins += 1
                    if matchup["enemy"] not in matchup_dict:
                        if flag:
                            matchup_dict[matchup["enemy"]] = {
                                "enemy": matchup["enemy"],
                                "games": 1,
                                "wins": 1,
                            }
                        else:
                            matchup_dict[matchup["enemy"]] = {
                                "enemy": matchup["enemy"],
                                "games": 1,
                                "wins": 0,
                            }
                    else:
                        if flag:
                            matchup_dict[matchup["enemy"]]["games"] += 1
                            matchup_dict[matchup["enemy"]]["wins"] += 1
                        else:
                            matchup_dict[matchup["enemy"]]["games"] += 1

            elif mode not in ["Conquest", "Duel"]:
                for enemy in matchup["enemies"]:
                    if enemy:
                        if matchup["win_status"] == "Winner":
                            flag = True
                            wins += 1
                        if enemy not in matchup_dict:
                            if flag:
                                matchup_dict[enemy] = {
                                    "enemy": enemy,
                                    "games": 1,
                                    "wins": 1,
                                }
                            else:
                                matchup_dict[enemy] = {
                                    "enemy": enemy,
                                    "games": 1,
                                    "wins": 0,
                                }
                        else:
                            if flag:
                                matchup_dict[enemy]["games"] += 1
                                matchup_dict[enemy]["wins"] += 1
                            else:
                                matchup_dict[enemy]["games"] += 1

    for matchup in matchup_dict:
        matchup_dict[matchup]["winRate"] = round(
            matchup_dict[matchup]["wins"] / matchup_dict[matchup]["games"] * 100, 2
        )

    test_sort = OrderedDict(
        sorted(matchup_dict.items(), key=lambda x: getitem(x[1], "winRate"))
    )

    min_games = games * 0.01

    to_remove = []
    for key in test_sort:
        if test_sort[key]["games"] < min_games:
            to_remove.append(key)

    for god in to_remove:
        test_sort.pop(god)

    # for key in test_sort.keys():
    #     test_sort[key]["url"] = get_url(key)

    if games == 0:
        games = 1

    return {
        **test_sort,
        **{"games": games, "wins": wins, "winRate": round(wins / games * 100, 2)},
    }


def get_winrate(
    client,
    god,
    role,
    patch,
    queue_type="Ranked",
    rank="All Ranks",
    mode="Conquest",
    matchup="None",
):
    mydb = client["single_match_stats"]
    mycol = mydb[patch + "-" + mode + "-" + queue_type]
    myquery = get_query(rank, role, patch, queue_type, mode=mode)

    if matchup != "None":
        myquery = {**myquery, **{"enemy": matchup}}
    games = 0
    wins = 0
    mypipeline = return_pipeline(god, rank, role, patch, queue_type, mode)
    for x in mycol.aggregate(
        [mypipeline, {"$group": {"_id": "$win_status", "count": {"$sum": 1}}}]
    ):
        games += x["count"]
        if x["_id"] == "Winner":
            wins += x["count"]

    if games > 0:
        return {"wins": wins, "games": games, "win_rate": round(wins / games * 100, 2)}
    else:
        return {"wins": wins, "games": games, "win_rate": 0}


def get_total_matches(client, rank, patch, queue_type="Ranked", mode="Conquest"):
    mydb = client["Matches"]
    mycol = mydb["Total_Matches"]
    myquery = get_query(rank, "", patch, queue_type, mode)
    games = 0
    if rank not in ["Platinum+", "Diamond+", "All Ranks"]:
        myquery["rank"] = rank
    for x in mycol.find(myquery):
        games += x["Total_Matches"]
    return games


def get_combat_stats(
    client, god, role, patch, rank="All Ranks", queue_type="Ranked", mode="Conquest"
):
    mydb = client["single_match_stats"]
    mycol = mydb[mode + "-" + queue_type]
    combat_stats = {}
    myquery = get_query(rank, role, patch, queue_type, mode)
    myquery["god"] = god

    for x in mycol.aggregate(
        [
            {"$match": myquery},
            {
                "$group": {
                    "_id": "$god",
                    "kills": {"$avg": "$kills"},
                    "deaths": {"$avg": "$deaths"},
                    "damage_": {"$avg": "$damage_player"},
                    "damageTaken": {"$avg": "$damage_taken"},
                    "damageMitigated": {"$avg": "$damage_mitigated"},
                    "healing": {"$avg": "$healing"},
                    "selfHealing": {"$avg": "$healing_self"},
                    "games": {"$sum": 1},
                }
            },
        ]
    ):
        combat_stats = x
        for key, val in enumerate(combat_stats):
            if type(combat_stats[val]) is float or type(combat_stats[val]) is int:
                combat_stats[val] = round(combat_stats[val], 2)

    return combat_stats


def get_objective_stats(
    client, god, role, patch, rank="All Ranks", queue_type="Ranked", mode="Conquest"
):
    mydb = client["single_match_stats"]
    mycol = mydb[mode + "-" + queue_type]
    combat_stats = {}
    myquery = get_query(rank, role, patch, queue_type, mode)
    myquery["god"] = god
    for x in mycol.aggregate(
        [
            {"$match": myquery},
            {
                "$group": {
                    "_id": "$god",
                    "gold": {"$avg": "$gold"},
                    "damageBot": {"$avg": "$damage_bot"},
                    "killsBot": {"$avg": "$kills_bot"},
                    "towerKills": {"$avg": "$tower_kills"},
                    "phoenixKills": {"$avg": "$phoenix_kills"},
                    "towerDamage": {"$avg": "$tower_damage"},
                    "wardsPlaced": {"$avg": "$wards_placed"},
                    "games": {"$sum": 1},
                }
            },
        ]
    ):
        # #print(x)
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
            for x in item_data_col.find(
                {},
                {
                    "_id": 0,
                    "ActiveFlag": 0,
                    "ChildItemId": 0,
                    "IconId": 0,
                },
            ):
                data = x
            ret_build["slot{}".format(slot_num)] = data
            slot_num += 1
    return ret_build


def get_god_stats(client, god, level):
    god_data_db = client["God_Data"]
    god_data_col = god_data_db[god]
    god_stats = {}
    base_stats = {}
    keys_idc = [
        "Ability1",
        "Ability2",
        "Ability3",
        "Ability4",
        "Ability5",
        "AbilityId1",
        "AbilityId2",
        "AbilityId3",
        "AbilityId4",
        "AbilityId5",
        "Ability_1",
        "Ability_2",
        "Ability_3",
        "Ability_4",
        "Ability_5",
        "AutoBanned",
        "Cons",
        "Lore",
        "Name",
        "OnFreeRotation",
        "Pantheon",
        "Pros",
        "Roles",
        "Title",
        "Type",
        "basicAttack",
        "abilityDescription1",
        "abilityDescription2",
        "abilityDescription3",
        "abilityDescription4",
        "abilityDescription5",
        "godAbility1_URL",
        "godAbility2_URL",
        "godAbility3_URL",
        "godAbility4_URL",
        "godAbility5_URL",
        "godCard_URL",
        "godIcon_URL",
        "id",
        "latestGod",
        "ret_msg",
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
        "AttackSpeed": round(
            base_stats["AttackSpeed"]
            + (per_level_stats["AttackSpeedPerLevel"] * level),
            3,
        ),
        "Health": round(
            base_stats["Health"] + (per_level_stats["HealthPerLevel"] * level), 2
        ),
        "HP5": round(
            base_stats["HealthPerFive"] + (per_level_stats["HP5PerLevel"] * level), 2
        ),
        "MagicProtection": round(
            base_stats["MagicProtection"]
            + (per_level_stats["MagicProtectionPerLevel"] * level)
        ),
        "MagicalPower": round(
            base_stats["MagicalPower"]
            + (per_level_stats["MagicalPowerPerLevel"] * level),
            2,
        )
        * (1 / 5),
        "Mana": round(
            base_stats["Mana"] + (per_level_stats["ManaPerLevel"] * level), 2
        ),
        "MP5": round(
            base_stats["ManaPerFive"] + (per_level_stats["MP5PerLevel"] * level), 2
        ),
        "PhysicalPower": round(
            base_stats["PhysicalPower"]
            + (per_level_stats["PhysicalPowerPerLevel"] * level),
            2,
        ),
        "PhysicalProtection": round(
            base_stats["PhysicalProtection"]
            + (per_level_stats["PhysicalProtectionPerLevel"] * level)
        ),
        "Speed": base_stats["Speed"],
    }

    if ret_stats["PhysicalPower"] > 0:
        ret_stats["BasicAttackDamage"] = ret_stats["PhysicalPower"]
    elif ret_stats["MagicalPower"]:
        ret_stats["BasicAttackDamage"] = ret_stats["MagicalPower"] * (1 / 5)

    return ret_stats


# def calc_hardcarry_score():
# Gold Share your % of the teams gold
# Damage Share your % of the teams damage
# Lane Level Diff


def get_carry_score(match):
    ret_data = {
        "goldScore": {
            "Winner": {
                "totalGold": 1,
            },
            "Loser": {
                "totalGold": 1,
            },
        },
        "damageScore": {
            "Winner": {
                "totalDamage": 1,
            },
            "Loser": {
                "totalDamage": 1,
            },
        },
        "levelDiff": {"Winner": {}, "Loser": {}},
        "killPart": {
            "Winner": {
                "totalKills": 0,
            },
            "Loser": {
                "totalKills": 0,
            },
        },
    }
    match_roles = []

    for key in match:
        if "player" in key:
            match_roles.append(match[key]["Role"])
    if check_roles(match_roles):
        for key in match:
            try:
                if "player" in key:
                    ret_data["goldScore"][match[key]["Win_Status"]][
                        "totalGold"
                    ] += match[key]["Gold_Earned"]
                    ret_data["damageScore"][match[key]["Win_Status"]][
                        "totalDamage"
                    ] += match[key]["Damage_Player"]
                    ret_data["levelDiff"][match[key]["Win_Status"]][
                        match[key]["Role"]
                    ] = {"level": match[key]["Final_Match_Level"]}
                    ret_data["killPart"][match[key]["Win_Status"]][
                        "totalKills"
                    ] += match[key]["Kills_Player"]

                    # for side in ret_data["levelDiff"]:
                    #     for role in ret_data["levelDiff"][side]:
                    #         if side == "Winner":
                    #             opp_side = "Loser"
                    #         elif side == "Loser":
                    #             opp_side = "Winner"
                    #         ret_data["levelDiff"][side][role]["level_diff"] = ret_data["levelDiff"][side][role]["level"] - ret_data["levelDiff"][opp_side][role]["level"]
                    for key in match:
                        if (
                            "player" in key
                            and ret_data["killPart"][match[key]["Win_Status"]][
                                "totalKills"
                            ]
                            <= 0
                        ):
                            ret_data["killPart"][match[key]["Win_Status"]][
                                match[key]["Role"]
                            ] = {
                                "kills": match[key]["Kills_Player"],
                                "assists": match[key]["Assists"],
                                "killShare": 0,
                            }
                        elif "player" in key:
                            ret_data["killPart"][match[key]["Win_Status"]][
                                match[key]["Role"]
                            ] = {
                                "kills": match[key]["Kills_Player"],
                                "assists": match[key]["Assists"],
                                "killShare": round(
                                    (match[key]["Kills_Player"] + match[key]["Assists"])
                                    / ret_data["killPart"][match[key]["Win_Status"]][
                                        "totalKills"
                                    ]
                                    * 100,
                                    2,
                                ),
                            }

                        if "player" in key:
                            ret_data["goldScore"][match[key]["Win_Status"]][
                                match[key]["Role"]
                            ] = {
                                "gold": match[key]["Gold_Earned"],
                                "goldShare": round(
                                    match[key]["Gold_Earned"]
                                    / ret_data["goldScore"][match[key]["Win_Status"]][
                                        "totalGold"
                                    ]
                                    * 100,
                                    2,
                                ),
                            }
                            ret_data["damageScore"][match[key]["Win_Status"]][
                                match[key]["Role"]
                            ] = {
                                "damage": match[key]["Damage_Player"],
                                "damageShare": round(
                                    match[key]["Damage_Player"]
                                    / ret_data["damageScore"][match[key]["Win_Status"]][
                                        "totalDamage"
                                    ]
                                    * 100,
                                    2,
                                ),
                            }
            except ZeroDivisionError:
                # #print(ret_data)
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
        average_gold_share[role]["goldShare"] = round(
            average_gold_share[role]["goldShare"] / 2, 2
        )
    return average_gold_share


def get_gold_eff(kill_part, gold_eff):
    ret_data = {"Winner": {}, "Loser": {}}
    match_roles = []
    for team in kill_part:
        for role in kill_part[team]:
            if role in roles:
                match_roles.append(role)

    if check_roles(match_roles):
        for team in kill_part:
            for role in kill_part[team]:
                if role in roles:
                    ret_data[team][role] = {
                        "efficiency": round(
                            kill_part[team][role]["killShare"]
                            / gold_eff[team][role]["goldShare"],
                            2,
                        )
                    }
    return ret_data


def check_roles(match_roles):
    # #print(match_roles)
    match_roles.sort()
    if match_roles != [
        "Carry",
        "Carry",
        "Jungle",
        "Jungle",
        "Mid",
        "Mid",
        "Solo",
        "Solo",
        "Support",
        "Support",
    ]:
        return False
    return True


def get_tier(client, win_rate, pick_rate, ban_rate, role, rank):
    tier_stats = get_tier_stats(client, rank, role)
    if pick_rate + ban_rate > 100:
        print(f"error")
    try:
        win_rate_diff = win_rate - tier_stats["avgWinRate"]
        win_rate_score = win_rate_diff / tier_stats["stdDevWinRate"]

        pick_rate_diff = pick_rate - tier_stats["avgPickRate"]
        pick_rate_score = pick_rate_diff / tier_stats["stdDevPickRate"]

        ban_rate_diff = ban_rate - tier_stats["avgBanRate"]
        ban_rate_score = ban_rate_diff / tier_stats["stdDevBanRate"]

        tier = (1.75 * win_rate_score) + (
            (pick_rate_score + (0.7 * ban_rate_score)) / 2
        )
        # #print(tier)
        if tier < 0:
            tier_letter = "D"

        elif tier < 0.5:
            tier_letter = "C"

        elif tier < 1:
            tier_letter = "B"

        elif tier < 2.5:
            tier_letter = "A"

        elif tier < 3.5:
            tier_letter = "S"

        else:
            tier_letter = "S+"

        return tier_letter
    except KeyError:
        # print(tier_stats)
        return "INVALID"


def get_tier_stats(client: pymongo.MongoClient, rank: str, role: str) -> dict:
    mydb = client["Tier_list"]
    mycol = mydb["Regular List"]
    retData = {}
    myquery = {"role": role, "rank": rank, "pickRate": {"$gte": 1}}
    if "All" in role:
        del myquery["role"]

    for x in mycol.aggregate(
        [
            {"$match": myquery},
            {
                "$group": {
                    "_id": f"tier stats",
                    "stdDevWinRate": {"$stdDevPop": f"$winRate"},
                    "avgWinRate": {"$avg": f"$winRate"},
                    "stdDevPickRate": {"$stdDevPop": f"$pickRate"},
                    "avgPickRate": {"$avg": f"$pickRate"},
                    "stdDevBanRate": {"$stdDevPop": f"$banRate"},
                    "avgBanRate": {"$avg": f"$banRate"},
                }
            },
        ]
    ):
        retData = x

    return retData


def get_specific_build(
    client,
    god,
    role,
    patch,
    matchup,
    rank="All Ranks",
    queue_type="Ranked",
    mode="Conquest",
):
    mydb = client["single_match_stats"]
    mycol = mydb[god]
    match_ids = []
    if "All" in rank:
        myquery = {
            "enemy": matchup,
            "patch": patch,
            "role": role,
            "queue_type": f"{queue_type}",
        }
    else:
        myquery = {
            "enemy": matchup,
            "patch": patch,
            "role": role,
            "rank": rank,
            "queue_type": f"{queue_type}",
        }

    for x in mycol.find(myquery, {"_id": 0}):
        match_ids.append(x["matchId"])

    builds = []
    itemsdb = client["single_match_stats"]
    itemscol = itemsdb[god]
    games = 0
    for x in itemscol.aggregate(
        [
            {
                "$match": {"matchId": {"$in": match_ids}},
            },
        ]
    ):
        builds.append({**{god: x[god]}, **{"win_status": x["win_status"]}})

    return get_top_builds(client, god, role, patch, rank=rank, data=builds)


def get_matchups_stats(
    client,
    god: str,
    role: str,
    patch,
    queue_type="Ranked",
    rank="All Ranks",
    mode="Conquest",
):
    mydb = client["single_match_stats"]
    mycol = mydb[patch + "-" + mode + "-" + queue_type]
    myquery = get_query(rank, role, patch, queue_type, mode)
    avg_dmg_dict = {}
    total_games = mycol.count_documents(myquery)
    for x in mycol.aggregate(
        [
            {"$match": myquery},
            {
                "$group": {
                    "_id": "$enemy",
                    "avg_dmg_diff": {"$avg": "$damage_player"},
                    "avg_kill_diff": {"$avg": "$kills"},
                    "avg_gold_diff": {"$avg": "$gold"},
                    "games": {"$sum": 1},
                }
            },
        ]
    ):
        # wins = matchupscol.count_documents({**myquery, **{"enemy": x["_id"], "win_status": "Winner"}})
        if "All" in rank:
            wins = mycol.count_documents(
                {
                    "enemy": x["_id"],
                    "win_status": "Winner",
                    "patch": patch,
                    "role": role,
                    "queue_type": f"{queue_type}",
                }
            )
        else:
            wins = mycol.count_documents(
                {
                    "enemy": x["_id"],
                    "win_status": "Winner",
                    "patch": patch,
                    "rank": rank,
                    "role": role,
                    "queue_type": f"{queue_type}",
                }
            )

        if x["games"] >= 0.01 * total_games:
            avg_dmg_dict[x["_id"]] = {
                "dmg": x["avg_dmg_diff"],
                "kills": x["avg_kill_diff"],
                "gold": x["avg_gold_diff"],
                "wr": round(wins / x["games"] * 100, 2),
                "games": x["games"],
            }

    myquery = {**myquery, **{"enemy": god}}
    if "" in avg_dmg_dict.keys():
        del avg_dmg_dict[""]
    for god in avg_dmg_dict:
        if god:
            mycol = mydb[god]
            for x in mycol.aggregate(
                [
                    {"$match": myquery},
                    {
                        "$group": {
                            "_id": "$enemy",
                            "avg_dmg_diff": {"$avg": "$damage_player"},
                            "avg_kill_diff": {"$avg": "$kills"},
                            "avg_gold_diff": {"$avg": "$gold"},
                        }
                    },
                ]
            ):
                avg_dmg_dict[god]["god"] = god
                avg_dmg_dict[god]["dmg"] -= x["avg_dmg_diff"]
                avg_dmg_dict[god]["kills"] -= x["avg_kill_diff"]
                avg_dmg_dict[god]["gold"] -= x["avg_gold_diff"]

    return avg_dmg_dict


def get_build_path(
    client, god, role, patch, queue_type="Ranked", rank="All Ranks", mode="Conquest"
):
    mydb = client["single_match_stats"]
    mycol = mydb[patch + "-" + mode + "-" + queue_type]
    index = 0
    games = 0
    builds = {}
    mypipeline = return_pipeline(god, rank, role, patch, queue_type, mode)
    # myquery["build"] = {"$exists": True}
    for x in mycol.aggregate(
        [
            mypipeline,
            {
                "$group": {
                    "_id": {
                        "slot1": f"$build.slot1",
                        "slot2": f"$build.slot2",
                        "slot3": f"$build.slot3",
                        "win_status": "$win_status",
                    },
                    "count": {"$sum": 1},
                }
            },
            {"$sort": {"count": 1}},
        ]
    ):
        games += x["count"]
        if (
            "{},{},{}".format(x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"])
            not in builds.keys()
        ):
            builds[
                "{},{},{}".format(
                    x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"]
                )
            ] = {
                "slot1": x["_id"]["slot1"],
                "slot2": x["_id"]["slot2"],
                "slot3": x["_id"]["slot3"],
                "wins": 0,
                "losses": 0,
            }
        if x["_id"]["win_status"] == "Winner":
            builds[
                "{},{},{}".format(
                    x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"]
                )
            ]["wins"] += x["count"]
        elif x["_id"]["win_status"] == "Loser":
            builds[
                "{},{},{}".format(
                    x["_id"]["slot1"], x["_id"]["slot2"], x["_id"]["slot3"]
                )
            ]["losses"] += x["count"]
        index += 1
    top_five = {}
    for x in list(builds)[-10:]:
        for key in builds[x].keys():
            if "slot" in key:
                builds[x][key] = get_item_data(client, builds[x][key])
        top_five[x] = builds[x]

    test_sort = OrderedDict(
        sorted(top_five.items(), key=lambda x: getitem(x[1], "wins"))
    )
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
                    #     #print(winning_duo)
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

                    syneryFactor = round(
                        winning_duo["count"]
                        / (winning_duo["count"] + losing_duo["count"])
                        * 100,
                        2,
                    ) - sqrt(
                        winning_duo["winningCarryWR"] * winning_duo["winningSupportWR"]
                    )
                    lanes[
                        str(winning_duo["_id"]["carry"])
                        + str(winning_duo["_id"]["support"])
                    ] = {
                        **winning_duo,
                        **{
                            "losses": losing_duo["count"],
                            "winRate": round(
                                winning_duo["count"]
                                / (winning_duo["count"] + losing_duo["count"])
                                * 100,
                                2,
                            ),
                        },
                        **{
                            "carryWinRate": winning_duo["winningCarryWR"],
                            "supportWinRate": winning_duo["winningSupportWR"],
                            "syneryFactor": syneryFactor,
                        },
                    }
    return lanes


def calc_total_matches(client, ranks, patch, queue_type, mode):

    mypipeline = {
        "$search": {"compound": {"filter": {"text": {"query": "none", "path": "rank"}}}}
    }
    mydb = client["Matches"]
    if queue_type == "Casual":
        mydb = client["CasualMatches"]

    if mode == "Conquest":
        mycol = mydb[f"{patch} Matches"]
    elif mode == "Joust":
        mycol = mydb[f"{patch} Joust Matches"]

        insert_games("All Ranks", mycol.count_documents({}), patch, queue_type, mode)
        return

    mydb = client["single_match_stats"]
    mycol = mydb[patch + "-" + mode + "-" + queue_type]
    games = 0
    for x in mycol.aggregate([{"$group": {"_id": "$rank", "games": {"$sum": 1}}}]):
        insert_games(x["_id"], x["games"], patch, queue_type, mode)
        games += x["games"]

    total_games = mycol.count_documents({})
    myquery = get_query("All Ranks", "", patch, queue_type, mode)
    mydb = client["Matches"]
    mycol = mydb["Total_Matches"]
    myquery["rank"] = "All Ranks"
    if mycol.count_documents(myquery) == 0:
        mycol.insert_one({**myquery, **{"Total_Matches": total_games}})
    else:
        mycol.update_one(
            {
                "rank": "All Ranks",
                "patch": patch,
                "queue_type": queue_type,
                "mode": mode,
            },
            {"$set": {"Total_Matches": total_games}},
        )


def insert_games(rank, games, patch, queue_type, mode):
    mydb = client["Matches"]
    mycol = mydb[f"Total_Matches"]
    myquery = get_query(rank, "", patch, queue_type, mode)

    if mycol.count_documents(myquery) == 0:
        mycol.insert_one({**myquery, **{"Total_Matches": games}})
    else:
        mycol.update_one(
            {"rank": rank, "patch": patch, "queue_type": queue_type, "mode": mode},
            {"$set": {"Total_Matches": games}},
        )
    print(f"{rank} done")


def get_skin_stats(
    god,
    role,
    patch,
    rank="All Ranks",
    queue_type="Ranked",
    mode="Conquest",
    matchup=None,
):
    mydb = client["single_match_stats"]
    mycol = mydb[patch + "-" + mode + "-" + queue_type]
    games = 0
    wins = 0
    myquery = get_query(rank, role, patch, queue_type, mode)
    if matchup != "None" and matchup != None:
        myquery = {**myquery, **{"enemy": matchup}}

    myquery["god"] = god
    kills = 0
    deaths = 0
    assists = 0
    data = {}
    for x in mycol.aggregate(
        [
            {
                "$match": myquery,
            },
            {
                "$group": {
                    "_id": {"skin": "$skin", "win_status": "$win_status"},
                    "games": {"$sum": 1},
                }
            },
        ]
    ):
        games += x["games"]
        if "skin" in x["_id"] and x["_id"]["skin"] not in data:
            data[x["_id"]["skin"]] = x
            if x["_id"]["win_status"] == "Winner":
                data[x["_id"]["skin"]]["wins"] = x["games"]

        elif "skin" in x["_id"] and x["_id"]["skin"] in data:
            for key in x:
                if key != "_id":
                    data[x["_id"]["skin"]][key] += x[key]

                if (
                    x["_id"]["win_status"] == "Winner"
                    and "wins" not in data[x["_id"]["skin"]]
                ):
                    data[x["_id"]["skin"]]["wins"] = x["games"]

        if x["_id"]["win_status"] == "Winner":
            wins += x["games"]

        del x["_id"]

    for skin in data:
        if data[skin]["games"] > 0:
            if "wins" not in data[skin]:
                data[skin]["wins"] = 0
            data[skin]["win_rate"] = round(
                data[skin]["wins"] / data[skin]["games"] * 100, 2
            )
        else:
            data[skin]["win_rate"] = 0

    if games == 0:
        return {**{"games": 0, "wins": wins, "win_rate": 100}, **data}
    else:
        return {
            **{
                "games": games,
                "wins": wins,
                "win_rate": round(wins / games * 100, 2),
                "kills": kills,
                "deaths": deaths,
                "assists": assists,
            },
            **data,
        }


def get_single_skin_stats(
    god,
    skin,
    role,
    patch,
    rank="All Ranks",
    queue_type="Ranked",
    mode="Conquest",
    matchup=None,
):
    if "Standard" in skin:
        skin = god
    mydb = client["single_match_stats"]
    mycol = mydb[patch + "-" + mode + "-" + queue_type]
    games = 0
    wins = 0
    data = {**{stat: 0 for stat in single_stats}, **{"players": []}}
    myquery = get_query(rank, role, patch, queue_type, mode)
    if matchup != "None" and matchup != None:
        myquery = {**myquery, **{"enemy": matchup}}

    myquery["skin"] = skin
    for x in mycol.aggregate(
        [
            {
                "$match": myquery,
            },
            {
                "$group": {
                    "_id": {"player": "$player", "win_status": "$win_status"},
                    "kills": {"$sum": "$kills"},
                    "deaths": {"$sum": "$deaths"},
                    "assists": {"$sum": "$assists"},
                    "damage_player": {"$sum": "$damage_player"},
                    "damage_taken": {"$sum": "$damage_taken"},
                    "damage_mitigated": {"$sum": "$damage_mitigated"},
                    "healing": {"$sum": "$healing"},
                    "healing_self": {"$sum": "$healing_self"},
                    "gold": {"$sum": "$gold"},
                    "damage_bot": {"$sum": "$damage_bot"},
                    "kills_bot": {"$sum": "$kills_bot"},
                    "camps_cleared": {"$sum": "$camps_cleared"},
                    "tower_kills": {"$sum": "$tower_kills"},
                    "phoenix_kills": {"$sum": "$phoenix_kills"},
                    "tower_damage": {"$sum": "$tower_damage"},
                    "objective_assists": {"$sum": "$objective_assists"},
                    "wards_placed": {"$sum": "$wards_placed"},
                    "games": {"$sum": 1},
                }
            },
            {"$sort": {"games": -1}},
        ]
    ):

        data["kills"] += x["kills"]
        data["deaths"] += x["deaths"]
        data["assists"] += x["assists"]
        data["damage_player"] += x["damage_player"]
        data["damage_taken"] += x["damage_taken"]
        data["damage_mitigated"] += x["damage_mitigated"]
        data["healing"] += x["healing"]
        data["healing_self"] += x["healing_self"]
        data["gold"] += x["gold"]
        data["damage_bot"] += x["damage_bot"]
        data["kills_bot"] += x["kills_bot"]
        data["camps_cleared"] += x["camps_cleared"]
        data["tower_kills"] += x["tower_kills"]
        data["phoenix_kills"] += x["phoenix_kills"]
        data["tower_damage"] += x["tower_damage"]
        data["objective_assists"] += x["objective_assists"]
        data["wards_placed"] += x["wards_placed"]

        games += x["games"]
        if "player" in x["_id"] and x["_id"]["player"] not in data:
            data[x["_id"]["player"]] = x
            if x["_id"]["win_status"] == "Winner":
                data[x["_id"]["player"]]["wins"] = x["games"]

        elif "player" in x["_id"] and x["_id"]["player"] in data:
            for key in x:
                if key != "_id":
                    data[x["_id"]["player"]][key] += x[key]

                if (
                    x["_id"]["win_status"] == "Winner"
                    and "wins" not in data[x["_id"]["player"]]
                ):
                    data[x["_id"]["player"]]["wins"] = x["games"]

        if x["_id"]["win_status"] == "Winner":
            wins += x["games"]

        del x["_id"]

    for skin in data:
        if skin != "players" and skin not in single_stats:
            if len(data["players"]) < 10:
                if data[skin]["games"] > 0 and "wins" in data[skin]:
                    data[skin]["winRate"] = round(
                        data[skin]["wins"] / data[skin]["games"] * 100, 2
                    )

                data["players"].append({**data[skin], **{"enemy": skin}})

            else:
                data[skin]["winRate"] = 0
    keys = list(data.keys()).copy()

    for key in keys:
        if (
            key not in ["players", "games", "winrate", "wins"]
            and key not in single_stats
        ):
            del data[key]
        # elif type(data[key]) is int:
        #     data[key] = "{:,}".format(round(data[key]))

    if games == 0:
        return {**{"games": 0, "wins": wins, "winRate": 100}, **data}
    else:
        return {
            **{"games": games, "wins": wins, "winRate": round(wins / games * 100, 2)},
            **data,
        }


def report_query_parser(
    god: list,
    rank: list,
    role: list,
    patch: list,
    queue_type: list,
    mode: str,
    enemy: list,
    items: list,
) -> dict:
    # formatted_item = ""
    # for item in items:
    #     formatted_item += item + " "
    myquery = {
        "god": {"$in": god},
        "rank": {"$in": rank},
        "role": {"$in": role},
        "patch": {"$in": patch},
        "queue_type": {"$in": queue_type},
        "mode": mode,
        "enemy": {"$in": enemy},
        "$or": [
            {"build.slot1": {"$in": items}},
            {"build.slot2": {"$in": items}},
            {"build.slot3": {"$in": items}},
            {"build.slot4": {"$in": items}},
            {"build.slot5": {"$in": items}},
            {"build.slot6": {"$in": items}},
        ],
    }

    if mode != "Conquest":
        myquery.pop("role")
    if mode not in ["Conquest", "Duel", "Joust"]:
        myquery["queue_type"] = "Casual"
    if mode == "Duel":
        myquery["queue_type"] = "Ranked"
    if len(items) <= 0:
        myquery.pop("$or")
    if len(enemy) <= 0:
        myquery.pop("enemy")

    for r in ranks:
        if r == "All Ranks":
            myquery.pop("rank")
    # if mode != conquest: no role
    # if queue_type != ranked: no rank
    # if mode != ranked modes: queue_type == casual
    # if item create the {"$or" item.slot1-6: item}
    return myquery


def query_attribute_parser(attributes: list) -> dict:
    return {
        f"avg{attribute.replace(' ', '_')}": {
            "$avg": f"${attribute.strip().lower().replace(' ', '_')}"
        }
        for attribute in attributes
    }


def get_match_stats(
    client,
    god,
    role,
    patch,
    attributes,
    rank="All Ranks",
    queue_type="Ranked",
    mode="Conquest",
):
    mydb = client["single_match_stats"]
    match_stats = {
        m: {p: {g: {r: {} for r in role} for g in god} for p in patch} for m in mode
    }

    for m in mode:
        # need to make function that correctly generates queries
        mycol = mydb[m]
        myquery = report_query_parser(god, rank, role, patch, queue_type, m, [], [])
        if m != "Conquest":
            group_by = {"god": "$god", "patch": "$patch"}
        else:
            group_by = {"god": "$god", "role": "$role", "patch": "$patch"}

        myattributes = query_attribute_parser(attributes)
        for x in mycol.aggregate(
            [
                {"$match": myquery},
                {
                    "$group": {
                        **{
                            "_id": group_by,
                            "games": {"$sum": 1},
                        },
                        **myattributes,
                    }
                },
            ]
        ):
            x["God"] = x["_id"]["god"]
            x["Patch"] = x["_id"]["patch"]
            if m != "Conquest":
                match_stats[m][x["_id"]["patch"]][x["_id"]["god"]] = x
                del match_stats[m][x["_id"]["patch"]][x["_id"]["god"]]["_id"]
            else:
                match_stats[m][x["_id"]["patch"]][x["_id"]["god"]][x["_id"]["role"]] = x
                del match_stats[m][x["_id"]["patch"]][x["_id"]["god"]][
                    x["_id"]["role"]
                ]["_id"]
            for key, val in enumerate(match_stats[m]):

                if (
                    type(match_stats[m][val]) is float
                    or type(match_stats[m][val]) is int
                ):
                    match_stats[m][val] = round(match_stats[m][val], 2)

    # del combat_stats["_id"]
    return match_stats


def save_func():
    mydb = client["single_match_stats"]
    games = 0
    wins = 0
    winrate = 0
    total_games = 0
    item = "Void Shield"
    # item = "Gladiator\'s Shield"
    for god in godsDict:
        mycol = mydb[god]
        for x in mycol.find(
            {
                "patch": "9.3",
                "role": "Solo",
                "queue_type": "Ranked",
                "mode": "Conquest",
            },
            {"win_status": 1, "build": 1},
        ):
            if "build" in list(x.keys()):
                total_games += 1
                if item in list(x["build"].values()):
                    games += 1
                    if x["win_status"] == "Winner":
                        wins += 1
        print(god)
    print(games, total_games)
    print(
        wins,
        games,
        round(wins / games * 100, 2),
        round(games / (total_games * 6) * 100, 2),
    )


def get_match_time(patch):
    import numpy

    mydb = client["CasualMatches"]
    mycol = mydb[f"{patch} Matches"]
    total_bans = []
    for x in mycol.find({"Minutes": {"$gte": 12}}, {"Minutes": 1}):
        total_bans.append(x["Minutes"])
    print(
        "Total Time: ",
        sum(total_bans),
        "Max Time: ",
        max(total_bans),
        "Number of f6 10s: ",
        mycol.count_documents({"Minutes": {"$lte": 12}}),
    )
    print(
        "Average Time: ",
        numpy.average(total_bans),
        "Median Time: ",
        numpy.median(total_bans),
    )
    print("Standard Dev: ", numpy.std(total_bans))


if __name__ == "__main__":
    print(get_top_builds(client, "Achilles", "Solo", "9.9"))
    print(len(godsDict))
    # client, god, role, patch, queue_type="Ranked", rank="All Ranks", mode="Conquest", matchup="None"
    #     },}):
    # get_match_time("9.7")
    # print(get_winrate(client, "Kali", "Jungle", "9.7", rank="Diamond"))
    # # from main import client
    # # import numpy
    # # (client, god, rank, role, patch, queue_type="Ranked", mode="Conquest")
    # mydb = client["single_match_stats"]
    # games = 0
    # wins = 0
    # dmg = []
    # time = []
    # mycol = mydb["Joust-Ranked"]
    # num = 0
    # # for god in ["Chronos", "Sol", "Freya", "Olorun"]:

    # item = "Gladiator\'s Shield"
    # # item = "Void Shield"
    # data = {rank: {"wins": 0, "games": 0, "winrate": 0} for rank in ranks}
    # for x in mycol.aggregate([
    #     {
    #         "$match": {"god": "Kuzenbo"}
    #     },
    #     {
    #         "$group": {
    #             "_id": "$player",
    #     #         # "avgDamage": {"$avg": "$damage_player"},
    #     #         # "avgKills": {"$avg": "$kills"},
    #             "games": {"$sum": 1},
    #             }
    #     },
    #     {
    #         "$sort": {"games": -1}
    #     },
    #     {
    #         "$limit": 25
    #     }
    #         ]):
    #             print(x)
    # if x["win_status"] == "Winner":
    #     data[x["_id"]]["wins"] += 1
    # print(max(dmg))
    # if len(dmg) > 0 and len(time) > 0:
    #     print(sum(dmg)/len(dmg))
    #     print(sum(time)/len(time))
    #     print("Total Damage: ", sum(total_bans) ,"Max Damage: ", max(total_bans))
    #     print("Average Damage: ", numpy.average(total_bans), "Median Damage: ", numpy.median(total_bans))
    #     print("Standard Dev: ", numpy.std(total_bans))

# Mages 374 751 49.8
# Hunters 158 293 53.92
# Warriors 869 1751 49.63
# Guardians 122 243 50.21
# Assassins 266 539 49.35


# Total Damage:  1780865217 Max Damage:  93917
# Average Damage:  13637.90734557596 Median Time:  12816.0
# Standard Dev:  6655.287265388552

# for x in mycol.aggregate([
#     {
#         "$match": {"patch": "9.5"}
#     },
#     {
#         "$group": {"_id": "$skin",
#                     "games": {"$sum": 1}
#                     }
#     },

#     {
#         "$sort": {"games": -1}
#     },
#     {
#         "$limit": 1
#     }
#     ]):
#         print(x)

# Ranked Conq
# assassin 98519 196377 50.17
# hunter 107515 214288 50.17
# warrior 87971 176428 49.86
# mages 125614 251845 49.88
# guardians 101317 202929 49.93

# Ranked Joust
# assassin 17324 34021 50.92
# hunter 42578 86270 49.35
# warrior 41180 82626 49.84
