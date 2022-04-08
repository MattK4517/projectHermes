import pymongo
import analyze as anlz


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


def convert_mode(mode, queue_type):
    if queue_type == "Ranked" and mode == "Conquest":
        return 451
    elif queue_type == "Casual" and mode == "Conquest":
        return 426
    elif queue_type == "Ranked" and mode == "Joust":
        return 450
    elif queue_type == "Casual" and mode == "Joust":
        return 448


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


if __name__ == "__main__":
    client = pymongo.MongoClient(
        "mongodb+srv://sysAdmin:SFpmxJRX522fZ5fK@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

    print(validate_gods(client, "Nika", "Casual"))
