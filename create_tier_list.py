import pymongo
import analyze as anlz
from constants import godsDict, roles, ranks, patch
from __init__ import client
import datetime


def gen_tier_list(client, roles, patch, types, ranks):
    for role in roles:
        for tier_type in types:
            for rank in ranks:
                for god in godsDict:
                    if tier_type == "Regular":
                        gen_regular_tier_entry(client, god, role, rank, patch)
                    elif tier_type == "Combat":
                        gen_combat_tier_entry(client, god, role, rank, patch)
                    elif tier_type == "Objective":
                        gen_objective_tier_entry(client, god, role, rank, patch)
                    print(f"god done {god} - {rank} - {role} - {tier_type}")


def gen_regular_tier_entry(client, god, role, rank, patch):
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
    wr_data = calc_win_rate(client, god, role, patch, rank)
    winRate = wr_data["win_rate"]
    games = wr_data["games"]
    pb_data =  calc_pick_ban_rate(client, god, rank, role, patch)
    ban_rate = pb_data["banRate"]
    pick_rate = pb_data["pickRate"]
    matchups = anlz.get_worst_matchups(client, god, role, patch, rank)
    del matchups["games"], matchups["wins"], matchups["winRate"]
    tier_entry = {
        "patch": patch,
        "Entry_Datetime": get_date(),
        "role": role,
        "rank": rank,
        "god": god,
        "tier": get_tier(),
        "winRate": winRate,
        "pickRate": pick_rate,
        "banRate": ban_rate,
        "counterMatchups": matchups,
        "games": games
    }

    insert_data(client, "Tier_list", "Regular List", tier_entry)

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
        
        tier = (1.75*win_rate_score) + ( (pick_rate_score + (.7*ban_rate_score)) / 2 )
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

def calc_win_rate(client, god, role, patch, rank, mode="Ranked"):
    return anlz.get_winrate(client, god, role, patch, mode, rank)

def calc_pick_ban_rate(client, god, rank, role, patch, mode="Ranked"):
    return anlz.get_pb_rate(client, god, rank, role, patch, mode)

def gen_combat_tier_entry(client, god, role, rank, patch):
    """ gather information to generate combat tier entry
        dict fields shown below
    """
    # insert a dict
    # { 
    #     patch, get from args
    #     role, get from args
    #     god, get from args
    #     winRate, get from calc_win_rate
    #     kills, deaths, assists, damage, damage taken, damage mitigated, healing, self healing from anlz.get_combat_stats
    #     games, get from calc_win_rate
    # }
    wr_data = calc_win_rate(client, god, role, patch, rank)
    winRate = wr_data["win_rate"]
    games = wr_data["games"]
    pb_data =  calc_pick_ban_rate(client, god, rank, role, patch)
    pick_rate = pb_data["pickRate"]
    tier_entry = {
        "patch": patch,
        "Entry_Datetime": get_date(),
        "god": god,
        "role": role,
        "rank": rank,
        "winRate": winRate,
        "pickRate": pick_rate,
        "games": games,
    }

    tier_entry = {**tier_entry, ** anlz.get_combat_stats(client, god, role, patch, rank)}
    if "_id" in tier_entry:
        del tier_entry["_id"]   
    insert_data(client, "Tier_list", "Combat List", tier_entry)

def gen_objective_tier_entry(client, god, role, rank, patch):
    """ gather information to generate combat tier entry
        dict fields shown below
    """
    # insert a dict
    # { 
    #     patch, get from args
    #     role, get from args
    #     god, get from args
    #     winRate, get from calc_win_rate
    #     kills, deaths, assists, damage, damage taken, damage mitigated, healing, self healing from anlz.get_combat_stats
    #     games, get from calc_win_rate
    # }
    wr_data = calc_win_rate(client, god, role, patch, rank)
    winRate = wr_data["win_rate"]
    games = wr_data["games"]
    pb_data =  calc_pick_ban_rate(client, god, rank, role, patch)
    pick_rate = pb_data["pickRate"]
    tier_entry = {
        "patch": patch,
        "Entry_Datetime": get_date(),
        "god": god,
        "role": role,
        "rank": rank,
        "winRate": winRate,
        "pickRate": pick_rate,
    }

    tier_entry = {**tier_entry, ** anlz.get_objective_stats(client, god, role, patch, rank)}
    if "_id" in tier_entry:
        del tier_entry["_id"]   
    insert_data(client, "Tier_list", "Objective List", tier_entry)

def insert_data(client, db, col, data):
    mydb = client[db]
    mycol = mydb[col]
    mycol.insert_one(data)

def get_date():
    time = datetime.datetime.now()
    return f"{time.month}/{time.day}/{time.year}"

def update_pick_rates(client: pymongo.MongoClient) -> None:
    mydb = client["Tier_list"]
    mycol = mydb["Pick Rates"]
    data = []
    for god in godsDict:
        for role in roles:
            for rank in ranks: 
                for patch in ["9.1"]:
                        data.append(
                            {
                                **{
                                    "rank": rank,
                                    "role": role,
                                    "patch": patch
                                },
                                **calc_win_rate(client, god, role, patch, rank),
                                **calc_pick_ban_rate(client, god, rank, role, patch)
                            })
                        if len(data) >= 1000:
                            mycol.insert_many(data)
                            data = []
        print(f"{god} Done")
    mycol.insert_many(data)

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
if __name__ == '__main__':
    pass
    # print(get_tier_stats(client, "All Ranks", "All Roles"))
    # update_pick_rates(client)
                    


