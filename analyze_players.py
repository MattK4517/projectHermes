def find_match_history(client, playername):
    myquery = {}
    mydb = client["Matches"]
    mycol = mydb["8.11 Matches"]
    myquery = { "$or": [ {f"player{i}.Player_Name": playername} for i in range(10) ] }
    filter = {
        **{"_id": 0}, 
        **{f"player{i}.godBuild": 0 for i in range(10)}, 
        **{f"Ban{i}": 0 for i in range(10)},
        # **{f"player{i}": 0 for i in range(10)}
    }
    ret_data = {}
    for x in mycol.find(myquery, filter):
        ret_data[x["MatchId"]] = x
    print(ret_data.keys())
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
        "winRate": round(player["RankedConquest"]["Wins"]/losses*100, 2),
        "rank": normalize_rank(player["RankedConquest"]["Rank"]),
        "tier": normalize_tier(player["RankedConquest"]["Tier"]),
        "games": player["RankedConquest"]["Wins"]+losses

    }
    return ret_data

# def get_player_god_stats(player):
#     ret_data = {}
#     for god in player:
# 
def normalize_rank(tier):
    rank = "Error"
    if tier <= 5:
        rank = "Bronze"
    elif tier <= 10:
        rank = "Silver"
    elif tier <= 15:
        rank = "Gold"
    elif tier <= 20:
        rank = "Platinum"
    elif tier <= 25:
        rank = "Diamond"
    elif tier == 26:
        rank = "Masters"
    elif tier == 27:
        rank = "Grandmaster"
    return rank
      

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