from datetime import datetime
from collections import ChainMap
from collections import defaultdict
import timeit
from main import client
import pandas as pd



class godData:
    """class object for gods to store Winrates of specific items and matchups"""

    def __init__(self, name):
        self.name = name
        self.bans = 0
        self.matches = {}
        self.matchups = {}
        self.items = {
            "Solo": {
                "slot1": {},
                "slot2": {},
                "slot3": {},
                "slot4": {},
                "slot5": {},
                "slot6": {},
            },
            "Jungle": {
                "slot1": {},
                "slot2": {},
                "slot3": {},
                "slot4": {},
                "slot5": {},
                "slot6": {},
            },
            "Mid": {
                "slot1": {},
                "slot2": {},
                "slot3": {},
                "slot4": {},
                "slot5": {},
                "slot6": {},
            },
            "Carry": {
                "slot1": {},
                "slot2": {},
                "slot3": {},
                "slot4": {},
                "slot5": {},
                "slot6": {},
            },
            "Support": {
                "slot1": {},
                "slot2": {},
                "slot3": {},
                "slot4": {},
                "slot5": {},
                "slot6": {},
            },
        }

    def set_matches(self, data):
        """[summary]

        Args:
            match (dict): a dict of all matches the god is in
        """
        matchkeys = []
        for key in data:
            matchkeys.append(key)
        matchkeys.pop(0)
        for i in range(len(matchkeys)):
            for j in range(10):
                if data[matchkeys[i]]["player"+str(j)]["godName"] == self.name:
                    self.matches[matchkeys[i]] = data[matchkeys[i]]
                if "Ban0" in data[matchkeys[i]].keys():
                    if data[matchkeys[i]]["Ban"+str(j)] == self.name:
                        self.bans += 1

    def calc_wr_matches(self):
        """[summary]

        Args:
            enemies (list): list of gods to calc wr for god
        """
        for matchup in self.matches:
            for i in range(10):
                if self.matches[matchup]["player"+str(i)]["godName"] == self.name:
                    player = i
            for i in range(10):
                if self.matches[matchup]["player"+str(i)]["Role"] == self.matches[matchup]["player"+str(player)]["Role"]:
                    if self.matches[matchup]["player"+str(i)]["godName"] + " " + self.matches[matchup]["player"+str(i)]["Role"] not in self.matchups.keys():
                        self.matchups[self.matches[matchup]["player"+str(
                            i)]["godName"] + " " + self.matches[matchup]["player"+str(i)]["Role"]] = [1, 0]
                    else:
                        self.matchups[self.matches[matchup]["player"+str(
                            i)]["godName"] + " " + self.matches[matchup]["player"+str(i)]["Role"]][0] += 1

                    if self.matches[matchup]["player"+str(i)]["Win_Status"] == "Winner":
                        self.matchups[self.matches[matchup]["player"+str(
                            i)]["godName"] + " " + self.matches[matchup]["player"+str(i)]["Role"]][1] += 1

    def get_wr_matches(self):
        """getter method for gods matchup wr

        Returns:
            dict: a dict of each matchup and its respective wr
        """
        return self.matchups

    def set_item_slots(self):
        """ get count of each item in slot """
        for match in self.matches:
            for i in range(10):
                try:
                    if self.matches[match]["player"+str(i)]["godName"] == self.name:
                        self.items[self.matches[match]["player"+str(i)]["Role"]]["slot1"].update(
                            {self.matches[match]["player"+str(i)]["Item_Purch_1"]: [0, 0]})
                        self.items[self.matches[match]["player"+str(i)]["Role"]]["slot2"].update(
                            {self.matches[match]["player"+str(i)]["Item_Purch_2"]: [0, 0]})
                        self.items[self.matches[match]["player"+str(i)]["Role"]]["slot3"].update(
                            {self.matches[match]["player"+str(i)]["Item_Purch_3"]: [0, 0]})
                        self.items[self.matches[match]["player"+str(i)]["Role"]]["slot4"].update(
                            {self.matches[match]["player"+str(i)]["Item_Purch_4"]: [0, 0]})
                        self.items[self.matches[match]["player"+str(i)]["Role"]]["slot5"].update(
                            {self.matches[match]["player"+str(i)]["Item_Purch_5"]: [0, 0]})
                        self.items[self.matches[match]["player"+str(i)]["Role"]]["slot6"].update(
                            {self.matches[match]["player"+str(i)]["Item_Purch_6"]: [0, 0]})
                except KeyError:
                    print("Error in: "+match)

        for match in self.matches:
            for i in range(10):
                if self.matches[match]["player"+str(i)]["godName"] == self.name:
                    num1 = self.items[self.matches[match]["player"+str(
                        i)]["Role"]]["slot1"][self.matches[match]["player"+str(i)]["Item_Purch_1"]][0]
                    num2 = self.items[self.matches[match]["player"+str(
                        i)]["Role"]]["slot2"][self.matches[match]["player"+str(i)]["Item_Purch_2"]][0]
                    num3 = self.items[self.matches[match]["player"+str(
                        i)]["Role"]]["slot3"][self.matches[match]["player"+str(i)]["Item_Purch_3"]][0]
                    num4 = self.items[self.matches[match]["player"+str(
                        i)]["Role"]]["slot4"][self.matches[match]["player"+str(i)]["Item_Purch_4"]][0]
                    num5 = self.items[self.matches[match]["player"+str(
                        i)]["Role"]]["slot5"][self.matches[match]["player"+str(i)]["Item_Purch_5"]][0]
                    num6 = self.items[self.matches[match]["player"+str(
                        i)]["Role"]]["slot6"][self.matches[match]["player"+str(i)]["Item_Purch_6"]][0]

                    num1 += 1
                    num2 += 1
                    num3 += 1
                    num4 += 1
                    num5 += 1
                    num6 += 1

                    self.items[self.matches[match]["player"+str(i)]["Role"]]["slot1"].update(
                        {self.matches[match]["player"+str(i)]["Item_Purch_1"]: [num1, 0]})
                    self.items[self.matches[match]["player"+str(i)]["Role"]]["slot2"].update(
                        {self.matches[match]["player"+str(i)]["Item_Purch_2"]: [num2, 0]})
                    self.items[self.matches[match]["player"+str(i)]["Role"]]["slot3"].update(
                        {self.matches[match]["player"+str(i)]["Item_Purch_3"]: [num3, 0]})
                    self.items[self.matches[match]["player"+str(i)]["Role"]]["slot4"].update(
                        {self.matches[match]["player"+str(i)]["Item_Purch_4"]: [num4, 0]})
                    self.items[self.matches[match]["player"+str(i)]["Role"]]["slot5"].update(
                        {self.matches[match]["player"+str(i)]["Item_Purch_5"]: [num5, 0]})
                    self.items[self.matches[match]["player"+str(i)]["Role"]]["slot6"].update(
                        {self.matches[match]["player"+str(i)]["Item_Purch_6"]: [num6, 0]})

    def calc_wr_items(self):
        """function to calculate best items by wr per slot"""
        for match in self.matches:
            for i in range(10):
                if self.matches[match]["player"+str(i)]["godName"] == self.name:
                    if self.matches[match]["player"+str(i)]["Win_Status"] == "Winner":
                        wins1 = self.items[self.matches[match]["player"+str(
                            i)]["Role"]]["slot1"][self.matches[match]["player"+str(i)]["Item_Purch_1"]][1] + 1
                        wins2 = self.items[self.matches[match]["player"+str(
                            i)]["Role"]]["slot2"][self.matches[match]["player"+str(i)]["Item_Purch_2"]][1] + 1
                        wins3 = self.items[self.matches[match]["player"+str(
                            i)]["Role"]]["slot3"][self.matches[match]["player"+str(i)]["Item_Purch_3"]][1] + 1
                        wins4 = self.items[self.matches[match]["player"+str(
                            i)]["Role"]]["slot4"][self.matches[match]["player"+str(i)]["Item_Purch_4"]][1] + 1
                        wins5 = self.items[self.matches[match]["player"+str(
                            i)]["Role"]]["slot5"][self.matches[match]["player"+str(i)]["Item_Purch_5"]][1] + 1
                        wins6 = self.items[self.matches[match]["player"+str(
                            i)]["Role"]]["slot6"][self.matches[match]["player"+str(i)]["Item_Purch_6"]][1] + 1

                        total1 = self.items[self.matches[match]["player"+str(
                            i)]["Role"]]["slot1"][self.matches[match]["player"+str(i)]["Item_Purch_1"]][0]
                        total2 = self.items[self.matches[match]["player"+str(
                            i)]["Role"]]["slot2"][self.matches[match]["player"+str(i)]["Item_Purch_2"]][0]
                        total3 = self.items[self.matches[match]["player"+str(
                            i)]["Role"]]["slot3"][self.matches[match]["player"+str(i)]["Item_Purch_3"]][0]
                        total4 = self.items[self.matches[match]["player"+str(
                            i)]["Role"]]["slot4"][self.matches[match]["player"+str(i)]["Item_Purch_4"]][0]
                        total5 = self.items[self.matches[match]["player"+str(
                            i)]["Role"]]["slot5"][self.matches[match]["player"+str(i)]["Item_Purch_5"]][0]
                        total6 = self.items[self.matches[match]["player"+str(
                            i)]["Role"]]["slot6"][self.matches[match]["player"+str(i)]["Item_Purch_6"]][0]

                        self.items[self.matches[match]["player"+str(i)]["Role"]]["slot1"].update(
                            {self.matches[match]["player"+str(i)]["Item_Purch_1"]: [total1, wins1]})
                        self.items[self.matches[match]["player"+str(i)]["Role"]]["slot2"].update(
                            {self.matches[match]["player"+str(i)]["Item_Purch_2"]: [total2, wins2]})
                        self.items[self.matches[match]["player"+str(i)]["Role"]]["slot3"].update(
                            {self.matches[match]["player"+str(i)]["Item_Purch_3"]: [total3, wins3]})
                        self.items[self.matches[match]["player"+str(i)]["Role"]]["slot4"].update(
                            {self.matches[match]["player"+str(i)]["Item_Purch_4"]: [total4, wins4]})
                        self.items[self.matches[match]["player"+str(i)]["Role"]]["slot5"].update(
                            {self.matches[match]["player"+str(i)]["Item_Purch_5"]: [total5, wins5]})
                        self.items[self.matches[match]["player"+str(i)]["Role"]]["slot6"].update(
                            {self.matches[match]["player"+str(i)]["Item_Purch_6"]: [total6, wins6]})

    def get_wr_items(self):
        """getter method for gods best item wr
        Returns:
            dict: a dict of each item slots best wr for god
        """
        for role in self.items.keys():
            for slot in self.items[role].keys():
                for items in self.items[role][slot].keys():

                    total = self.items[role][slot][items][0]
                    wins = self.items[role][slot][items][1]
                    self.items[role][slot].update(
                        {items: [total, wins, round((wins/total)*100, 2)]})

        return self.items


def create_matches_list(keys):
    matches = []
    for key in keys:
        matches.append(key)
    matches.pop(0)
    return matches


def merge(d1, d2):
    return {**d1, **d2}


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

# Assassins = ["Arachne", "Awilix", "Bakasura", "Bastet", "Camazotz", "Da Ji", "Fenrir", "Hun Batz", "Kali", "Loki", "Mercury", "Ne Zha", "Nemesis", "Pele", "Ratatoskr", "Ravana", "Serqet", "Set", "Susano", "Thanatos", "Thor"]
# Guardians = ["Ares", "Artio", "Athena", "Bacchus", "Cabrakan", "Cerberus",  "Fafnir", "Ganesha", "Geb", "Jormungandr", "Khepri", "Kumbhakarna", "Kuzenbo", "Sobek", "Sylvanus", "Terra", "Xing Tian", "Yemoja", "Ymir"]
# Hunters = ["Ah Muzen Cab", "Anhur", "Apollo", "Artemis", "Cernunnos", "Chernobog", "Chiron", "Cupid", "Hachiman", "Hou Yi", " Izanami", "Jing Wei", "Medusa", "Neith", "Rama", "Skadi", "Ullr", "Xbalanque"]
# Mages = ["Agni", "Ah Puch", "Anubis", "Ao Kuang", "Aphrodite", "Baba Yaga", "Baron Samedi", "Chang\'e", "Chronos", "Discordia", "Eset", "Freya", "Hades", "He Bo", "Hel", "Hera", "Janus", "Kukulkan", "Merlin", "Nox",
# "Nu Wa", "Olorun", "Persephone", "Poseidon", "Ra", "Raijin", "Scylla", "Sol", "The Morrigan", "Thoth", "Tiamat", "Vulcan", "Zeus", "Zhong Kui"]
# Warriors = ["Amaterasu", "Achilles", "Bellona", "Chaac", "Cu Chulainn", "Erlang Shen", "Guan Yu", "Herculues", "Horus", "King Arthur", "Mulan", "Nike", "Odin", "Osiris", "Sun Wukong", "Tyr", "Vamana"]

mydb = client["Matches"]
mycol = mydb["matches"]

            
starttime = datetime.now()
godsStatDict = {}
data = mycol.find()
index = 59
godsdb = client["Matchups"]
itemsdb = client["Items"]
godmatchesdb = client["godMatches"]
bansdb = client["godBans"]
sets = []
x = 0
matches = 0
setsFinished = 0
for set in data:
    if x >= index:
        sets.append(set)
    x += 1
    
while setsFinished < len(sets):
    dataDict = sets[setsFinished]
    keys = dataDict.keys()
    matchKeys = create_matches_list(keys)

    for key in godsDict.keys():
        newEntry = godData(key)
        godsStatDict[key] = newEntry

    for key in godsDict.keys():
        newEntry = godData(key)
        godsStatDict[key] = newEntry
        godsdbCol = godsdb[key]
        itemsdbCol = itemsdb[key]
        godmatchesCol = godmatchesdb[key]
        bansCol = bansdb[key]
        godsStatDict[key].set_matches(dataDict)
        godsStatDict[key].calc_wr_matches()
        godsStatDict[key].set_item_slots()
        godsStatDict[key].calc_wr_items()
        godsdbCol.insert_one(godsStatDict[key].get_wr_matches())
        itemsdbCol.insert_one(godsStatDict[key].get_wr_items())
        bansCol.insert_one({"bans": godsStatDict[key].bans})
        print("God done: "+key)
    setsFinished += 1
    print(datetime.now() - starttime)

print(datetime.now() - starttime)
print(matches)

