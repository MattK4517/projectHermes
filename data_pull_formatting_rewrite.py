import pymongo
from datetime import datetime
from constants import godsDict, roles, ranks, slots

client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

# roles = ["Carry", "Support", "Mid", "Jungle", "Solo"]
# ranks = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Masters", "Grandmaster"]
# slots = ["slot1", "slot2", "slot3", "slot4", "slot5", "slot6"]
# items = ["item1", "item2"]
# testDict = {slot: {item: {"items": "", "games":0} for item in items} for slot in slots}
# print(testDict)

class GodData:
    def __init__(self, god):
        self.name = god
        self.matches = [] 
    

    def set_matches(self, data):
        """append match Ids to self.matches when gods in data"""
        for match in data:
            for key in match:
                if "player" in key and match[key]["godName"] == self.name:
                    self.matches.append(match)

    def get_matches(self):
        return len(self.matches)

    def calc_matchups(self):
        mydb = client["single_matchups"]
        mycol = mydb[self.name]
        for match in self.matches:
            for key in match:
                if "player" in key and match[key]["godName"] == self.name:
                    flag_player = key
            for key in match:
                if "player" in key and match[key]["Role"] == match[flag_player]["Role"] and match[key]["godName"] != match[flag_player]["godName"]:
                    role_played = match[key]["Role"]
                    enemy = match[key]["godName"]
                    rank = normalize_rank(match[key]["Conquest_Tier"])
                    mycol.insert_one(
                        {   self.name : match[flag_player]["Win_Status"],
                            "rank": rank,
                            "role_played": role_played,
                            "enemy": enemy,
                        }
                    )

    def calc_items(self):
        mydb = client["single_items"]
        mycol =  mydb[self.name]
        for match in self.matches:
            build = {}
            for key in match:
                if "player" in key and match[key]["godName"] == self.name:
                    role_played = match[key]["Role"]
                    rank = normalize_rank(match[key]["Conquest_Tier"])
                    win_status = match[key]["Win_Status"]
                    for player_key in match[key]:
                        if "Item_Purch" in player_key:
                            item, purch, number = player_key.split("_")
                            build[f"slot{number}"] = match[key][player_key]

                    mycol.insert_one(
                        {self.name: build,
                        "role_played": role_played,
                        "rank": rank,
                        "win_status": win_status,
                        }
                    )

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


start_time = datetime.now()
sum_gods = 0
mydb = client["Matches"]
mycol = mydb["8.8 Matches"]
set_matches = []
for match in mycol.find({"Entry_Datetime": {"$gte": "8/29/2021" }}):
    set_matches.append(match)

print(len(set_matches))

# for god in godsDict:
#     godsDict[god] = GodData(god)
#     godsDict[god].set_matches(set_matches)
#     sum_gods += godsDict[god].get_matches()
#     godsDict[god].calc_matchups()
#     godsDict[god].calc_items()


#     print(f"{god}: {godsDict[god].get_matches()}")
# print(f"time to complete {datetime.now() - start_time}")