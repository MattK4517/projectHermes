import pyrez
from datetime import datetime
from pyrez.api import SmiteAPI
from pyrez.models import Smite
from pyrez.models.MatchHistory import MatchHistory
from data_pull_formatting_rewrite import format_no_query
from __init__ import client


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
        4039: "Shiva",
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
        4060: "Yu Huang",
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
    playerDict["Rank_Stat_Joust"] = player["Rank_Stat_Joust"]
    playerDict["Ranked_Stat_Duel"] = player["Rank_Stat_Duel"]
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
    return playerDict


def create_match_dict(match, patch, input_type):
    match_dict = {}
    match_dict["Patch"] = patch
    match_dict["Entry_Datetime"] = match.entryDatetime.split()[0]
    match_dict["MatchId"] = match.matchId
    match_dict["Match_Duration"] = match.matchDuration
    match_dict["Minutes"] = match["Minutes"]
    match_dict["Input_Type"] = input_type
    match_dict["Ban0"] = match["Ban1"]
    match_dict["Ban1"] = match["Ban2"]
    match_dict["Ban2"] = match["Ban3"]
    match_dict["Ban3"] = match["Ban4"]
    match_dict["Ban4"] = match["Ban5"]
    match_dict["Ban5"] = match["Ban6"]
    match_dict["Ban6"] = match["Ban7"]
    match_dict["Ban7"] = match["Ban8"]
    match_dict["Ban8"] = match["Ban9"]
    match_dict["Ban9"] = match["Ban10"]
    match_dict["First_Ban_Side"] = match["First_Ban_Side"]
    return match_dict


def create_sets(data, mode, queue_type, patch):
    db_string = ""
    if queue_type == "Ranked":
        db_string = "Matches"
    elif queue_type == "Casual":
        db_string = "CasualMatches"

    mydb = client[db_string]
    col_string = ""
    if mode == "Conquest":
        col_string = f"{patch} Matches"
    else:
        col_string = f"{patch} {mode} Matches"

    mycol = mydb[col_string]
    print("HERE", db_string, col_string)

    existing = []
    for x in mycol.find({}, {"MatchId": 1, "_id": 0}):
        existing.append(x["MatchId"])

    total = 0
    sets = []
    set = []
    for matchId in data:
        if int(matchId.matchId) not in existing:
            set.append(matchId.matchId)
            total += 1
            if len(set) == 10:
                sets.append(set)
                set = []
    if len(set) != 0:
        sets.append(set)
    print("TOTAL IN SET: ", total)
    return sets


def get_date():
    time = datetime.now()
    return f"{time.year}{time.month}{time.day}"


def get_queue_id(queue_type, mode, input_type):
    queue_id = 0
    if queue_type == "Ranked":
        if mode == "Conquest":
            if input_type == "KBM":
                queue_id = 451
            elif input_type == "Controller":
                queue_id = 504

        elif mode == "Joust":
            if input_type == "KBM":
                queue_id = 450
            elif input_type == "Controller":
                queue_id = 503

        elif mode == "Duel":
            if input_type == "KBM":
                queue_id = 440
            elif input_type == "Controller":
                queue_id = 502

    elif queue_type == "Casual":
        if mode == "Conquest":
            queue_id = 426

        elif mode == "Joust":
            queue_id = 448

        elif mode == "Arena":
            queue_id = 435

        elif mode == "Assault":
            queue_id = 445

        elif mode == "Slash":
            queue_id = 10189

    return queue_id


def run_pull(patch, hour, queue_type, mode, input_type, date=get_date()):
    starttime = datetime.now()
    with open("cred.txt", "r") as f:
        data = f.readlines()
        smite_api = SmiteAPI(devId=data[0].strip(
        ), authKey=data[1].strip(), responseFormat=pyrez.Format.JSON)

    db_string = ""
    if queue_type == "Ranked":
        db_string = "Matches"
    elif queue_type == "Casual":
        db_string = "CasualMatches"

    mydb = client[db_string]
    col_string = ""
    if mode == "Conquest":
        col_string = f"{patch} Matches"
    else:
        col_string = f"{patch} {mode} Matches"

    mycol = mydb[col_string]
    print(db_string, col_string)
    date = date
    queue_id = get_queue_id(queue_type, mode, input_type)
    if queue_id == 0:
        print(queue_type, mode, input_type)
        return

    match_ids = smite_api.getMatchIds(queue_id, date=date, hour=hour)
    inserted_count = 0
    match_ids_len = len(match_ids)
    all_sets = create_sets(match_ids, mode, queue_type, patch)
    print(f"{queue_id} {queue_type} {mode}: {len(match_ids)}")
    for set in all_sets:

        try:
            data = []
            match_details = smite_api.getMatch(set)
            ids = []
            for i in range(len(match_details)):
                if match_details[i].matchId not in ids:
                    match_dict = create_match_dict(
                        match_details[i], patch, input_type)
                    player = create_player_dict(match_details[i])
                    match_dict[f"player{len(match_dict.keys())-17}"] = player
                    data.append(match_dict)
                    ids.append(match_dict["MatchId"])
                else:
                    for match in data:
                        if match["MatchId"] == match_details[i].matchId:
                            player = create_player_dict(match_details[i])
                            match[f"player{len(match.keys())-17}"] = player

            mycol.insert_many(data)
            format_no_query(data, mode, queue_type, input_type)
            inserted_count += len(data)

        except IndexError:
            print(set)
        except TypeError:
            print(f"{date} Pull Completed in {str(datetime.now() - starttime)} loss: {100-round(inserted_count/match_ids_len*100, 2)}")

    if match_ids_len > 0:
        print(f"{date} Pull Completed in {str(datetime.now() - starttime)} loss: {100-round(inserted_count/match_ids_len*100, 2)}")


if __name__ == "__main__":
    with open("/home/matt4517k/mysite/cred.txt", "r") as f:
        data = f.readlines()
        smite_api = SmiteAPI(devId=data[0].strip(
        ), authKey=data[1].strip(), responseFormat=pyrez.Format.JSON)
        print(smite_api.ping())
