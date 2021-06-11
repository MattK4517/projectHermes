import analyze as anlz
import pymongo
from datetime import datetime
client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority")

if __name__ == "__main__":
    starttime = datetime.now()
    frontEndDict = anlz.get_top_builds(client, "Achilles")
    # matchupDict = anlz.get_worst_matchups(client, "Ah Puch", "Carry")
    # pbDict = anlz.get_pb_rate(client, "Achilles", "Solo")

    print(datetime.now() - starttime)
    print(frontEndDict) 
    # print("\n")
    # print(matchupDict)
    # # print("\n")