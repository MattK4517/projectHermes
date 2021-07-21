import analyze as anlz
import pymongo
from datetime import datetime
client = pymongo.MongoClient(
    "mongodb+srv://projectHermes:4zXCvGFmfh8YU6q2@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

if __name__ == "__main__":
    # starttime = datetime.now()
    # frontEndDict = anlz.get_top_builds_discord(client, "Geb", "Mid", req="discord")
    # matchupDict = anlz.get_worst_matchups(client, "Achilles", "Solo", req="discord")
    pbDict = anlz.get_pb_rate(client, "Gilgamesh", req="discord")
    # print("\n")
    # print(frontEndDict)
    # # print("\n")