from datetime import datetime
from collections import ChainMap
from collections import defaultdict
import timeit
import pymongo
import pandas as pd
import analyze as anlz
import time

from constants import godsDict, roles, ranks, slots


client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")


class GodData:
    """class object for gods to store Winrates of specific items and matchups"""

    def __init__(self, name, slots, ranks, roles):
        self.name = name
        self.rankCounter = {}
        self.bans = 0
        self.ranks = []
        self.matches = {}
        self.matchups = {}
        self.matchups_by_rank = {}
        self.items = {role: { slot: {} for slot in slots} for role in roles}
        self.items_by_rank = {rank: {role: { slot: {} for slot in slots} for role in roles} for rank in ranks}


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
                    self.ranks.append(data[matchkeys[i]]
                                      ["player"+str(j)]["Conquest_Tier"])
                if "Ban0" in data[matchkeys[i]].keys():
                    if data[matchkeys[i]]["Ban"+str(j)] == self.name:
                        self.bans += 1

        temp = []
        for rank in self.ranks:
            temp.append(normalize_rank(rank))

        self.ranks = temp
        self.ranks.sort()
        for rank in self.ranks:
            self.rankCounter[rank] = self.ranks.count(rank)

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

    def set_item_slots_by_rank(self):
        rankTrack = {}
        for rank in self.ranks:
            if rank not in rankTrack.keys():
                rankTrack[rank] = 0
            for match in self.matches:
                if rankTrack[rank] != self.rankCounter[rank]:
                    for i in range(10):
                        if self.matches[match]["player"+str(i)]["godName"] == self.name and normalize_rank(self.matches[match]["player"+str(i)]["Conquest_Tier"]) == rank:
                            #print("{} {} {}".format(rank, self.name, self.matches[match]["player"+str(i)]["Role"]))
                            self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot1"].update(
                                {self.matches[match]["player"+str(i)]["Item_Purch_1"]: [0, 0]})
                            self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot2"].update(
                                {self.matches[match]["player"+str(i)]["Item_Purch_2"]: [0, 0]})
                            self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot3"].update(
                                {self.matches[match]["player"+str(i)]["Item_Purch_3"]: [0, 0]})
                            self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot4"].update(
                                {self.matches[match]["player"+str(i)]["Item_Purch_4"]: [0, 0]})
                            self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot5"].update(
                                {self.matches[match]["player"+str(i)]["Item_Purch_5"]: [0, 0]})
                            self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot6"].update(
                                {self.matches[match]["player"+str(i)]["Item_Purch_6"]: [0, 0]})
                            rankTrack[rank] += 1

        rankTrack1 = {}
        for rank in self.ranks:
            if rank not in rankTrack1.keys():
                rankTrack1[rank] = 0
            for match in self.matches:
                if rankTrack1[rank] != self.rankCounter[rank]:
                    for i in range(10):
                        if self.matches[match]["player"+str(i)]["godName"] == self.name and normalize_rank(self.matches[match]["player"+str(i)]["Conquest_Tier"]) == rank:
                            num1 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                i)]["Role"]]["slot1"][self.matches[match]["player"+str(i)]["Item_Purch_1"]][0]
                            num2 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                i)]["Role"]]["slot2"][self.matches[match]["player"+str(i)]["Item_Purch_2"]][0]
                            num3 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                i)]["Role"]]["slot3"][self.matches[match]["player"+str(i)]["Item_Purch_3"]][0]
                            num4 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                i)]["Role"]]["slot4"][self.matches[match]["player"+str(i)]["Item_Purch_4"]][0]
                            num5 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                i)]["Role"]]["slot5"][self.matches[match]["player"+str(i)]["Item_Purch_5"]][0]
                            num6 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                i)]["Role"]]["slot6"][self.matches[match]["player"+str(i)]["Item_Purch_6"]][0]

                            num1 += 1
                            num2 += 1
                            num3 += 1
                            num4 += 1
                            num5 += 1
                            num6 += 1

                            self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot1"].update(
                                {self.matches[match]["player"+str(i)]["Item_Purch_1"]: [num1, 0]})
                            self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot2"].update(
                                {self.matches[match]["player"+str(i)]["Item_Purch_2"]: [num2, 0]})
                            self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot3"].update(
                                {self.matches[match]["player"+str(i)]["Item_Purch_3"]: [num3, 0]})
                            self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot4"].update(
                                {self.matches[match]["player"+str(i)]["Item_Purch_4"]: [num4, 0]})
                            self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot5"].update(
                                {self.matches[match]["player"+str(i)]["Item_Purch_5"]: [num5, 0]})
                            self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot6"].update(
                                {self.matches[match]["player"+str(i)]["Item_Purch_6"]: [num6, 0]})
                            rankTrack1[rank] += 1



    def calc_wr_items_by_rank(self):
        rankTrack = {}
        for rank in self.ranks:
            if rank not in rankTrack.keys():
                rankTrack[rank] = 0
            for match in self.matches:
                if rankTrack[rank] != self.rankCounter[rank]:
                    for i in range(10):
                        if self.matches[match]["player"+str(i)]["godName"] == self.name and normalize_rank(self.matches[match]["player"+str(i)]["Conquest_Tier"]) == rank:
                            if self.matches[match]["player"+str(i)]["Win_Status"] == "Winner":
                                wins1 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                    i)]["Role"]]["slot1"][self.matches[match]["player"+str(i)]["Item_Purch_1"]][1] + 1
                                wins2 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                    i)]["Role"]]["slot2"][self.matches[match]["player"+str(i)]["Item_Purch_2"]][1] + 1
                                wins3 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                    i)]["Role"]]["slot3"][self.matches[match]["player"+str(i)]["Item_Purch_3"]][1] + 1
                                wins4 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                    i)]["Role"]]["slot4"][self.matches[match]["player"+str(i)]["Item_Purch_4"]][1] + 1
                                wins5 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                    i)]["Role"]]["slot5"][self.matches[match]["player"+str(i)]["Item_Purch_5"]][1] + 1
                                wins6 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                    i)]["Role"]]["slot6"][self.matches[match]["player"+str(i)]["Item_Purch_6"]][1] + 1

                                total1 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                    i)]["Role"]]["slot1"][self.matches[match]["player"+str(i)]["Item_Purch_1"]][0]
                                total2 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                    i)]["Role"]]["slot2"][self.matches[match]["player"+str(i)]["Item_Purch_2"]][0]
                                total3 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                    i)]["Role"]]["slot3"][self.matches[match]["player"+str(i)]["Item_Purch_3"]][0]
                                total4 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                    i)]["Role"]]["slot4"][self.matches[match]["player"+str(i)]["Item_Purch_4"]][0]
                                total5 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                    i)]["Role"]]["slot5"][self.matches[match]["player"+str(i)]["Item_Purch_5"]][0]
                                total6 = self.items_by_rank[rank][self.matches[match]["player"+str(
                                    i)]["Role"]]["slot6"][self.matches[match]["player"+str(i)]["Item_Purch_6"]][0]

                                self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot1"].update(
                                    {self.matches[match]["player"+str(i)]["Item_Purch_1"]: [total1, wins1]})
                                self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot2"].update(
                                    {self.matches[match]["player"+str(i)]["Item_Purch_2"]: [total2, wins2]})
                                self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot3"].update(
                                    {self.matches[match]["player"+str(i)]["Item_Purch_3"]: [total3, wins3]})
                                self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot4"].update(
                                    {self.matches[match]["player"+str(i)]["Item_Purch_4"]: [total4, wins4]})
                                self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot5"].update(
                                    {self.matches[match]["player"+str(i)]["Item_Purch_5"]: [total5, wins5]})
                                self.items_by_rank[rank][self.matches[match]["player"+str(i)]["Role"]]["slot6"].update(
                                    {self.matches[match]["player"+str(i)]["Item_Purch_6"]: [total6, wins6]})
                            rankTrack[rank] += 1



    def get_wr_items_by_rank(self):
        """getter method for gods best item wr
        Returns:
            dict: a dict of each item slots best wr for god
        """
        for rank in self.items_by_rank.keys():
            for role in self.items_by_rank[rank].keys():
                for slot in self.items_by_rank[rank][role].keys():
                    for items in self.items_by_rank[rank][role][slot].keys():

                        total = self.items_by_rank[rank][role][slot][items][0]
                        wins = self.items_by_rank[rank][role][slot][items][1]
                        self.items_by_rank[rank][role][slot].update(
                            {items: [total, wins, round((wins/total)*100, 2)]})

        return self.items_by_rank
    
    def calc_wr_matches_by_rank(self):
        """[summary]
        Args:
            enemies (list): list of gods to calc wr for god
        """
        rankTrack = {}
        for rank in self.ranks:
            if rank not in rankTrack.keys():
                rankTrack[rank] = 0
            for matchup in self.matches:
                if rankTrack[rank] != self.rankCounter[rank]:
                    for i in range(10):
                        if self.matches[matchup]["player"+str(i)]["godName"] == self.name:
                            player = i
                    for i in range(10):
                        if self.matches[matchup]["player"+str(i)]["Role"] == self.matches[matchup]["player"+str(player)]["Role"]:
                            testingKey = self.matches[matchup]["player"+str(i)]["godName"] + " " + self.matches[matchup]["player"+str(i)]["Role"] + " " + normalize_rank(self.matches[matchup]["player"+str(i)]["Conquest_Tier"])
                            if testingKey not in self.matchups_by_rank.keys():
                                self.matchups_by_rank[testingKey] = [1, 0]
                            else:
                                self.matchups_by_rank[testingKey][0] += 1
                            
                            if self.matches[matchup]["player"+str(i)]["Win_Status"] == "Winner":
                                self.matchups_by_rank[testingKey][1] += 1

                    rankTrack[rank] += 1
                        #self.name, self.matches[matchup]["player"+str(i)]["Role"], normalize_rank(self.matches[matchup]["player"+str(i)]["Conquest_Tier"])

    def get_wr_matches_by_rank(self):
        """getter method for gods matchup wr

        Returns:
            dict: a dict of each matchup and its respective wr
        """
        return self.matchups_by_rank

def create_matches_list(keys):
    matches = []
    for key in keys:
        matches.append(key)
    matches.pop(0)
    return matches


def merge(d1, d2):
    return {**d1, **d2}


def normalize_rank(tier):
    rank = "Error"
    if tier <= 5:
        rank = "Bronze"
    elif tier <= 10:
        rank = "Silver"
    elif tier <= 15:
        rank = "Gold"
    elif tier <= 20:
        rank = "Platinum"
    elif tier <= 25:
        rank = "Diamond"
    elif tier == 26:
        rank = "Masters"
    elif tier == 27:
        rank = "Grandmaster"
    return rank

mydb = client["Matches"]
mycol = mydb["matches"]


starttime = datetime.now()
godsStatDict = {}
data = mycol.find()
index = 0 # 221
matchupsdb = client["Matchups"]
itemsdb = client["Items"]
godmatchesdb = client["godMatches"]
bansdb = client["godBans"]

ranksdb = client["Items_by_Rank"]
rankmatchupsdb = client["Matchups_by_Rank"]
sets = []
x = 0
matches = 0
setsFinished = 0
for set in data:
    if x >= index:
        sets.append(set)
    x += 1
    print(x)
    # if x >= 5:
    #     break

while setsFinished < len(sets):
    dataDict = sets[setsFinished]
    keys = dataDict.keys()
    matchKeys = create_matches_list(keys)

    for key in godsDict.keys():
        newEntry = GodData(key, slots, ranks, roles)
        godsStatDict[key] = newEntry
        godsStatDict[key].set_matches(dataDict)
        matchupsdbCol = matchupsdb[key]
        itemsdbCol = itemsdb[key]

        itemsRankCol = ranksdb[key]
        matchupsRankCol = rankmatchupsdb[key]

        godmatchesCol = godmatchesdb[key]
        bansCol = bansdb[key]

        godsStatDict[key].calc_wr_matches()
        godsStatDict[key].set_item_slots()
        godsStatDict[key].calc_wr_items()

        godsStatDict[key].calc_wr_matches_by_rank()
        godsStatDict[key].set_item_slots_by_rank()
        godsStatDict[key].calc_wr_items_by_rank()

        itemsRankCol.insert_one(godsStatDict[key].get_wr_items_by_rank())
        matchupsRankCol.insert_one(godsStatDict[key].get_wr_matches_by_rank())
        matchupsdbCol.insert_one(godsStatDict[key].get_wr_matches())
        itemsdbCol.insert_one(godsStatDict[key].get_wr_items())
        bansCol.insert_one({"bans": godsStatDict[key].bans})

        print("God done: "+key)
    setsFinished += 1
    print(datetime.now() - starttime)

print(datetime.now() - starttime)
print("Formatting Complete!")
