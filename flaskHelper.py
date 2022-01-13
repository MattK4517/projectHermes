import pymongo
import analyze as anlz


def validate_player(client, playername):
    mydb = client["Players"]
    mycol = mydb["Player Basic"]
    print(mycol.count_documents({"NameTag": { "$regex" : f"{playername}", "$options": "i" }}))
    if mycol.count_documents({"NameTag": { "$regex" : f"{playername}", "$options": "i" }}) > 0:
        return True
    return False

def validate_gods(client, playername, mode):
    mydb = client["Players"]
    mycol = mydb["Player Gods"]
    print(mycol.count_documents({"mode": f"{mode}Conq", "NameTag": { "$regex" : f"{playername}", "$options": "i" }}))
    if mycol.count_documents({"mode": f"{mode}Conq", "NameTag": { "$regex" : f"{playername}", "$options": "i" }}) > 0:
        return True
    return False

def convert_mode(mode):
    if mode == "Ranked":
        return 451
    elif mode == "Casual":
        return 426


if __name__ == "__main__":
    client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:SFpmxJRX522fZ5fK@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")


    print(validate_gods(client, "Nika", "Casual"))