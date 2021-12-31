from data_pull_formatting_rewrite import normalize_rank
from constants import godsDict, roles
import analyze as anlz
import pymongo
from datetime import datetime

def find_match_history(client, playername, mode):
    """returns a dict of the match history for a given playername in a give mode 

    Args:
        client ([MongoClient]): [database connection]
        playername ([String]): [username of player]
        mode ([String]): [gamemode to get history for]

    Returns:
        [Dict]: [a dict of match data (see sample match for more information)]
    """
    myquery = {}
    if mode == "Ranked":
        database = "Matches"
    elif mode == "Casual":
        database = "thread_test"
    mydb = client[database]
    mycol = mydb["8.12 Matches"]
    myquery = { "$or": [ {f"player{i}.Player_Name": { "$regex" : f"{playername}", "$options": "i" }} for i in range(10) ] }
    filter = {
        **{"_id": 0}, 
        **{f"player{i}.godBuild": 0 for i in range(10)}, 
        **{f"Ban{i}": 0 for i in range(10)},
        # **{f"player{i}": 0 for i in range(10)}
    }
    if mycol.count_documents(myquery) == 0 and mode == "Casual": # casual match data is stored in 2 different database
        mydb = client["CasualMatches"]
        mycol = mydb["8.12 Matches"]
    # print(mycol.count_documents(myquery))
    ret_data = {}
    for x in mycol.find(myquery, filter).limit(5):
        ret_data[x["MatchId"]] = x
    return ret_data

def create_player_return_dict(player):
    """[summary]

    Args:
        player ([type]): [description]

    Returns:
        [type]: [description]
    """
    # print(player)
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

# def get_player_god_stats(player):
#     ret_data = {}
#     for god in player:

def get_player_basic(player):
    print(player["Avatar_URL"])
    return {
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
        "Tier_Conquest": player["Tier_Conquest"],
        "Total_Achievements": player["Total_Achievements"],
        "Total_Worshippers": player["Total_Worshippers"],
        "Wins": player["Wins"],
    }

def create_player_god_dict(data, playername, mode):
    ret_data = {"NameTag": playername, "mode": f"{mode}Conq"}
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


def get_player_god_stats(client, playername, god, role, mode):
    mydb = client["Matches"]
    mycol = mydb["8.12 Matches"]
    myquery = { 
        **{"$or": [ {f"player{i}.Player_Name": { "$regex" : f"{playername}", "$options": "i" }} for i in range(10) ] },
        **{"mode": f"{mode}Conq"}
        }
    filter = {
        **{"_id": 0}, 
        **{f"player{i}.godBuild": 0 for i in range(10)}, 
        **{f"Ban{i}": 0 for i in range(10)},
        # **{f"player{i}": 0 for i in range(10)}
    }
    updatedb = client["Players"]
    updatecol = updatedb["Player Gods"]
    updatedict = { role: {
        "maxKills": 0,
        "maxDeaths": 0,
        "avgDamage": 0,
        "avgGold": 0,
        "avgGoldShare": 0,
        "avgDamageShare": 0,
        "avgKillPart": 0,
        "killsDouble": 0,
        "killsTriple": 0,
        "killsQuadra": 0,
        "killsPenta": 0,
        "games": 0
    } for role in roles
    }

    updatedict = {**updatedict, 
    **{"maxKills": 0,
        "maxDeaths": 0,
        "avgDamage": 0,
        "avgGold": 0,
        "avgGoldShare": 0,
        "avgDamageShare": 0,
        "avgKillPart": 0,
        "killsDouble": 0,
        "killsTriple": 0,
        "killsQuadra": 0,
        "killsPenta": 0,
        "games": 0
        }}
    counter = 0
    for x in mycol.find(myquery, filter):
        # temp_data = anlz.get_carry_score(x)
        for key in x:
            if "player" in key:
                if playername in x[key]["Player_Name"]:
                    role = x[key]["Role"]
                    match_data = grab_stats(x[key])
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
                    updatedict[role]["avgDamage"] += match_data["Damage_Player"]
                    updatedict[role]["avgGold"] += match_data["Gold"]

                    if match_data["Kills"] > updatedict["maxKills"]:
                        updatedict["maxKills"] = match_data["Kills"]
                    if match_data["Kills"] > updatedict[role]["maxKills"]:
                        updatedict[role]["maxKills"] = match_data["Kills"]
                    
                    if match_data["Deaths"] > updatedict["maxDeaths"]:
                        updatedict["maxDeaths"] = match_data["Deaths"]
                    if match_data["Deaths"] > updatedict[role]["maxDeaths"]:
                        updatedict[role]["maxDeaths"] = match_data["Deaths"]
                    
                    updatedict[role]["games"] += 1
                    updatedict["games"] += 1

        counter += 1
    for role in roles:
        if updatedict[role]["games"] > 0:
            updatedict[role]["avgDamage"] = updatedict[role]["avgDamage"] / updatedict[role]["games"]
            updatedict[role]["avgGold"] = updatedict[role]["avgGold"] / updatedict[role]["games"]

    updatedict["avgDamage"] = updatedict["avgDamage"] / updatedict[role]["games"]
    updatedict["avgGold"] = updatedict["avgGold"] / updatedict[role]["games"]

    return updatedict


def grab_stats(player_data):
    # print(player_data)
    ret_data = {}
    ret_data["Kills_Double"] = player_data["Kills_Double"]
    ret_data["Kills_Triple"] = player_data["Kills_Triple"]
    ret_data["Kills_Quadra"] = player_data["Kills_Quadra"]
    ret_data["Kills_Penta"] = player_data["Kills_Penta"]
    ret_data["Deaths"] = player_data["Deaths"]
    ret_data["Kills"] = player_data["Kills_Player"]
    ret_data["Damage_Player"] = player_data["Damage_Player"]
    ret_data["Gold"] = player_data["Gold_Earned"]
    return ret_data

# if __name__ == "__main__":
#     client = pymongo.MongoClient(
#     "mongodb+srv://sysAdmin:9gR7C1aDKclng4jA@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

#     starttime = datetime.now()
#     print(get_player_god_stats(client, "Nika", "Achilles", "Solo", "Ranked"))
#     print(datetime.now() - starttime)