from pandas import test
from data_pull_formatting_rewrite import normalize_rank
from constants import godsDict, roles, patches
import analyze as anlz
import pymongo
from datetime import datetime
from __init__ import client


def find_match_history(client, playername, queue_type, patch, mode):
    """returns a dict of the match history for a given playername in a give queue_type

    Args:
        client ([MongoClient]): [database connection]
        playername ([String]): [username of player]
        queue_type ([String]): [gamemode to get history for]

    Returns:
        [Dict]: [a dict of match data (see sample match for more information)]
    """
    myquery = {}
    if queue_type == "Ranked":
        database = "Matches"
    elif queue_type == "Casual":
        database = "CasualMatches"

    mydb = client[database]
    mycol = mydb[f"{patch} Matches"]
    if mode == "Joust" or mode == "Duel":
        mycol = mydb[f"{patch} {mode} Matches"]

    myquery = {
        '$search': {
            'index': 'default',
            'text': {
                'query': f'{playername}',
                'path': {
                    'wildcard': '*'
                }
            }
        }
    }
    ret_data = {}
    for x in mycol.aggregate([myquery]):
        for key in x:
            if "player" in key:
                if verify_player(x[key]["Player_Name"], playername, "none", "none"):
                    ret_data[x["MatchId"]] = x

    return ret_data


def create_player_return_dict(player):
    """[summary]

    Args:
        player ([type]): [description]

    Returns:
        [type]: [description]
    """
    if player["RankedConquest"]["Losses"] == 0:
        losses = 1
    else:
        losses = player["RankedConquest"]["Losses"]
    ret_data = {
        "level": player["Level"],
        "avatar": player["Avatar_URL"],
        "winRate": round(player["RankedConquest"]["Wins"]/(player["RankedConquest"]["Wins"]+losses)*100, 2),
        "rank": normalize_rank(player["RankedConquest"]["Rank"]),
        "tier": normalize_tier(player["RankedConquest"]["Tier"]),
        "games": player["RankedConquest"]["Wins"]+losses

    }
    return ret_data


def get_player_basic(player):
    # my player id 704292327
    data = {
        "Avatar_URL": player["Avatar_URL"],
        "Created_Datetime": player["Created_Datetime"],
        "HoursPlayed": player["HoursPlayed"],
        "Leaves": player["Leaves"],
        "Level": player["Level"],
        "Losses": player["Losses"],
        "MinutesPlayed": player["MinutesPlayed"],
        "Name": player["Name"],
        "NameTag": player["hz_player_name"],
        "Rank_Stat_Conquest": player["Rank_Stat_Conquest"],
        "Rank_Stat_Conquest_Controller": player["Rank_Stat_Conquest_Controller"],
        "Rank_Stat_Joust": player["Rank_Stat_Joust"],
        "Rank_Stat_Joust_Controller": player["Rank_Stat_Joust_Controller"],
        "Rank_Stat_Duel": player["Rank_Stat_Duel"],
        "Rank_Stat_Duel_Controller": player["Rank_Stat_Duel_Controller"],
        "RankedConquest": {
            "Leaves": player["RankedConquest"]["Leaves"],
            "Losses": player["RankedConquest"]["Losses"],
            "Points": player["RankedConquest"]["Points"],
            "Rank": player["RankedConquest"]["Rank"],
            "Rank_Stat": player["RankedConquest"]["Rank_Stat"],
            "Rank_Stat_Conquest": player["RankedConquest"]["Rank_Stat_Conquest"],
            "Rank_Variance": player["RankedConquest"]["Rank_Variance"],
            "Season": player["RankedConquest"]["Season"],
            "Tier": player["RankedConquest"]["Tier"],
            "Wins": player["RankedConquest"]["Wins"],
        },
        "RankedConquestController": {
            "Leaves": player["RankedConquestController"]["Leaves"],
            "Losses": player["RankedConquestController"]["Losses"],
            "Points": player["RankedConquestController"]["Points"],
            "Rank": player["RankedConquestController"]["Rank"],
            "Rank_Stat": player["RankedConquestController"]["Rank_Stat"],
            "Rank_Stat_Conquest": player["RankedConquestController"]["Rank_Stat_Conquest"],
            "Rank_Variance": player["RankedConquestController"]["Rank_Variance"],
            "Season": player["RankedConquestController"]["Season"],
            "Tier": player["RankedConquestController"]["Tier"],
            "Wins": player["RankedConquestController"]["Wins"],
        },
        "RankedJoust": {
            "Leaves": player["RankedJoust"]["Leaves"],
            "Losses": player["RankedJoust"]["Losses"],
            "Points": player["RankedJoust"]["Points"],
            "Rank": player["RankedJoust"]["Rank"],
            "Rank_Stat": player["RankedJoust"]["Rank_Stat"],
            "Rank_Stat_Joust": player["RankedJoust"]["Rank_Stat_Joust"],
            "Rank_Variance": player["RankedJoust"]["Rank_Variance"],
            "Season": player["RankedJoust"]["Season"],
            "Tier": player["RankedJoust"]["Tier"],
            "Wins": player["RankedJoust"]["Wins"],
        },
        "RankedJoustController": {
            "Leaves": player["RankedJoustController"]["Leaves"],
            "Losses": player["RankedJoustController"]["Losses"],
            "Points": player["RankedJoustController"]["Points"],
            "Rank": player["RankedJoustController"]["Rank"],
            "Rank_Stat": player["RankedJoustController"]["Rank_Stat"],
            "Rank_Stat_Joust": player["RankedJoustController"]["Rank_Stat_Joust"],
            "Rank_Variance": player["RankedJoustController"]["Rank_Variance"],
            "Season": player["RankedJoustController"]["Season"],
            "Tier": player["RankedJoustController"]["Tier"],
            "Wins": player["RankedJoustController"]["Wins"],
        },
        "RankedDuel": {
            "Leaves": player["RankedDuel"]["Leaves"],
            "Losses": player["RankedDuel"]["Losses"],
            "Points": player["RankedDuel"]["Points"],
            "Rank": player["RankedDuel"]["Rank"],
            "Rank_Stat": player["RankedDuel"]["Rank_Stat"],
            "Rank_Variance": player["RankedDuel"]["Rank_Variance"],
            "Season": player["RankedDuel"]["Season"],
            "Tier": player["RankedDuel"]["Tier"],
            "Wins": player["RankedDuel"]["Wins"],
        },
        "RankedDuelController": {
            "Leaves": player["RankedDuelController"]["Leaves"],
            "Losses": player["RankedDuelController"]["Losses"],
            "Points": player["RankedDuelController"]["Points"],
            "Rank": player["RankedDuelController"]["Rank"],
            "Rank_Stat": player["RankedDuelController"]["Rank_Stat"],
            "Rank_Variance": player["RankedDuelController"]["Rank_Variance"],
            "Season": player["RankedDuelController"]["Season"],
            "Tier": player["RankedDuelController"]["Tier"],
            "Wins": player["RankedDuelController"]["Wins"],
        },
        "Tier_Conquest": player["Tier_Conquest"],
        "Tier_Joust": player["Tier_Joust"],
        "Tier_Duel": player["Tier_Duel"],
        "Total_Achievements": player["Total_Achievements"],
        "Total_Worshippers": player["Total_Worshippers"],
        "Wins": player["Wins"],
    }
    return data


def create_player_god_dict(data, playername, queue_type, mode, input_type):
    ret_data = {"NameTag": playername, "queue_type": queue_type,
                "mode": mode, "input_type": input_type}
    for god in data:
        losses = god["Losses"]
        if losses == 0:
            losses = 1
        ret_data[god["God"]] = {
            "assists": god["Assists"],
            "deaths": god["Deaths"],
            "god": god["God"],
            "gold": god["Gold"],
            "kills": god["Kills"],
            "losses": god["Losses"],
            "matches": god["Matches"],
            "minutes": god["Minutes"],
            "queue": god["Queue"],
            "wins": god["Wins"],
            "winRate": round(god["Wins"]/god["Matches"]*100, 2)
        }
    return ret_data


def get_player_winrate(data):
    wins = 0
    games = 0
    for god in data:
        if god in godsDict:
            wins += data[god]["wins"]
            games += data[god]["matches"]

    if games == 0:
        games += 1
    return {"winRate": round(wins/games*100, 2), "games": games}


def normalize_tier(tier):
    rank_text = "None"
    if tier == 1:
        rank_text = "Bronze 5"
    elif tier == 2:
        rank_text = "Bronze 4"
    elif tier == 3:
        rank_text = "Bronze 3"
    elif tier == 4:
        rank_text = "Bronze 2"
    elif tier == 5:
        rank_text = "Bronze 1"
    elif tier == 6:
        rank_text = "Silver 5"
    elif tier == 7:
        rank_text = "Silver 4"
    elif tier == 8:
        rank_text = "Silver 3"
    elif tier == 9:
        rank_text = "Silver 2"
    elif tier == 10:
        rank_text = "Silver 1"
    elif tier == 11:
        rank_text = "Gold 5"
    elif tier == 12:
        rank_text = "Gold 4"
    elif tier == 13:
        rank_text = "Gold 3"
    elif tier == 14:
        rank_text = "Gold 2"
    elif tier == 15:
        rank_text = "Gold 1"
    elif tier == 16:
        rank_text = "Platinum 5"
    elif tier == 17:
        rank_text = "Platinum 4"
    elif tier == 18:
        rank_text = "Platinum 3"
    elif tier == 19:
        rank_text = "Platinum 2"
    elif tier == 20:
        rank_text = "Platinum 1"
    elif tier == 21:
        rank_text = "Diamond 5"
    elif tier == 22:
        rank_text = "Diamond 4"
    elif tier == 23:
        rank_text = "Diamond 3"
    elif tier == 24:
        rank_text = "Diamond 2"
    elif tier == 25:
        rank_text = "Diamond 1"
    elif tier == 26:
        rank_text = "Masters"
    elif tier == 27:
        rank_text = "Grandmaster"
    return rank_text


def verify_player(act_name, playername, act_god, god):
    if act_god.lower() == god.lower():
        name = playername
        if len(act_name.split("]")) > 1:

            name = act_name.split("]")[1]
        if playername.lower() == name.lower():
            return True
    return False


def get_player_god_stats(client, playername, god, role, queue_type, patch):
    updatedict = {role: {
        "maxKills": 0,
        "maxDeaths": 0,
        "avgDamage": 0,
        "avgGold": 0,
        "avgGoldShare": 0,
        "avgDamageShare": 0,
        "avgKillShare": 0,
        "avgWards": 0,
        "maxKillShare": 0,
        "maxGoldShare": 0,
        "maxDamageShare": 0,
        "maxWards": 0,
        "killsDouble": 0,
        "killsTriple": 0,
        "killsQuadra": 0,
        "killsPenta": 0,
        "kills": 0,
        "deaths": 0,
        "assists": 0,
        "games": 0,
        "wins": 0,
        "losses": 0,
    }
    }

    updatedict = {**updatedict,
                  **{"maxKills": 0,
                     "maxDeaths": 0,
                     "avgDamage": 0,
                     "avgGold": 0,
                     "avgGoldShare": 0,
                     "avgDamageShare": 0,
                     "avgKillShare": 0,
                     "avgWards": 0,
                     "maxKillShare": 0,
                     "maxGoldShare": 0,
                     "maxDamageShare": 0,
                     "maxWards": 0,
                     "killsDouble": 0,
                     "killsTriple": 0,
                     "killsQuadra": 0,
                     "killsPenta": 0,
                     "kills": 0,
                     "deaths": 0,
                     "assists": 0,
                     "games": 0,
                     "wins": 0,
                     "losses": 0,
                     "nameTag": playername,
                     "god": god,
                     "queue_type": f"{queue_type}Conq"
                     }}

    if queue_type == "Ranked":
        mydb = client["Matches"]
    elif queue_type == "Casual":
        mydb = client["CasualMatches"]
    mycol = mydb[f"{patch} Matches"]
    if "All" in patch:
        for patch in patches:
            mycol = mydb[f"{patch} Matches"]
            run_loop(playername, god, role, mycol, updatedict)
    else:
        run_loop(playername, god, role, mycol, updatedict)

    if updatedict[role]["games"] > 0:
        updatedict[role]["avgDamage"] = round(
            updatedict[role]["avgDamage"] / updatedict[role]["games"], 2)
        updatedict[role]["avgGold"] = round(
            updatedict[role]["avgGold"] / updatedict[role]["games"], 2)
        updatedict[role]["avgGoldShare"] = round(
            updatedict[role]["avgGoldShare"] / updatedict[role]["games"], 2)
        updatedict[role]["avgDamageShare"] = round(
            updatedict[role]["avgDamageShare"] / updatedict[role]["games"], 2)
        updatedict[role]["avgKillShare"] = round(
            updatedict[role]["avgKillShare"] / updatedict[role]["games"], 2)
        updatedict[role]["avgWards"] = round(
            updatedict[role]["avgWards"] / updatedict[role]["games"], 2)
        if updatedict[role]["deaths"] == 0:
            updatedict[role]["deaths"] = 1
        updatedict[role]["KDA"] = round(
            (updatedict[role]["kills"] + (.5 * updatedict[role]["assists"])) / updatedict[role]["deaths"], 2)

    if updatedict["games"] > 0:
        updatedict["avgDamage"] = round(
            updatedict["avgDamage"] / updatedict["games"], 2)
        updatedict["avgGold"] = round(
            updatedict["avgGold"] / updatedict["games"], 2)
        updatedict["avgGoldShare"] = round(
            updatedict["avgGoldShare"] / updatedict["games"], 2)
        updatedict["avgDamageShare"] = round(
            updatedict["avgDamageShare"] / updatedict["games"], 2)
        updatedict["avgKillShare"] = round(
            updatedict["avgKillShare"] / updatedict["games"], 2)
        updatedict["avgWards"] = round(
            updatedict["avgWards"] / updatedict["games"], 2)
        if updatedict["deaths"] == 0:
            updatedict["deaths"] = 1
        updatedict["KDA"] = round(
            (updatedict["kills"] + (.5 * updatedict["assists"])) / updatedict["deaths"], 2)

    return updatedict


def run_loop(playername, god, role, mycol, updatedict):

    counter = 0
    myquery = {
        '$search': {
            'index': 'default',
            'text': {
                'query': f'{playername}',
                'path': {
                    'wildcard': '*'
                }
            }
        }
    }
    for x in mycol.aggregate([myquery]):
        temp_data = anlz.get_carry_score(x)
        flag = False
        try:
            for key in x:
                if "player" in key:
                    if verify_player(playername, x[key]["Player_Name"], god, x[key]["godName"]):
                        if "All" in role:
                            flag = True
                        else:
                            match_role = x[key]["Role"]
                            if match_role == role:
                                flag = True
                        if flag:
                            match_data = grab_stats(x[key])
                            updatedict["kills"] += match_data["Kills"]
                            updatedict["deaths"] += match_data["Deaths"]
                            updatedict["assists"] += match_data["Assists"]
                            updatedict[role]["kills"] += match_data["Kills"]
                            updatedict[role]["deaths"] += match_data["Deaths"]
                            updatedict[role]["assists"] += match_data["Assists"]

                            updatedict["killsDouble"] += match_data["Kills_Double"]
                            updatedict["killsTriple"] += match_data["Kills_Triple"]
                            updatedict["killsQuadra"] += match_data["Kills_Quadra"]
                            updatedict["killsPenta"] += match_data["Kills_Penta"]
                            updatedict[role]["killsDouble"] += match_data["Kills_Double"]
                            updatedict[role]["killsTriple"] += match_data["Kills_Triple"]
                            updatedict[role]["killsQuadra"] += match_data["Kills_Quadra"]
                            updatedict[role]["killsPenta"] += match_data["Kills_Penta"]

                            updatedict["avgDamage"] += match_data["Damage_Player"]
                            updatedict["avgGold"] += match_data["Gold"]
                            updatedict["avgWards"] += match_data["Wards_Placed"]

                            updatedict[role]["avgDamage"] += match_data["Damage_Player"]
                            updatedict[role]["avgWards"] += match_data["Wards_Placed"]
                            updatedict[role]["avgGold"] += match_data["Gold"]

                            updatedict["avgGoldShare"] += temp_data["goldScore"][x[key]
                                                                                 ["Win_Status"]][x[key]["Role"]]["goldShare"]
                            updatedict["avgDamageShare"] += temp_data["damageScore"][x[key]
                                                                                     ["Win_Status"]][x[key]["Role"]]["damageShare"]
                            updatedict["avgKillShare"] += temp_data["killPart"][x[key]
                                                                                ["Win_Status"]][x[key]["Role"]]["killShare"]
                            updatedict[role]["avgGoldShare"] += temp_data["goldScore"][x[key]
                                                                                       ["Win_Status"]][x[key]["Role"]]["goldShare"]
                            updatedict[role]["avgDamageShare"] += temp_data["damageScore"][x[key]
                                                                                           ["Win_Status"]][x[key]["Role"]]["damageShare"]
                            updatedict[role]["avgKillShare"] += temp_data["killPart"][x[key]
                                                                                      ["Win_Status"]][x[key]["Role"]]["killShare"]

                            if match_data["Kills"] > updatedict["maxKills"]:
                                updatedict["maxKills"] = match_data["Kills"]
                            if match_data["Kills"] > updatedict[role]["maxKills"]:
                                updatedict[role]["maxKills"] = match_data["Kills"]

                            if match_data["Deaths"] > updatedict["maxDeaths"]:
                                updatedict["maxDeaths"] = match_data["Deaths"]
                            if match_data["Deaths"] > updatedict[role]["maxDeaths"]:
                                updatedict[role]["maxDeaths"] = match_data["Deaths"]

                            if temp_data["goldScore"][x[key]["Win_Status"]][x[key]["Role"]]["goldShare"] > updatedict["maxGoldShare"]:
                                updatedict["maxGoldShare"] = temp_data["goldScore"][x[key]
                                                                                    ["Win_Status"]][x[key]["Role"]]["goldShare"]

                            if temp_data["damageScore"][x[key]["Win_Status"]][x[key]["Role"]]["damageShare"] > updatedict["maxDamageShare"]:
                                updatedict["maxDamageShare"] = temp_data["damageScore"][x[key]
                                                                                        ["Win_Status"]][x[key]["Role"]]["damageShare"]

                            if temp_data["killPart"][x[key]["Win_Status"]][x[key]["Role"]]["killShare"] > updatedict["maxKillShare"]:
                                updatedict["maxKillShare"] = temp_data["killPart"][x[key]
                                                                                   ["Win_Status"]][x[key]["Role"]]["killShare"]

                            if match_data["Wards_Placed"] > updatedict["maxWards"]:
                                updatedict["maxWards"] = match_data["Wards_Placed"]

                            updatedict[role]["games"] += 1
                            updatedict["games"] += 1
                            if x[key]["Win_Status"] == "Winner":
                                updatedict[role]["wins"] += 1
                                updatedict["wins"] += 1
                            elif x[key]["Win_Status"] == "Loser":
                                updatedict[role]["losses"] += 1
                                updatedict["losses"] += 1
        except KeyError as e:
            pass

        counter += 1


def grab_stats(player_data):
    ret_data = {}
    ret_data["Kills_Double"] = player_data["Kills_Double"]
    ret_data["Kills_Triple"] = player_data["Kills_Triple"]
    ret_data["Kills_Quadra"] = player_data["Kills_Quadra"]
    ret_data["Kills_Penta"] = player_data["Kills_Penta"]
    ret_data["Deaths"] = player_data["Deaths"]
    ret_data["Kills"] = player_data["Kills_Player"]
    ret_data["Assists"] = player_data["Assists"]
    ret_data["Damage_Player"] = player_data["Damage_Player"]
    ret_data["Gold"] = player_data["Gold_Earned"]
    ret_data["Wards_Placed"] = player_data["Wards_Placed"]
    return ret_data


if __name__ == "__main__":
    import flaskHelper as fh
    from pyrez import SmiteAPI
    import pyrez
    with open("cred.txt", "r") as creds:
        lines = creds.readlines()
        smite_api = SmiteAPI(devId=lines[0].strip(

        ), authKey=lines[1].strip(), responseFormat=pyrez.Format.JSON)
        player_id = fh.get_player_id(smite_api, "samdadude")
        print(player_id)
        test_data = smite_api.getPlayer(player_id)
        print(test_data)
        data = get_player_basic(test_data)
