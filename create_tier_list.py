import pymongo
import analyze as anlz
from constants import godsDict, roles, ranks, patch, all_ranks
from main import client
from datetime import datetime


def gen_tier_list(client, roles, patch, types, ranks, queue_types, modes):
    date = get_date()
    for queue_type in queue_types:
        for mode in modes:
            for tier_type in types:
                if mode == "Conquest":
                    for role in roles:
                        if queue_type == "Ranked":
                            for rank in ["All Ranks"]:
                                for god in godsDict:
                                    if tier_type == "Regular":
                                        gen_regular_tier_entry(
                                            client, god, role, rank, patch, queue_type, mode, date)
                                    print(
                                        f"god done {god} - {rank} - {role} - {tier_type} - {queue_type} - {mode}")
                        elif queue_type == "Casual":
                            for god in godsDict:
                                if tier_type == "Regular":
                                    gen_regular_tier_entry(
                                        client, god, role, "All Ranks", patch, queue_type, mode, date)
                                print(
                                    f"god done {god} - {rank} - {role} - {tier_type} - {queue_type} - {mode}")
                elif mode != "Conquest":
                    if queue_type == "Ranked":
                        for rank in ["All Ranks"]:
                            for god in godsDict:
                                if tier_type == "Regular":
                                    gen_regular_tier_entry(
                                        client, god, role, rank, patch, queue_type, mode, date)
                                print(
                                    f"god done {god} - {rank} - {role} - {tier_type} - {queue_type} - {mode}")
                    elif queue_type == "Casual":
                        for god in godsDict:
                            if tier_type == "Regular":
                                gen_regular_tier_entry(
                                    client, god, role, "All Ranks", patch, queue_type, mode, date)
                            print(
                                f"god done {god} - {rank} - {role} - {tier_type} - {queue_type} - {mode}")


def gen_regular_tier_entry(client, god, role, rank, patch, queue_type, mode, date):
    """ gather information to generate tier entry
        dict fields shown below
    """
    # insert a dict
    # {
    #     patch, get from args
    #     role, get from args
    #     god, get from args
    #     tier, get from calc_tier
    #     winRate, get from calc_win_rate
    #     pickRate, get from calc_pick_ban_rate
    #     banRate, get from calc_pick_ban_rate
    #     counterMatchups, get from anlz.get_worst_matchups
    #     games, get from calc_win_rate
    # }
    wr_data = calc_win_rate(client, god, role, patch, rank, queue_type, mode)
    winRate = wr_data["win_rate"]
    games = wr_data["games"]
    pb_data = calc_pick_ban_rate(
        client, god, rank, role, patch, queue_type, mode)
    ban_rate = pb_data["banRate"]
    pick_rate = pb_data["pickRate"]
    matchups = anlz.get_worst_matchups(
        client, god, role, patch, queue_type, rank, mode)
    del matchups["games"], matchups["wins"], matchups["winRate"]
    tier_entry = {
        "patch": patch,
        "queue_type": queue_type,
        "mode": mode,
        "Entry_Datetime": date,
        "role": role,
        "rank": rank,
        "god": god,
        "tier": "",
        "winRate": winRate,
        "pickRate": pick_rate,
        "banRate": ban_rate,
        "counterMatchups": matchups,
        "games": 0
    }

    tier_entry = {**tier_entry, **
                  anlz.get_combat_stats(client, god, role, patch, rank, queue_type, mode)}

    tier_entry = {**tier_entry, **
                  anlz.get_objective_stats(client, god, role, patch, rank, queue_type, mode)}

    tier_entry["games"] = games
    if "_id" in tier_entry:
        del tier_entry["_id"]

    insert_data(client, "Tier_list", "Combined List", tier_entry)


def get_tier(client, win_rate, pick_rate, ban_rate, role, rank):
    tier_stats = get_tier_stats(client, rank, role)
    if pick_rate + ban_rate > 100:
        print(f"error")
    try:
        win_rate_diff = win_rate - tier_stats["avgWinRate"]
        win_rate_score = win_rate_diff / tier_stats["stdDevWinRate"]

        pick_rate_diff = pick_rate - tier_stats["avgPickRate"]
        pick_rate_score = pick_rate_diff / tier_stats["stdDevPickRate"]

        ban_rate_diff = ban_rate - tier_stats["avgBanRate"]
        ban_rate_score = ban_rate_diff / tier_stats["stdDevBanRate"]

        tier = (1.75*win_rate_score) + \
            ((pick_rate_score + (.7*ban_rate_score)) / 2)
        # print(tier)
        if tier < 0:
            tier_letter = "D"

        elif tier < .5:
            tier_letter = "C"

        elif tier < 1:
            tier_letter = "B"

        elif tier < 2.5:
            tier_letter = "A"

        elif tier < 3.5:
            tier_letter = "S"

        else:
            tier_letter = "S+"

        return tier_letter
    except KeyError:
        print(tier_stats)
        return "INVALID"


def get_tier_stats(client: pymongo.MongoClient, rank: str, role: str) -> dict:
    mydb = client["Tier_list"]
    mycol = mydb["Regular List"]
    retData = {}
    myquery = {"role": role, "rank": rank, "pickRate": {"$gte": 1}}
    if "All" in role:
        del myquery["role"]

    for x in mycol.aggregate(
        [
            {"$match": myquery},
            {
            "$group": {
                "_id": f"tier stats",
                "stdDevWinRate": {"$stdDevPop": f"$winRate"},
                "avgWinRate": {"$avg": f"$winRate"},

                "stdDevPickRate": {"$stdDevPop": f"$pickRate"},
                "avgPickRate": {"$avg": f"$pickRate"},

                "stdDevBanRate": {"$stdDevPop": f"$banRate"},
                "avgBanRate": {"$avg": f"$banRate"},
            }
            }
        ]
    ):
        retData = x

    return retData


def calc_win_rate(client, god, role, patch, rank, queue_type, mode):
    return anlz.get_winrate(client, god, role, patch, queue_type, rank, mode)


def calc_pick_ban_rate(client, god, rank, role, patch, queue_type, mode):
    return anlz.get_pb_rate(client, god, rank, role, patch, queue_type, mode)


def insert_data(client, db, col, data):
    mydb = client[db]
    mycol = mydb[col]
    mycol.insert_one(data)


def get_date():
    time = datetime.now()
    return f"{time.month}/{time.day}/{time.year}"


def update_tier(client, roles, patch, ranks, queue_types):
    mydb = client["Tier_list"]
    mycol = mydb["Regular List"]
    for queue_type in queue_types:
        for role in roles:
            for rank in ranks:
                for god in godsDict:
                    for x in mycol.find({"queue_type": f"{queue_type}Conq", "role": role, "god": god, "rank": rank}):
                        tier = get_tier(
                            client, x["winRate"], x["pickRate"], x["banRate"], role, rank)
                    mycol.update_one({"queue_type": f"{queue_type}Conq", "role": role, "god": god,
                                     "rank": rank, "patch": "9.2"}, {"$set": {"tier": tier}})


if __name__ == '__main__':
    starttime = datetime.now()
    gen_tier_list(client, roles, "9.3", [
                  "Regular"], all_ranks, ["Ranked"], ["Conquest", "Duel", "Joust"])
    print(f"done in {datetime.now() - starttime}")



