import pyrez
from datetime import datetime
from pyrez.api import SmiteAPI
import pymongo
import random
import time

from pyrez.models import Smite

client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

mydb = client["Matches"]
mycol = mydb["matches"]




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
    playerDict["Conquest_Tier"] = player.Conquest_Tier
    playerDict["Damage_Done_Magical"] = player.damageDoneMagical
    playerDict["Damage_Done_Physical"] = player.damageDonePhysical
    playerDict["Damage_Mitigated"] = player.damageMitigated
    playerDict["Damage_Taken"] = player.damageTaken
    playerDict["Deaths"] = player.deaths
    playerDict["godId"] = player["GodId"]
    playerDict["godName"] = normalize_godId(player["GodId"])
    playerDict["Gold_Earned"] = player.goldEarned
    playerDict["Gold_Per_Minute"] = player.goldPerMinute
    playerDict["Healing"] = player.healing
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
    playerDict["Kills_First_Blood"] = player.killsFirstBlood
    playerDict["Kills_Penta"] = player.killsPenta
    playerDict["Kills_Player"] = player.killsPlayer
    playerDict["Kills_Quadra"] = player.killsQuadra
    playerDict["Kills_Single"] = player.killsSingle
    playerDict["Kills_Triple"] = player.killsTriple
    playerDict["Multi_kill_Max"] = player.multiKillMax
    playerDict["Ranked_Stat_Conq"] = player.rankStatLeague
    playerDict["Region"] = player.region
    playerDict["Role"] = player["Role"]
    playerDict["PlayerId"] = player.playerId
    playerDict["Player_Name"] = player.playerName
    playerDict["Win_Status"] = player.winStatus
    playerDict["MatchID"] = player.matchId
    return playerDict

def create_match_dict(match):
    matchDict = {}
    matchDict["Entry_Datetime"] = match.entryDatetime
    matchDict["MatchId"] = match.matchId
    matchDict["Match_Duration"] = match.matchDuration
    matchDict["Ban0"] = match["Ban1"]
    matchDict["Ban1"] = match["Ban2"]
    matchDict["Ban2"] = match["Ban3"]
    matchDict["Ban3"] = match["Ban4"]
    matchDict["Ban4"] = match["Ban5"]
    matchDict["Ban5"] = match["Ban6"]
    matchDict["Ban6"] = match["Ban7"]
    matchDict["Ban7"] = match["Ban8"]
    matchDict["Ban8"] = match["Ban9"]
    matchDict["Ban9"]  = match["Ban10"]
    return matchDict

starttime = datetime.now()
creds = open("cred.txt", mode="r").read()
Smite_api = SmiteAPI(devId =creds.splitlines()[0], authKey = creds.splitlines()[1])
matchIds = Smite_api.getMatchIds(451, date=20210804, hour=-1) ### 4 pulled
print(len(matchIds))
setIds = []
allMatches = {}
setMatches = {}
print(len(matchIds))    
setLength = 10
matchIdsLen = len(matchIds)
for x in range(matchIdsLen):
    setIds.append(matchIds[x].matchId)
    if (x % 500) == 0 and x > 0:
        mycol.insert_one(setMatches)
        setMatches.clear()
        print("Set complete")
        print(datetime.now() - starttime)
    elif (x + 1) % setLength == 0 or (matchIdsLen - x < setLength and len(setMatches) > 0):
        matchDetails = Smite_api.getMatch(setIds)
        for i in range(len(matchDetails) // 10):
            matchDict = create_match_dict(matchDetails[i*setLength])
            for k in range(10):
                player = create_player_dict(matchDetails[(i*10) + k])
                matchDict["player"+str(k)] = player
            setMatches["match"+str(matchDict["MatchId"])] = matchDict

        setIds.clear()

mycol.insert_one(setMatches)
print("Pull Completed in " + str(datetime.now() - starttime))       



