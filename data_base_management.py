import pymongo
import pandas as pd
from collections import OrderedDict
from operator import getitem
import analyze as anlz

client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")


Assassins = ["Arachne", "Awilix", "Bakasura", "Bastet", "Camazotz", "Da Ji", "Fenrir", "Hun Batz", "Kali", "Loki",
    "Mercury", "Ne Zha", "Nemesis", "Pele", "Ratatoskr", "Ravana", "Serqet", "Set", "Susano", "Thanatos", "Thor"]
Guardians = ["Ares", "Artio", "Athena", "Bacchus", "Cabrakan", "Cerberus",  "Fafnir", "Ganesha", "Geb",
    "Jormungandr", "Khepri", "Kumbhakarna", "Kuzenbo", "Sobek", "Sylvanus", "Terra", "Xing Tian", "Yemoja", "Ymir"]
Hunters = ["Ah Muzen Cab", "Anhur", "Apollo", "Artemis", "Cernunnos", "Chernobog", "Chiron", "Cupid", "Danzaburou",
    "Hachiman", "Heimdallr", "Hou Yi", "Izanami", "Jing Wei", "Medusa", "Neith", "Rama", "Skadi", "Ullr", "Xbalanque"]
Mages = ["Agni", "Ah Puch", "Anubis", "Ao Kuang", "Aphrodite", "Baba Yaga", "Baron Samedi", "Chang\'e", "Chronos", "Discordia", "Eset", "Freya", "Hades", "He Bo", "Hel", "Hera", "Janus", "Kukulkan", "Merlin", "Nox",
"Nu Wa", "Olorun", "Persephone", "Poseidon", "Ra", "Raijin", "Scylla", "Sol", "The Morrigan", "Thoth", "Tiamat", "Vulcan", "Zeus", "Zhong Kui"]
Warriors = ["Amaterasu", "Achilles", "Bellona", "Chaac", "Cu Chulainn", "Erlang Shen", "Guan Yu",
    "Herculues", "Horus", "King Arthur", "Mulan", "Nike", "Odin", "Osiris", "Sun Wukong", "Tyr", "Vamana"]

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


def clear_nonmatches(client):
    dblist = client.list_database_names()
    for db in dblist:
        if db == "Matches":
            print("Matches")
        else:
            client.drop_database(db)


def calc_total_matches(client):
    mydb = client["Matches"]
    mycol = mydb["matches"]
    games = 0
    for set in mycol.find():
        keys = list(set.keys())
        keys.pop(0)
        games += len(keys)
    return games


def get_last_day(client):
    mydb = client["Matches"]
    mycol = mydb["matches"]
    for set in mycol.find():
        keys = list(set.keys())
        keys.pop(0)
        print(set[keys[0]]["Entry_Datetime"])


def insert_matches():
    Total = calc_total_matches(client)
    mydb = client["Matches"]
    mycol = mydb["Total_Matches"]
    mycol.insert_one({"Total_Matches": Total})


def calc_ranks(client, role):
    allGods = {
        role: {},
    }
    for god in godsDict.keys():
        games, wins, winrate = anlz.get_extended_winrate(client, god, role)
        if games > 517:
            matches, bans, totalMatches = anlz.get_pb_rate(
                client, god, req="discord")
            counterMatchups = anlz.get_worst_matchups(
                client, god, role, req="None")
            allGods[role][god] = {"bans": bans, "god": god, "games": games, "pickRate": round(games/totalMatches * 100, 2),
            "banRate": round(bans/totalMatches * 100, 2), "role": role, "wins": wins, "winRate": winrate, "counterMatchups": counterMatchups}
        print("god done: {} {}".format(god, role))
    return allGods

def make_tier_list(client, role):
    allDict = calc_ranks(client, role)
    testDict = allDict[role]
    return testDict
    
def get_ranks(client):
    mydb = client["Matches"]
    mycol = mydb["matches"]
    playersId = []
    ranks = {}
    for doc in mycol.find():
        matches = list(doc.keys())
        for match in matches:
            if match != "_id": 
                for player in doc[match].keys():
                    if "player" in player:
                        if doc[match][player]["PlayerId"] not in playersId:
                            if doc[match][player]["Conquest_Tier"] in ranks.keys():
                                ranks[doc[match][player]["Conquest_Tier"]] += 1
                            else:
                                ranks[doc[match][player]["Conquest_Tier"]] = 1

                            if doc[match][player]["PlayerId"] != 0:
                                playersId.append(doc[match][player]["PlayerId"])
    return ranks


def get_mmrs(client):
    mydb = client["Matches"]
    mycol = mydb["matches"]
    playersId = []
    mmrs = {
        "0-250": 0,
        "251-500": 0,
        "501-750": 0,
        "751-1000": 0,
        "1001-1250": 0,
        "1251-1500": 0,
        "1501-1750": 0,
        "1751-2000": 0,
        "2001-2250": 0,
        "2251-2500": 0,
        "2501-2750": 0,
        "2751-3000": 0,
        "3001-3250": 0,
        "3251-3500": 0,
    }

    for doc in mycol.find():
        matches = list(doc.keys())
        for match in matches:
            if match != "_id": 
                for player in doc[match].keys():
                    if "player" in player:
                        if doc[match][player]["PlayerId"] not in playersId:
                            pass
                            # if doc[match][player]["Ranked_Stat_Conq"] <= 250:
                            #     mmrs["0-250"] +=1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 251 and doc[match][player]["Ranked_Stat_Conq"] <= 500:
                            #     mmrs["251-500"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 501 and doc[match][player]["Ranked_Stat_Conq"] <= 750:
                            #     mmrs["501-750"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 751 and doc[match][player]["Ranked_Stat_Conq"] <= 1000:
                            #     mmrs["751-1000"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 1001 and doc[match][player]["Ranked_Stat_Conq"] <= 1250:
                            #     mmrs["1001-1250"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 1251 and doc[match][player]["Ranked_Stat_Conq"] <= 1500:
                            #     mmrs["1251-1500"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 1501 and doc[match][player]["Ranked_Stat_Conq"] <= 1750:
                            #     mmrs["1501-1750"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 1751 and doc[match][player]["Ranked_Stat_Conq"] <= 2000:
                            #     mmrs["1751-2000"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 2001 and doc[match][player]["Ranked_Stat_Conq"] <= 2250:
                            #     mmrs["2001-2250"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 2251 and doc[match][player]["Ranked_Stat_Conq"] <= 2500:
                            #     mmrs["2251-2500"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 2501 and doc[match][player]["Ranked_Stat_Conq"] <= 2750:
                            #     mmrs["2501-2750"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 2751 and doc[match][player]["Ranked_Stat_Conq"] <= 3000:
                            #     mmrs["2751-3000"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 3001 and doc[match][player]["Ranked_Stat_Conq"] <= 3250:
                            #     mmrs["3000-3250"] += 1
                            # elif doc[match][player]["Ranked_Stat_Conq"] > 3251 and doc[match][player]["Ranked_Stat_Conq"] <= 3500:
                            #     mmrs["3251-3500"] += 1


# roles = ["Carry", "Support", "Mid", "Jungle", "Solo"]
# for role in roles: 
#     tList = make_tier_list(client, role)
#     mydb = client["Tier_List"]
#     mycol = mydb["8/14/2021 - {}".format(role)]
#     mycol.insert_one(tList)


# if __name__ == "__main__":        
#     for key in godsDict:
#         if key in Assassins:
#             role = "Jungle"
#         elif key in Guardians:
#             role = "Support"
#         elif key in Hunters:
#             role = "Carry"
#         elif key in Mages:
#             role = "Mid"
#         else:
#             role = "Solo"
#         newkey = key.replace(" ", "_")
#         newkey = newkey.replace("'", "\'")
#         print("@app.route(\'/"+newkey+"\')")
#         print("def get_"+newkey+"():")
#         print("\tbuild = anlz.get_top_builds(client, \'"+newkey+"\' , \'"+role+"\', req=\'flask\')")
#         print("\tpbRate = anlz.get_pb_rate(client, \'"+newkey+"\', req=\'flask\')")
#         print("\timage = anlz.get_url(\'"+newkey+"\')")
#         print("\tdataDict = {**build, **pbRate, **image}")
#         print("\treturn dataDict")
#         print("\n")
#         print("@app.route(\'/"+newkey+"/matchups\')")
#         print("def get_"+newkey+"_matchups():")
#         print("\treturn anlz.get_worst_matchups(client, \'"+newkey+"\' , \'"+role+"\', req=\'flask\')")
#         print("\n")
#         print("@app.route(\'/"+newkey+"/abilities\')")
#         print("def get_"+newkey+"_abilities():")
#         print("\treturn anlz.get_abilities(\'"+newkey+"\')")
#         print("\n")
