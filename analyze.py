from re import S, X
from datetime import datetime
import errlogger as logger
import pymongo
from collections import OrderedDict
from operator import getitem

# from data_base_management import godsDict
import pandas as pd

godsDict = {
    "Achilles": 0,
    "Agni": 0,
    "Ah Muzen Cab": 0,
    "Ah Puch": 0,
    "Amaterasu": 0,
    "Anhur": 0,
    "Anubis": 0,
    "Ao Kuang": 0,
    "Aphrodite": 0,
    "Apollo": 0,
    "Arachne": 0,
    "Ares": 0,
    "Artemis": 0,
    "Artio": 0,
    "Athena": 0,
    "Awilix": 0,
    "Baba Yaga": 0,
    "Bacchus": 0,
    "Bakasura": 0,
    "Baron Samedi": 0,
    "Bastet": 0,
    "Bellona": 0,
    "Cabrakan": 0,
    "Camazotz": 0,
    "Cerberus": 0,
    "Cernunnos": 0,
    "Chaac": 0,
    "Chang\'e": 0,
    "Chernobog": 0,
    "Chiron": 0,
    "Chronos": 0,
    "Cthulhu": 0,
    "Cu Chulainn": 0,
    "Cupid": 0,
    "Da Ji": 0,
    "Danzaburou": 0,
    "Discordia": 0,
    "Erlang Shen": 0,
    "Eset": 0,
    "Fafnir": 0,
    "Fenrir": 0,
    "Freya": 0,
    "Ganesha": 0,
    "Geb": 0,
    "Gilgamesh": 0,
    "Guan Yu": 0,
    "Hachiman": 0,
    "Hades": 0,
    "He Bo": 0,
    "Heimdallr": 0,
    "Hel": 0,
    "Hera": 0,
    "Hercules": 0,
    "Horus": 0,
    "Hou Yi": 0,
    "Hun Batz": 0,
    "Izanami": 0,
    "Janus": 0,
    "Jing Wei": 0,
    "Jormungandr": 0,
    "Kali": 0,
    "Khepri": 0,
    "King Arthur": 0,
    "Kukulkan": 0,
    "Kumbhakarna": 0,
    "Kuzenbo": 0,
    "Loki": 0,
    "Medusa": 0,
    "Mercury": 0,
    "Merlin": 0,
    "Morgan Le Fay": 0,
    "Mulan": 0,
    "Ne Zha": 0,
    "Neith": 0,
    "Nemesis": 0,
    "Nike": 0,
    "Nox": 0,
    "Nu Wa": 0,
    "Odin": 0,
    "Olorun": 0,
    "Osiris": 0,
    "Pele": 0,
    "Persephone": 0,
    "Poseidon": 0,
    "Ra": 0,
    "Raijin": 0,
    "Rama": 0,
    "Ratatoskr": 0,
    "Ravana": 0,
    "Scylla": 0,
    "Serqet": 0,
    "Set": 0,
    "Skadi": 0,
    "Sobek": 0,
    "Sol": 0,
    "Sun Wukong": 0,
    "Susano": 0,
    "Sylvanus": 0,
    "Terra": 0,
    "Thanatos": 0,
    "The Morrigan": 0,
    "Thor": 0,
    "Thoth": 0,
    "Tiamat": 0,
    "Tsukuyomi": 0,
    "Tyr": 0,
    "Ullr": 0,
    "Vamana": 0,
    "Vulcan": 0,
    "Xbalanque": 0,
    "Xing Tian": 0,
    "Yemoja": 0,
    "Ymir": 0,
    "Zeus": 0,
    "Zhong Kui": 0
}

Tier_Three_items = [
"Ninja Tabi", "Shoes of Focus", "Relic Dagger", "Shield of Regrowth", "Lotus Crown", "Heartward Amulet",
"Sovereignty", "Jade Emperor\'s Crown", "Atalanta\'s Bow", "Shogun\'s Kusari", "Ancile", "Breastplate of Valor", "Divine Ruin",
"Poisoned Star", "The Sledge", "Mystical Mail", " Charon\'s Coin", "Runeforged Hammer", "Ichaival", "Dominance", "Spirit Robe", 
"Obsidian Shard", "Berserker\'s Shield", "Rod Asclepius", "Void Shield", "Chronos\' Pendant", "Telkhines Ring", "Typhon\'s Fang",
"Deathbringer", "Reinforced Greaves", "Talaria Boots", "Winged Blade", "Bristlebush Acorn", "Thickbark Acorn", "Odysseus\' Bow",
"Spectral Armor", "Magi\'s Cloak", "Blackthorn Hammer", "Silverbranch Bow", "Pestilence", "Bulwark of Hope", "Frostbound Hammer",
"Polynomicon", "Brawler\'s Beat Stick", "Shifter\'s Shield", "Gladiator\'s Shield", "Shadowsteel Shuriken", "Bancroft\'s Talon", 
"Hastened Katana", "Warlock\'s Staff", "Spear of the Magus", "Book of the Dead", "Spear of Desolation", "Malice", "Gem of Isolation",
"Bloodforge", "Doom Orb", "Rod of Tahuti", "Reinforced Shoes", "Traveler\'s Shoes", "Emperor\'s Armor", "Contagion", "Thistlethorn Acorn",
"Oni Hunter\'s Garb", "Celestial Legion Helm", "Runic Shield", "Genji\'s Guard", "The Executioner", "Stone of Gaia", "Demonic Grip",
"Lono\'s Mask", "Pythagorem\'s Piece", "Guanlet of Thebes", "Stone Cutting Sword", "Mail of Renewal", "The Crusher", "Book of Thoth",
"Rage", "Wind Demon", "Titan\'s Bane", "Ethereal Staff", "Transcendence", "Serrated Edge", "Hastened Ring", "Fail-not", "Heartseeker",
"Shoes of the Magi", "Warrior Tabi", "Golden Blade", "Evergreen Acorn", "Witchblade", "Soul Eater", "Hydra\'s Lament", "Talisman of Energy",
"Hide of the Nemean Lion", "Toxic Blade", "Void Stone", "Devourer\'s Gauntlet", "Midgardian Mail", "Soul Gem", "Jotunn\'s Wrath", "Stone of Fal",
"Pridwen", "Hide of the Urchin", "Caduceus Shield", "Rangda\'s Mask", "Asi", "Arondight", "Ring of Hecate", "Tyrannical Plate Helm", "Soul Reaver",
"Qin\'s Sais", "Staff of Myrddin", "Mantle of Discord"
]

Starter_items = [
"Animosity", "Archmage\'s Gem", "Benevolence", "Blood-soaked Shroud", "Bluestone Brooch", "Bluestone Pendant", "Bumba\'s Dagger",
"Bumba\'s Hammer", "Bumba\'s Spear", "Compassion", "Conduit Gem", "Corrupted Bluestone", "Death\'s Embrace", "Death\'s Temper", 
"Death\'s Toll", "Diamond Arrow", "Eye of the Jungle", "Gem of Focus", "Gilded Arrow", "Hero\'s Axe", "Hunter\'s Cowl", "Infused Sigil",
"Leader\'s Cowl", "Leather Cowl", "Manikin Hidden Blade", "Manikin Mace", "Manikin Scepter", "Ornate Arrow", "Pendulum of Ages",
"Protector of the Jungle", "Sacrifical Shroud", "Sands of Time", "Seer of the Jungle", "Sentinel\'s Boon", "Sentinel\'s Embrace",
"Sentinel\'s Gift", "Sigil of the Old Guard", "Spartan Flag", "Sundering Axe", "Tainted Amulet", "Tainted Breastplate", "Tainted Steel",
"The Alternate Timeline", "Vampiric Shroud", "War Banner", "War Flag", "Warding Sigil", "Warrior\'s Axe"
]
# info pull
# [godWR, godPR, godBR] - check, matchesPlayed - check
# relics used 
# worst matchups - check
# item breakdown - check

def get_top_builds_discord(client, god, role, **req):
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
    topDict = {
        role: {
            "slot1": {},
            "slot2": {},
            "slot3": {},
            "slot4": {},
            "slot5": {},
            "slot6": {},
        }
    }
    god = god.replace("_", " ")
    mydb = client["Items"]
    mycol = mydb[god]
    games = 0
    wins = 0
    i = 0
    for data in mycol.find():
        dataKeys = list(data.keys())
        dataKeys.remove("_id")
        for slot in data[role].keys():
            for item in data[role][slot]:
                if slot == "slot1":
                    games += data[role][slot][item][0]
                    wins += data[role][slot][item][1]
                if item:
                    if item not in topDict[role][slot].keys():
                        topDict[role][slot][item] = {"item": item, "games": data[role][slot][item][0], "wins": data[role][slot][item][1]}
                    elif item in topDict[role][slot].keys():
                        topDict[role][slot][item]["games"] += data[role][slot][item][0]
                        topDict[role][slot][item]["wins"] += data[role][slot][item][1]
    
    allDict = {
        "slot1": {
            "item1": {
                "item": "",
                "games": 0
            },
            "item2": {
                "item": "",
                "games": 0
            },
        },
        "slot2": {
            "item1": {
                "item": "",
                "games": 0
            },
            "item2": {
                "item": "",
                "games": 0
            },
        },
        "slot3": {
            "item1": {
                "item": "",
                "games": 0
            },
            "item2": {
                "item": "",
                "games": 0
            },
        },
        "slot4": {
            "item1": {
                "item": "",
                "games": 0
            },
            "item2": {
                "item": "",
                "games": 0
            },
        },
        "slot5": {
            "item1": {
                "item": "",
                "games": 0
            },
            "item2": {
                "item": "",
                "games": 0
            },
        },
        "slot6": {
            "item1": {
                "item": "",
                "games": 0
            },
            "item2": {
                "item": "",
                "games": 0
            },
        }
    }
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
    
    allURLS = {}
    for slot in allDict.keys():
        for item in allDict[slot].keys():
            itemName = allDict[slot][item]["item"]
            allDict[slot][item]["url"] = get_item(itemName)
    
    if req['req'] == "discord":
        return [allDict, [games, wins, round(wins/games*100, 2)]]
    else:
        if games == 0:
            games = 1
        return {**allDict, **{"games": games, "wins": wins, "wr": round(wins/games*100, 2)}}


def get_worst_matchups(client, god, role, **req):
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
    mydb = client["Matchups"]
    mycol = mydb[god]
    winRates = []
    toRemove = []
    games = 0
    wins = 0
    x = 0
    for data in mycol.find():
        for matchup in data:
            if role in matchup:
                index = matchup.find(role)
                enemy = matchup[0:index].strip()
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
    
    print(len(toRemove))
    for key in matchupDict.keys():
        matchupDict[key]["url"] = get_url(key)
    
    if req['req'] == "discord":
        return [matchupDict, [games, wins, round(wins/games*100, 2)]]
    else:
        # , **{"games": games, "wins": wins, "wr": round(wins/games*100, 2)}
        return matchupDict

def get_worst_matchups_by_rank(client, god, role, rank, **req):
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
    mydb = client["Matchups_by_Rank"]
    mycol = mydb[god]
    winRates = []
    toRemove = []
    games = 0
    wins = 0
    x = 0
    for data in mycol.find():
        for matchup in data:
            if role in matchup and rank in matchup:
                index = matchup.find(role)
                enemy = matchup[0:index].strip()
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
    
    print(len(toRemove))
    for key in matchupDict.keys():
        matchupDict[key]["url"] = get_url(key)
    
    if req['req'] == "discord":
        if games == 0:
            [matchupDict, [games, wins, 0]]
        else:
            return [matchupDict, [games, wins, round(wins/games*100, 2)]]
    else:
        # , **{"games": games, "wins": wins, "wr": round(wins/games*100, 2)}
        return matchupDict

def get_top_builds_discord_by_rank(client, god, role, *rank, **req):
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
    topDict = {
        role: {
            "slot1": {},
            "slot2": {},
            "slot3": {},
            "slot4": {},
            "slot5": {},
            "slot6": {},
        }
    }
    rank = rank[0]
    god = god.replace("_", " ")
    mydb = client["Items_by_Rank"]
    mycol = mydb[god]
    games = 0
    wins = 0
    i = 0
    for data in mycol.find():
        dataKeys = list(data.keys())
        dataKeys.remove("_id")
        for slot in data[rank][role].keys():
            for item in data[rank][role][slot].keys():
                if slot == "slot1":
                    games += data[rank][role][slot][item][0]
                    wins += data[rank][role][slot][item][1]
                if item in Tier_Three_items or item in Starter_items:
                    if item not in topDict[role][slot].keys():
                        topDict[role][slot][item] = {"item": item, "games": data[rank][role][slot][item][0], "wins": data[rank][role][slot][item][1]}
                    elif item in topDict[role][slot].keys():
                        topDict[role][slot][item]["games"] += data[rank][role][slot][item][0]
                        topDict[role][slot][item]["wins"] += data[rank][role][slot][item][1]
    allDict = {
        "slot1": {
            "item1": {
                "item": "",
                "games": 0
            },
            "item2": {
                "item": "",
                "games": 0
            },
        },
        "slot2": {
            "item1": {
                "item": "",
                "games": 0
            },
            "item2": {
                "item": "",
                "games": 0
            },
        },
        "slot3": {
            "item1": {
                "item": "",
                "games": 0
            },
            "item2": {
                "item": "",
                "games": 0
            },
        },
        "slot4": {
            "item1": {
                "item": "",
                "games": 0
            },
            "item2": {
                "item": "",
                "games": 0
            },
        },
        "slot5": {
            "item1": {
                "item": "",
                "games": 0
            },
            "item2": {
                "item": "",
                "games": 0
            },
        },
        "slot6": {
            "item1": {
                "item": "",
                "games": 0
            },
            "item2": {
                "item": "",
                "games": 0
            },
        }
    }
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
    
    allURLS = {}
    for slot in allDict.keys():
        for item in allDict[slot].keys():
            itemName = allDict[slot][item]["item"]
            allDict[slot][item]["url"] = get_item(itemName)

    
    if req['req'] == "discord":
        return [allDict, [games, wins, round(wins/games*100, 2)]]
    else:
        if games == 0:
            games = 1
        return {**allDict, **{"games": games, "wins": wins, "wr": round(wins/games*100, 2)}}


def get_pb_rate(client, god, **req):
    """ # need to grab # of matches played by god, number of matches played, number of bans

    Args:
        client ([type]): [description]
        god ([type]): [description]
        role ([type]): [description]`
    """
    god = god.replace("_"," ")
    totalMatches = 0
    godMatches = 0
    godBans = 0
    mydb = client["Matches"]
    mycol = mydb["Entry_1"]
    bandb = client["godBans"]
    bancol = bandb[god]
    totalcol = mydb["Total_Matches"]
    for set in totalcol.find():
        totalMatches = set["Total_Matches"]
    for set in mycol.find():
        godMatches += set[god]
    for set in bancol.find():
        godBans += set["bans"]

    if req['req'] == "discord":
        return [godMatches, godBans, totalMatches]
    else:
        return {"godBans": godBans, "totalMatches": totalMatches}

def get_url(god):
    god = god.replace("_"," ")
    god = god.replace(" ", "-")
    if god == "Chang\'e":
        god = "change"
    url = "https://webcdn.hirezstudios.com/smite/god-icons/{}.jpg".format(god.lower())
    return {"url": url}

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
        frontEndDict[god] = {**get_url(god), "name": god}
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
    if rank:
        mydb = client["Items_by_Rank"]
    else:
        mydb = client["Items"]
    mycol = mydb[god]
    games = 0
    wins = 0
    i = 0
    for data in mycol.find():
        if rank:
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
