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


start_time = datetime.now()
sum_gods = 0
mydb = client["testing"]
mycol = mydb["invdMatch"]
set_matches = []
for match in mycol.find():
    set_matches.append(match)

for god in godsDict:
    godsDict[god] = GodData(god)
    godsDict[god].set_matches(set_matches)
    sum_gods += godsDict[god].get_matches()

    print(f"{god}: {godsDict[god].get_matches()}")

print(f"time to complete {datetime.now() - start_time}")