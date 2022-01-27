import pyrez
from datetime import datetime
from pyrez.api import SmiteAPI
import pymongo
import random
import time
import analyze as anlz
from pyrez.models import Smite
from pyrez.models.MatchHistory import MatchHistory
from data_pull_formatting_rewrite import threadedd_format_no_query
import os
from main import client
# from data_pull_formatting_rewrite import format_no_query



def normalize_godId(id):
    godName = ""
    godsDict = {
        3492: "Achilles",
        1737: "Agni",
        1956: "Ah Muzen Cab",
        2056: "Ah Puch",
        2110: "Amaterasu",
        1773: "Anhur",
        1668: "Anubis",
        2034: "Ao Kuang",
        1898: "Aphrodite",
        1899: "Apollo",
        1699: "Arachne",
        1782: "Ares",
        1748: "Artemis",
        3336: "Artio",
        1919: "Athena",
        4034: "Atlas",
        2037: "Awilix",
        3925: "Baba Yaga",
        1809: "Bacchus",
        1755: "Bakasura",
        3518: "Baron Samedi",
        1678: "Bastet",
        2047: "Bellona",
        2008: "Cabrakan",
        2189: "Camazotz",
        3419: "Cerberus",
        2268: "Cernunnos",
        1966: "Chaac",
        1921: "Chang\'e",
        4010: "Charybdis",
        3509: "Chernobog",
        2075: "Chiron",
        1920: "Chronos",
        4017: "Cliodhna",
        3945: "Cthulhu",
        2319: "Cu Chulainn",
        1778: "Cupid",
        2270: "Da Ji",
        3984: "Danzaburou",
        3377: "Discordia",
        2138: "Erlang Shen",
        1918: "Eset",
        2136: "Fafnir",
        1843: "Fenrir",
        1784: "Freya",
        2269: "Ganesha",
        1978: "Geb",
        3997: "Gilgamesh",
        1763: "Guan Yu",
        3344: "Hachiman",
        1676: "Hades",
        1674: "He Bo",
        3812: "Heimdallr",
        1718: "Hel",
        3558: "Hera",
        1848: "Hercules",
        3611: "Horus",
        2040: "Hou Yi",
        1673: "Hun Batz",
        2179: "Izanami",
        1999: "Janus",
        2122: "Jing Wei",
        3585: "Jormungandr",
        1649: "Kali",
        2066: "Khepri",
        3565: "King Arthur",
        1677: "Kukulkan",
        1993: "Kumbhakarna",
        2260: "Kuzenbo",
        1797: "Loki",
        2051: "Medusa",
        1941: "Mercury",
        3566: "Merlin",
        4006: "Morgan Le Fay",
        3881: "Mulan",
        1915: "Ne Zha",
        1872: "Neith",
        1980: "Nemesis",
        2214: "Nike",
        2036: "Nox",
        1958: "Nu Wa",
        1669: "Odin",
        3664: "Olorun",
        2000: "Osiris",
        3543: "Pele",
        3705: "Persephone",
        1881: "Poseidon",
        1698: "Ra",
        2113: "Raijin",
        2002: "Rama",
        2063: "Ratatoskr",
        2065: "Ravana",
        1988: "Scylla",
        2005: "Serqet",
        3612: "Set",
        2107: "Skadi",
        1747: "Sobek",
        2074: "Sol",
        1944: "Sun Wukong",
        2123: "Susano",
        2030: "Sylvanus",
        2147: "Terra",
        1943: "Thanatos",
        2226: "The Morrigan",
        1779: "Thor",
        2203: "Thoth",
        3990: "Tiamat",
        3954: "Tsukuyomi",
        1924: "Tyr",
        1991: "Ullr",
        1723: "Vamana",
        1869: "Vulcan",
        1864: "Xbalanque",
        2072: "Xing Tian",
        3811: "Yemoja",
        1670: "Ymir",
        1672: "Zeus",
        1926: "Zhong Kui"
    }
    if godsDict.get(id):
        godName = godsDict.get(id)
    return godName


def create_player_dict(player):
    playerDict = {}
    playerDict["Account_Level"] = player.accountLevel
    playerDict["Assists"] = player.assists
    playerDict["Camps_Cleared"] = player["Camps_Cleared"]
    playerDict["Conquest_Points"] = player["Conquest_Points"]
    playerDict["Conquest_Tier"] = player.Conquest_Tier
    playerDict["Damage_Bot"] = player["Damage_Bot"]
    playerDict["Damage_Done_Magical"] = player.damageDoneMagical
    playerDict["Damage_Done_Physical"] = player.damageDonePhysical
    playerDict["Damage_Player"] = player["Damage_Player"]
    playerDict["Damage_Mitigated"] = player.damageMitigated
    playerDict["Damage_Taken"] = player.damageTaken
    playerDict["Damage_Taken_Magical"] = player["Damage_Taken_Magical"]
    playerDict["Damage_Taken_Physical"] = player["Damage_Taken_Physical"]
    playerDict["Distance_Traveled"] = player["Distance_Traveled"]
    playerDict["Deaths"] = player.deaths
    playerDict["Final_Match_Level"] = player["Final_Match_Level"]
    playerDict["godId"] = player["GodId"]
    playerDict["godName"] = normalize_godId(player["GodId"])
    # playerDict["godStats"] = anlz.get_god_stats(client, normalize_godId(player["GodId"]), player["Final_Match_Level"])
    playerDict["Gold_Earned"] = player.goldEarned
    playerDict["Gold_Per_Minute"] = player.goldPerMinute
    playerDict["Healing"] = player.healing
    playerDict["Healing_Bot"] = player["Healing_Bot"]
    playerDict["Healing_Player_Self"] = player["Healing_Player_Self"]
    playerDict["Item_Purch_1"] = player.itemPurch1
    playerDict["Item_Purch_2"] = player.itemPurch2
    playerDict["Item_Purch_3"] = player.itemPurch3
    playerDict["Item_Purch_4"] = player.itemPurch4
    playerDict["Item_Purch_5"] = player.itemPurch5
    playerDict["Item_Purch_6"] = player.itemPurch6
    playerDict["Item_Active_1"] = player.itemActive1
    playerDict["Item_Active_2"] = player.itemActive2
    playerDict["Item_Active_3"] = player.itemActive3
    playerDict["Item_Active_4"] = player.itemActive4
    playerDict["Kills_Bot"] = player["Kills_Bot"]
    playerDict["Killing_Spree"] = player.killingSpree
    playerDict["Kills_Double"] = player.killsDouble
    playerDict["Kills_Fire_Giant"] = player["Kills_Fire_Giant"]
    playerDict["Kills_First_Blood"] = player.killsFirstBlood
    playerDict["Kills_Gold_Fury"] = player["Kills_Gold_Fury"]
    playerDict["Kills_Penta"] = player.killsPenta
    playerDict["Kills_Phoenix"] = player["Kills_Phoenix"]
    playerDict["Kills_Player"] = player.killsPlayer
    playerDict["Kills_Quadra"] = player.killsQuadra
    playerDict["Kills_Single"] = player.killsSingle
    playerDict["Kills_Triple"] = player.killsTriple
    playerDict["Multi_kill_Max"] = player.multiKillMax
    playerDict["Objective_Assists"] = player["Objective_Assists"]
    playerDict["Ranked_Stat_Conq"] = player["Rank_Stat_Conquest"]
    playerDict["Region"] = player["Region"]
    playerDict["Role"] = player["Role"]
    playerDict["Skin"] = player["Skin"]
    playerDict["Structure_Damage"] = player["Structure_Damage"]
    playerDict["Time_Dead"] = player["Time_Dead_Seconds"]
    playerDict["Towers_Destroyed"] = player["Towers_Destroyed"]
    playerDict["PlayerId"] = player.playerId
    playerDict["Player_Name"] = player.playerName
    playerDict["Wards_Placed"] = player["Wards_Placed"]
    playerDict["Win_Status"] = player.winStatus
    playerDict["MatchID"] = player.matchId
    build = [
        playerDict["Item_Purch_1"],
        playerDict["Item_Purch_2"],
        playerDict["Item_Purch_3"],
        playerDict["Item_Purch_4"],
        playerDict["Item_Purch_5"],
        playerDict["Item_Purch_6"],
    ]
    # playerDict["godBuild"] = anlz.get_build_stats(client, build)
    return playerDict

def create_match_dict(match, patch):
    match_dict = {}
    match_dict["Patch"] = patch
    match_dict["Entry_Datetime"] = match.entryDatetime.split()[0]
    match_dict["MatchId"] = match.matchId
    match_dict["Match_Duration"] = match.matchDuration
    match_dict["Minutes"] = match["Minutes"]
    match_dict["Ban0"] = match["Ban1"]
    match_dict["Ban1"] = match["Ban2"]
    match_dict["Ban2"] = match["Ban3"]
    match_dict["Ban3"] = match["Ban4"]
    match_dict["Ban4"] = match["Ban5"]
    match_dict["Ban5"] = match["Ban6"]
    match_dict["Ban6"] = match["Ban7"]
    match_dict["Ban7"] = match["Ban8"]
    match_dict["Ban8"] = match["Ban9"]
    match_dict["Ban9"]  = match["Ban10"]
    match_dict["First_Ban_Side"] = match["First_Ban_Side"]
    return match_dict


def create_sets(data):
    mydb = client["CasualMatches"]
    mycol = mydb["9.1 Matches"]
    existing = []
    for x in mycol.find({"Entry_Datetime": "1/26/2022"}, {"MatchId": 1, "_id":0}):
        existing.append(x["MatchId"])
    sets = []
    set = []
    print(len(existing))
    for matchId in data:
        if matchId not in existing:
            set.append(matchId.matchId)
            if len(set) == 10:
                sets.append(set)
                set = []
    if len(set) != 0:
        sets.append(set)
    return sets

def get_new_id(client, smite_api):
    mydb = client["God_Data"]
    gods = smite_api.getGods()
    for god in range(len(gods)):
        if gods[god]["Name"] == "Merlin":
            mycol = mydb[gods[god]["Name"]]
            data = create_god_data_dict(gods[god])
            mycol.replace_one({}, data)


def create_god_data_dict(data):
    ret_data = {}
    ret_data["Ability1"] = data["Ability1"]
    ret_data["Ability2"] = data["Ability2"]
    ret_data["Ability3"] = data["Ability3"]
    ret_data["Ability4"] = data["Ability4"]
    ret_data["Ability5"] = data["Ability5"]
    ret_data["AbilityId1"] = data["AbilityId1"]
    ret_data["AbilityId2"] = data["AbilityId2"]
    ret_data["AbilityId3"] = data["AbilityId3"]
    ret_data["AbilityId4"] = data["AbilityId4"]
    ret_data["AbilityId5"] = data["AbilityId5"]
    ret_data["Ability_1"] = data["Ability_1"]
    ret_data["Ability_2"] = data["Ability_2"]
    ret_data["Ability_3"] = data["Ability_3"]
    ret_data["Ability_4"] = data["Ability_4"]
    ret_data["Ability_5"] = data["Ability_5"]
    ret_data["AttackSpeed"] = data["AttackSpeed"]
    ret_data["AttackSpeedPerLevel"] = data["AttackSpeedPerLevel"]
    ret_data["AutoBanned"] = data["AutoBanned"]
    ret_data["Cons"] = data["Cons"]
    ret_data["HP5PerLevel"] = data["HP5PerLevel"]
    ret_data["Health"] = data["Health"]
    ret_data["HealthPerFive"] = data["HealthPerFive"]
    ret_data["HealthPerLevel"] = data["HealthPerLevel"]
    ret_data["Lore"] = data["Lore"]
    ret_data["MagicProtection"] = data["MagicProtection"]
    ret_data["MagicProtectionPerLevel"] = data["MagicProtectionPerLevel"]
    ret_data["MagicalPower"] = data["MagicalPower"]
    ret_data["MagicalPowerPerLevel"] = data["MagicalPowerPerLevel"]
    ret_data["MP5PerLevel"] = data["MP5PerLevel"]
    ret_data["Mana"] = data["Mana"]
    ret_data["ManaPerFive"] = data["ManaPerFive"]
    ret_data["ManaPerLevel"] = data["ManaPerLevel"]
    ret_data["Name"] = data["Name"]
    ret_data["OnFreeRotation"] = data["OnFreeRotation"]
    ret_data["Pantheon"] = data["Pantheon"]
    ret_data["PhysicalPower"] = data["PhysicalPower"]
    ret_data["PhysicalPowerPerLevel"] = data["PhysicalPowerPerLevel"]
    ret_data["PhysicalProtection"] = data["PhysicalProtection"]
    ret_data["PhysicalProtectionPerLevel"] = data["PhysicalProtectionPerLevel"]
    ret_data["Pros"] = data["Pros"]
    ret_data["Roles"] = data["Roles"]
    ret_data["Speed"] = data["Speed"]
    ret_data["Title"] = data["Title"]
    ret_data["Type"] = data["Type"]
    ret_data["abilityDescription1"] = data["abilityDescription1"]
    ret_data["abilityDescription2"] = data["abilityDescription2"]
    ret_data["abilityDescription3"] = data["abilityDescription3"]
    ret_data["abilityDescription4"] = data["abilityDescription4"]
    ret_data["abilityDescription5"] = data["abilityDescription5"]
    ret_data["basicAttack"] = data["basicAttack"]
    ret_data["godAbility1_URL"] = data["godAbility1_URL"]
    ret_data["godAbility2_URL"] = data["godAbility2_URL"]
    ret_data["godAbility3_URL"] = data["godAbility3_URL"]
    ret_data["godAbility4_URL"] = data["godAbility4_URL"]
    ret_data["godAbility5_URL"] = data["godAbility5_URL"]
    ret_data["godCard_URL"] = data["godCard_URL"]
    ret_data["godIcon_URL"] = data["godIcon_URL"]
    ret_data["id"] = data["id"]
    ret_data["latestGod"] = data["latestGod"]
    ret_data["ret_msg"] = data["ret_msg"]
    return ret_data

def get_date():
    time = datetime.now()
    return f"{time.year}{time.month}{time.day}"

def get_player_basic(player):
    print(player)
    return {
        "Avatar_URL": player["Avatar_URL"],
        "Created_Datetime": player["Created_Datetime"],
        "HoursPlayed": player["HoursPlayed"],
        "Leaves": player["Leaves"],
        "Level": player["Level"],
        "Losses": player["Losses"],
        "MinutesPlayed": player["MinutesPlayed"],
        "Name": player["Name"],
        "NameTag": player["hz_player_name"],
        "Rank_Stat_Conquest": player["Rank_Stat_Conquest"],
        "Rank_Stat_Conquest_Controller": player["Rank_Stat_Conquest_Controller"],
        "RankedConquest": {
            "Leaves": player["RankedConquest"]["Leaves"],
            "Losses": player["RankedConquest"]["Losses"],
            "Points": player["RankedConquest"]["Points"],
            "Rank": player["RankedConquest"]["Rank"],
            "Rank_Stat": player["RankedConquest"]["Rank_Stat"],
            "Rank_Stat_Conquest": player["RankedConquest"]["Rank_Stat_Conquest"],
            "Rank_Variance": player["RankedConquest"]["Rank_Variance"],
            "Season": player["RankedConquest"]["Season"],
            "Tier": player["RankedConquest"]["Tier"],
            "Wins": player["RankedConquest"]["Wins"],
        },
        "RankedConquestController": {
            "Leaves": player["RankedConquestController"]["Leaves"],
            "Losses": player["RankedConquestController"]["Losses"],
            "Points": player["RankedConquestController"]["Points"],
            "Rank": player["RankedConquestController"]["Rank"],
            "Rank_Stat": player["RankedConquestController"]["Rank_Stat"],
            "Rank_Stat_Conquest": player["RankedConquestController"]["Rank_Stat_Conquest"],
            "Rank_Variance": player["RankedConquestController"]["Rank_Variance"],
            "Season": player["RankedConquestController"]["Season"],
            "Tier": player["RankedConquestController"]["Tier"],
            "Wins": player["RankedConquestController"]["Wins"],
        },
        "Tier_Conquest": player["Tier_Conquest"],
        "Total_Achievements": player["Total_Achievements"],
        "Total_Worshippers": player["Total_Worshippers"],
        "Wins": player["Wins"],
    }

#my player id 704292327
def run_pull(patch, date=get_date()):
    starttime = datetime.now()

    with open("cred.txt", "r") as f:
        data = f.readlines()
        smite_api = SmiteAPI(devId=data[0].strip(), authKey=data[1].strip(), responseFormat=pyrez.Format.JSON)

    mydb = client["test"]
    mycol = mydb[f"{patch} Matches"]
    # date = date
    match_ids = smite_api.getMatchIds(466, date="20220123", hour=-1)
    match_ids_len = len(match_ids)
    print(match_ids_len)
    set_ids = []
    all_ids = []
    set_matches = {}
    set_length = 10
    inserted_count = 0

    # all_sets = create_sets(match_ids)
    # total = 0
    # for set in all_sets:
    #     match_details = smite_api.getMatch(set)
    #     print(match_details)
    #     for i in range(len(match_details) // 10):
    #         match_dict = create_match_dict(match_details[i*set_length], patch)
    #         for k in range(10):
    #             player = create_player_dict(match_details[(i*10) + k])
    #             match_dict["player"+str(k)] = player
    #         carry_score = anlz.get_carry_score(match_dict)
    #         match_dict["carryScore"] = carry_score["goldScore"]
    #         match_dict["damageScore"] = carry_score["damageScore"]
    #         match_dict["levelDiff"] = carry_score["levelDiff"]
    #         match_dict["killPart"] = carry_score["killPart"]
    #         match_dict["efficiency"] = anlz.get_gold_eff(match_dict["killPart"], match_dict["carryScore"])
    #         # print(match_dict)
    #         mycol.insert_one(match_dict)
    #         format_no_query(match_dict)
    #         inserted_count += 1


    # print(f"{date} Pull Completed in " + str(datetime.now() - starttime))

def threaded_pull(patch, all_sets, smite_api):
    starttime = datetime.now()

    # with open("cred.txt", "r") as f:
    #     data = f.readlines()
    #     smite_api = SmiteAPI(devId=data[0].strip(), authKey=data[1].strip(), responseFormat=pyrez.Format.JSON)

    mydb = client["Matches"]
    mycol = mydb[f"{patch} Matches"]
    # date = date
    # match_ids = smite_api.getMatchIds(426, date=date, hour=-1)
    #  match_ids_len = len(match_ids)
    # print(match_ids_len)
    set_length = 10
    inserted_count = 0
    # total = 0
    print("Starting pull")
    for set in all_sets:
        set_data = []
        match_details = smite_api.getMatch(set)
        for i in range(len(match_details) // 10):
            match_dict = create_match_dict(match_details[i*set_length], patch)
            for k in range(10):
                player = create_player_dict(match_details[(i*10) + k])
                match_dict["player"+str(k)] = player
            # carry_score = anlz.get_carry_score(match_dict)
            # match_dict["carryScore"] = carry_score["goldScore"]
            # match_dict["damageScore"] = carry_score["damageScore"]
            # match_dict["levelDiff"] = carry_score["levelDiff"]
            # match_dict["killPart"] = carry_score["killPart"]
            # match_dict["efficiency"] = anlz.get_gold_eff(match_dict["killPart"], match_dict["carryScore"])
            set_data.append(match_dict)
            # format_no_query(match_dict)
        mycol.insert_many(set_data)
        inserted_count += 1
        if inserted_count > len(all_sets)/2:
            print("halfway")


    print(f"Pull Completed in " + str(datetime.now() - starttime))

# run_pull("9.1")
# print(inserted_count)
# print("error %" + str(round(100 - inserted_count/match_ids_len * 100, 2)))

    # with open("cred.txt", "r") as f:
    #     data = f.readlines()
    #     smite_api = SmiteAPI(devId=data[0].strip(), authKey=data[1].strip(), responseFormat=pyrez.Format.JSON)
    #     print(smite_api.getPlayer("AutoSpeed"))
    #     # print(smite_api.getGodRanks(704292327))

def get_item_abs_price(name, family, tier, tree):
    price = 0
    index = 1    
    for element in tree[family]:
        if tree[family][element]["Name"] == name:
            price += tree[family][element]["Price"]
        
        if tree[family][element]["Tier"] < tier:
            price += tree[family][element]["Price"]
    
    return price
    



def create_item_dict(item, item_prices):
    ret_data = {}
    ret_data["ChildItemId"] = item["ChildItemId"]
    ret_data["DeviceName"] = item["DeviceName"]
    ret_data["ItemDescription"] = item["ItemDescription"]
    ret_data["ItemTier"] = item["ItemTier"]
    ret_data["relativePrice"] = item["Price"]
    ret_data["absolutePrice"] = get_item_abs_price(item["DeviceName"], item["RootItemId"], item["ItemTier"], item_prices)
    ret_data["ShortDesc"] = item["ShortDesc"]
    ret_data["itemIcon_URL"] = item["itemIcon_URL"]
    return ret_data

def get_new_items(client, smite_api):
    mydb = client["Item_Data"]
    prices = {}
    items = smite_api.getItems()
    for item in range(len(items)):
        # print(items[item]["DeviceName"], items[item]["RootItemId"])
        if items[item]["RootItemId"] not in prices:
            prices[items[item]["RootItemId"]] = {items[item]["DeviceName"]: {"Price": items[item]["Price"], "Tier": items[item]["ItemTier"], "Name": items[item]["DeviceName"]}}
        else:
            prices[items[item]["RootItemId"]][items[item]["DeviceName"]] = {"Price": items[item]["Price"], "Tier": items[item]["ItemTier"], "Name": items[item]["DeviceName"]}

    for item in range(len(items)):
        mycol = mydb[items[item]["DeviceName"]]
        item = create_item_dict(items[item], prices)
        mycol.insert_one(item)
    # print(prices)
        # if items[item]["Name"] == "Merlin":
        #     mycol = mydb[gods[god]["Name"]]
        #     data = create_god_data_dict(gods[god])
        #     # mycol.replace_one({}, data)


if __name__ == "__main__":
    with open("cred.txt", "r") as f:
        data = f.readlines()
        smite_api = SmiteAPI(devId=data[0].strip(), authKey=data[1].strip(), responseFormat=pyrez.Format.JSON)
    print(smite_api.getDataUsed())
    # get_new_items(client, smite_api)