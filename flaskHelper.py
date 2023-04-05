from tokenize import String

import pymongo
from pyrez.api import SmiteAPI

import analyze as anlz
from constants import Assassins, Guardians, Hunters, Mages, Warriors


def validate_player(client, playername):
    mydb = client["Players"]
    mycol = mydb["Player Basic"]
    print(
        mycol.count_documents({"NameTag": {"$regex": f"{playername}", "$options": "i"}})
    )
    if (
        mycol.count_documents({"NameTag": {"$regex": f"{playername}", "$options": "i"}})
        > 0
    ):
        return True
    return False


def validate_gods(client, playername, queue_type, mode, input_type):
    mydb = client["Players"]
    mycol = mydb["Player Gods"]
    print(
        mycol.count_documents(
            {
                "queue_type": queue_type,
                "mode": mode,
                "NameTag": {"$regex": f"{playername}", "$options": "i"},
            }
        )
    )
    if (
        mycol.count_documents(
            {
                "queue_type": queue_type,
                "mode": mode,
                "input_type": input_type,
                "NameTag": {"$regex": f"{playername}", "$options": "i"},
            }
        )
        > 0
    ):
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

        elif mode == "Arena":
            queue_id = 435

        elif mode == "Assault":
            queue_id = 445

        elif mode == "Slash":
            queue_id = 10189

    return queue_id


def get_filter(table_type):
    my_filter = {
        "patch": 1,
        "role": 1,
        "winRate": 1,
        "games": 1,
        "rank": 1,
        "god": 1,
        "_id": 0,
    }
    if table_type == "Regular":
        my_filter = {
            **my_filter,
            **{"pickRate": 1, "banRate": 1, "counterMatchups": 1, "tier": 1},
        }
    elif table_type == "Combat":
        my_filter = {
            **my_filter,
            **{
                "kills": 1,
                "deaths": 1,
                "assists": 1,
                "damage_": 1,
                "damageTaken": 1,
                "damageMitigated": 1,
                "healing": 1,
                "selfHealing": 1,
            },
        }
    elif table_type == "Objective":
        my_filter = {
            **my_filter,
            **{
                "gold": 1,
                "damageBot": 1,
                "killsBot": 1,
                "towerKills": 1,
                "phoenixKills": 1,
                "towerDamage": 1,
                "wardsPlaced": 1,
            },
        }

    return my_filter


def get_player_id(smite_api: SmiteAPI, playername):
    data = smite_api.getPlayerId(playername)
    if data:
        return data[0]["player_id"]

    data = []
    portals = [1, 5, 9, 10, 22, 25, 28]
    for portal in portals:
        data = smite_api.getPlayerId(playername, portal)
        if data:
            return data[0]["player_id"]


def get_class(god):
    god_class = ""
    if god in Assassins:
        god_class = "assassin"
    elif god in Guardians:
        god_class = "guardian"
    elif god in Hunters:
        god_class = "hunter"
    elif god in Mages:
        god_class = "mage"
    elif god in Warriors:
        god_class = "warrior"
    return god_class


if __name__ == "__main__":
    from main import client

    # print(validate_gods(client, "Mayhem4517", "Ranked", "Conquest"))
    print(get_class("Ah Muzen Cab"))
