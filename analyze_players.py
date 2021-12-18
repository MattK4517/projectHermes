from data_pull_formatting_rewrite import normalize_rank

def find_match_history(client, playername, mode):
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
    if mycol.count_documents(myquery) == 0 and mode == "Casual":
        mydb = client["CasualMatches"]
        mycol = mydb["8.12 Matches"]
    print(mycol.count_documents(myquery))
    ret_data = {}
    for x in mycol.find(myquery, filter).limit(5):
        ret_data[x["MatchId"]] = x
    return ret_data

def create_player_return_dict(player):
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
    del data["NameTag"], data["mode"]
    for god in data:
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