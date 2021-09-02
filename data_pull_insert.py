import pyrez
from datetime import datetime
from pyrez.api import SmiteAPI
import pymongo
import random
import time

from pyrez.models import Smite
from pyrez.models.MatchHistory import MatchHistory

client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")





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
        3509: "Chernobog",
        2075: "Chiron",
        1920: "Chronos",
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
    playerDict["Damage_Done_Magical"] = player.damageDoneMagical
    playerDict["Damage_Done_Physical"] = player.damageDonePhysical
    playerDict["Damage_Player"] = player["Damage_Player"]
    playerDict["Damage_Mitigated"] = player.damageMitigated
    playerDict["Damage_Taken"] = player.damageTaken
    playerDict["Deaths"] = player.deaths
    playerDict["godId"] = player["GodId"]
    playerDict["godName"] = normalize_godId(player["GodId"])
    playerDict["Gold_Earned"] = player.goldEarned
    playerDict["Gold_Per_Minute"] = player.goldPerMinute
    playerDict["Healing"] = player.healing
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
    playerDict["Region"] = player.region
    playerDict["Role"] = player["Role"]
    playerDict["Skin"] = player["Skin"]
    playerDict["Structure_Damage"] = player["Structure_Damage"]
    playerDict["Towers_Destroyed"] = player["Towers_Destroyed"]
    playerDict["PlayerId"] = player.playerId
    playerDict["Player_Name"] = player.playerName
    playerDict["Wards_Placed"] = player["Wards_Placed"]
    playerDict["Win_Status"] = player.winStatus
    playerDict["MatchID"] = player.matchId
    return playerDict

def create_match_dict(match):
    match_dict = {}
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
    print(match_dict["MatchId"])
    return match_dict


def create_sets(data):
    sets = []
    set = []
    for matchId in data:
        set.append(matchId.matchId)
        if len(set) == 10:
            sets.append(set)
            set = []
    if len(set) != 0:
        sets.append(set)
    return sets


starttime = datetime.now()
creds = open("cred.txt", mode="r").read()
smite_api = SmiteAPI(devId =creds.splitlines()[0], authKey = creds.splitlines()[1], responseFormat=pyrez.Format.JSON)
# mydb = client["God_Data"]
# for god in test:
#     god = god.json
#     mycol = mydb[god["Name"]]
#     mycol.insert_one(god)

# smite_api.getMatchHistory(712081347)
mydb = client["Matches"]
mycol = mydb["8.8 Matches"]
# mHistory = smite_api.getMatchHistory(712081347)

match_ids = smite_api.getMatchIds(451, date=20210831, hour=-1) # 30 pulled

print(len(match_ids))

# set_ids = []
# all_ids = []
# set_matches = {}
# print(len(match_ids))
# set_length = 10
# inserted_count = 0
# match_ids_len = len(match_ids)
# all_sets = create_sets(match_ids)
# total = 0
# for set in all_sets:
#     print(set)
#     total += len(set)
#     match_details = smite_api.getMatch("1184887368")
#     print(match_details)
    # for i in range(len(match_details) // 10):
    #         inserted_count += 1
        # match_dict = create_match_dict(match_details[i*set_length])

        # for k in range(10):
        #     player = create_player_dict(match_details[(i*10) + k])
        #     match_dict["player"+str(k)] = player
        # # mycol.insert_one(match_dict)
# print(total)


# print("Pull Completed in " + str(datetime.now() - starttime))
# print(inserted_count)