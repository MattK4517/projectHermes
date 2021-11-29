import pymongo
import analyze as anlz
from constants import godsDict, roles, ranks, patch
from main import client
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
        "tier": calc_tier(),
        "winRate": winRate,
        "pickRate": pick_rate,
        "banRate": ban_rate,
        "counterMatchups": matchups,
        "games": games
    }

    insert_data(client, "Tier_list", "Regular List", tier_entry)

def calc_tier():
    """
        waiting for squish
    """
    return "A"

def calc_win_rate(client, god, role, patch, rank):
    return anlz.get_winrate(client, god, role, patch, rank)

def calc_pick_ban_rate(client, god, rank, role, patch):
    return anlz.get_pb_rate(client, god, rank, role, patch)

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

if __name__ == '__main__':
    gen_tier_list(client, roles, "8.11", ["Combat", "Regular", "Objective"], ranks)



