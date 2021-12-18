import pymongo
import analyze as anlz


def validate_player(client, playername, mode):
    mydb = client["Players"]
    mycol = mydb["Player Basic"]
    if mycol.count_documents({"mode": mode, "NameTag": { "$regex" : f"{playername}", "$options": "i" }}) > 0:
        return True
    return False

def convert_mode(mode):
    if mode == "Ranked":
        return 451
    elif mode == "Casual":
        return 426