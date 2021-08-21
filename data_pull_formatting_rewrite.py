# import pymongo

# client = pymongo.MongoClient(
#     "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")


# class godData

roles = ["Carry", "Support", "Mid", "Jungle", "Solo"]
ranks = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Masters", "Grandmaster"]
slots = ["slot1", "slot2", "slot3", "slot4", "slot5", "slot6"]
items = ["item1", "item2"]
testDict = {slot: {item: {"items": "", "games":0} for item in items} for slot in slots}
print(testDict)