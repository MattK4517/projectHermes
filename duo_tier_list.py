### get winrates of adc and support
### all we need from matches 

### players.role and players.win_status

### create duo lane data base
    # {
    #     winningCarry:
    #     winningSupport:
    #     losingCarry:
    #     losingSupport:
    #     MatchId:
    #     patch:
    # }


from main import client
import analyze as anlz
from math import sqrt
if __name__ == "__main__":
    mydb = client["Matches"]
    mycol = mydb["8.11 Matches"]


    duodb = client["Duo_Tierlist"]
    duocol = duodb["8.11 Matches"]
    myquery = {f"player{i}.Role": 1 for i in range(10)}
    myquery = {**myquery, **{f"player{i}.Win_Status": 1 for i in range(10)}, **{"_id": 0, "MatchId": 1, "Patch": 1}, **{f"player{i}.godName": 1 for i in range(10)}}
    set = []
    wrs = {}
    for x in mycol.find({} ,myquery):
        insert_data = {
            "winningCarry": "",
            "winningSupport": "",
            "losingCarry": "",
            "losingSupport": "",
            "MatchId": x["MatchId"],
            "Patch": x["Patch"],
        }
        for player in x.keys():
            if "player" in player:
                if x[player]["Role"] == "Carry" and x[player]["Win_Status"] == "Winner":
                    insert_data["winningCarry"] = x[player]["godName"]
                    if x[player]["godName"] in wrs:
                        insert_data["carryWinRate"] = wrs[x[player]["godName"]]
                    else:
                        insert_data["carryWinRate"] = anlz.get_winrate(client, x[player]["godName"], "Carry", "8.11")["win_rate"]
                        wrs[x[player]["godName"]] = insert_data["carryWinRate"]

                elif x[player]["Role"] == "Support" and x[player]["Win_Status"] == "Winner":
                    insert_data["winningSupport"] = x[player]["godName"]
                    if x[player]["godName"] in wrs:
                        insert_data["supportWinRate"] = wrs[x[player]["godName"]]
                    else:
                        insert_data["supportWinRate"] = anlz.get_winrate(client, x[player]["godName"], "Support", "8.11")["win_rate"]
                        wrs[x[player]["godName"]] = insert_data["supportWinRate"]

                elif x[player]["Role"] == "Carry" and x[player]["Win_Status"] == "Loser":
                    insert_data["losingCarry"] = x[player]["godName"]
                    if x[player]["godName"] in wrs:
                        insert_data["carryWinRateLoser"] = wrs[x[player]["godName"]]
                    else:
                        insert_data["carryWinRateLoser"] = anlz.get_winrate(client, x[player]["godName"], "Carry", "8.11")["win_rate"]
                        wrs[x[player]["godName"]] = insert_data["carryWinRateLoser"]

                elif x[player]["Role"] == "Support" and x[player]["Win_Status"] == "Loser":
                    insert_data["losingSupport"] = x[player]["godName"]
                    if x[player]["godName"] in wrs:
                        insert_data["supportWinRateLoser"] = wrs[x[player]["godName"]]
                    else:
                        insert_data["supportWinRateLoser"] = anlz.get_winrate(client, x[player]["godName"], "Support", "8.11")["win_rate"]
                        wrs[x[player]["godName"]] = insert_data["supportWinRateLoser"]

        

        set.append(insert_data)
        if len(set) > 1000:
            duocol.insert_many(set)
            set = []

def get_lanes():
    duodb = client["Duo_Tierlist"]
    duocol = duodb["8.11 Matches"]
    lanes = {}
    myquery = {"Patch": {"$exists": True}}
    winning_lanes = []
    for x in duocol.aggregate(
            [
                {
                    "$match": myquery,
                },
                {
                    "$group": {
                        "_id": {
                            "carry": "$winningCarry",
                            "support": "$winningSupport",
                        },
                        "winningCarryWR": {"$avg": "$carryWinRate"},
                        "winningSupportWR": {"$avg": "$supportWinRate"},
                        "count": {"$sum": 1},
                    }
                },
                {"$sort": {"count": 1}},
            ]
            ):
                winning_lanes.append(x)

    losing_lanes = []
    for x in duocol.aggregate(
            [
                {
                    "$match": myquery,
                },
                {
                    "$group": {
                        "_id": {
                            "carry": "$losingCarry",
                            "support": "$losingSupport",

                        },
                        "winningCarryWR": {"$avg": "$carryWinRate"},
                        "winningSupportWR": {"$avg": "$supportWinRate"},
                        "count": {"$sum": 1},
                    },
                },
                {"$sort": {"count": 1}},
            ]
            ):
                losing_lanes.append(x)
    god_wrs = {"carry": {}, "support": {}}
    for winning_duo in winning_lanes:
        for losing_duo in losing_lanes:
            if winning_duo["count"] + losing_duo["count"] > 150:
                if winning_duo["_id"] == losing_duo["_id"]:
                    # if winning_duo["winningCarryWR"] > 100 or winning_duo["winningSupportWR"] > 100:
                    #     print(winning_duo)
                    # if winning_duo["_id"]["carry"] not in god_wrs["carry"]:
                    #     carryWinRate = winning_duo["winningCarryWR"]
                    #     god_wrs["carry"][winning_duo["_id"]["carry"]] = winning_duo["winningCarryWR"]
                    # else:
                    #     carryWinRate = god_wrs["carry"][winning_duo["_id"]["carry"]]

                    # if winning_duo["_id"]["support"] not in god_wrs["support"]:
                    #     supportWinRate = winning_duo["winningSupportWR"]
                    #     god_wrs["support"][winning_duo["_id"]["support"]] = winning_duo["winningSupportWR"]
                    # else:
                    #     supportWinRate = god_wrs["support"][winning_duo["_id"]["support"]]

                    syneryFactor = round(winning_duo["count"]/(winning_duo["count"]+losing_duo["count"])*100, 2) - sqrt(winning_duo["winningCarryWR"]* winning_duo["winningSupportWR"])
                    lanes[str(winning_duo["_id"]["carry"]) + str(winning_duo["_id"]["support"])] = {
                        **winning_duo, 
                        **{"losses": losing_duo["count"], "winRate": round(winning_duo["count"]/(winning_duo["count"]+losing_duo["count"])*100, 2) },
                        **{"carryWinRate": winning_duo["winningCarryWR"], "supportWinRate": winning_duo["winningSupportWR"], "syneryFactor": syneryFactor},
                        }
    return lanes