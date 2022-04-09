import pymongo
import analyze as anlz
from pyrez.api import SmiteAPI


def validate_player(client, playername):
    mydb = client["Players"]
    mycol = mydb["Player Basic"]
    print(mycol.count_documents(
        {"NameTag": {"$regex": f"{playername}", "$options": "i"}}))
    if mycol.count_documents({"NameTag": {"$regex": f"{playername}", "$options": "i"}}) > 0:
        return True
    return False


def validate_gods(client, playername, queue_type):
    mydb = client["Players"]
    mycol = mydb["Player Gods"]
    print(mycol.count_documents({"queue_type": f"{queue_type}Conq", "NameTag": {
          "$regex": f"{playername}", "$options": "i"}}))
    if mycol.count_documents({"queue_type": f"{queue_type}Conq", "NameTag": {"$regex": f"{playername}", "$options": "i"}}) > 0:
        return True
    return False


def get_queue_id(queue_type, mode, input_type):
    queue_id = 0
    if queue_type == "Ranked":
        if mode == "Conquest":
            if input_type == "KBM":
                queue_id = 451
            elif input_type == "Controller":
                queue_id = 504

        elif mode == "Joust":
            if input_type == "KBM":
                queue_id = 450
            elif input_type == "Controller":
                queue_id = 503

        elif mode == "Duel":
            if input_type == "KBM":
                queue_id = 440
            elif input_type == "Controller":
                queue_id = 502

    elif queue_type == "Casual":
        if mode == "Conquest":
            queue_id = 426

        elif mode == "Joust":
            queue_id = 448

    return queue_id


def get_filter(table_type):
    my_filter = {"patch": 1, "role": 1, "winRate": 1,
                 "games": 1, "rank": 1, "god": 1, "_id": 0}
    if table_type == "Regular":
        my_filter = {**my_filter, **{"pickRate": 1,
                                     "banRate": 1, "counterMatchups": 1}}
    elif table_type == "Combat":
        my_filter = {**my_filter, **{"kills": 1, "deaths": 1, "damage_": 1,
                                     "damageTaken": 1, "damageMitigated": 1, "healing": 1, "selfHealing": 1}}
    elif table_type == "Objective":
        my_filter = {**my_filter, **{"gold": 1, "damageBot": 1, "killsBot": 1,
                                     "towerKills": 1, "phoenixKills": 1, "towerDamage": 1, "wardsPlaced": 1}}

    return my_filter


def get_player_id(smite_api: SmiteAPI, playername):
    portals = [1, 5, 9, 10, 22, 25, 28]
    for portal in portals:
        print(playername, portal)
        data = smite_api.getPlayerId(playername, portal)
        print(data)
        if data:
            return data[0]["player_id"]


if __name__ == "__main__":
    client = pymongo.MongoClient(
        "mongodb+srv://sysAdmin:SFpmxJRX522fZ5fK@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")
