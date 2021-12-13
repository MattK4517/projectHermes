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
    print(duocol.count_documents({"winningSupport": "Nox", "losingCarry": "Hou Yi"}))
    print(duocol.count_documents({"losingSupport": "Nox", "winningCarry": "Hou Yi"}))
    # myquery = {f"player{i}.Role": 1 for i in range(10)}
    # myquery = {**myquery, **{f"player{i}.Win_Status": 1 for i in range(10)}, **{"_id": 0, "MatchId": 1, "Patch": 1}, **{f"player{i}.godName": 1 for i in range(10)}}
    # set = []
    # for x in mycol.find({} ,myquery):
    #     insert_data = {
    #         "winningCarry": "",
    #         "winningSupport": "",
    #         "losingCarry": "",
    #         "losingSupport": "",
    #         "MatchId": x["MatchId"],
    #         "Patch": x["Patch"],
    #     }
    #     for player in x.keys():
    #         if "player" in player:
    #             if x[player]["Role"] == "Carry" and x[player]["Win_Status"] == "Winner":
    #                 insert_data["winningCarry"] = x[player]["godName"]
    #             elif x[player]["Role"] == "Support" and x[player]["Win_Status"] == "Winner":
    #                 insert_data["winningSupport"] = x[player]["godName"]
    #             elif x[player]["Role"] == "Carry" and x[player]["Win_Status"] == "Loser":
    #                 insert_data["losingCarry"] = x[player]["godName"]
    #             elif x[player]["Role"] == "Support" and x[player]["Win_Status"] == "Loser":
    #                 insert_data["losingSupport"] = x[player]["godName"]
        
    #     set.append(insert_data)
    #     if len(set) > 1000:
    #         duocol.insert_many(set)
    #         set = []

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
                        "count": {"$sum": 1},
                    }
                },
                {"$sort": {"count": 1}},
            ]
            ):
                if x["count"] > 75:
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
                        "count": {"$sum": 1},
                    }
                },
                {"$sort": {"count": 1}},
            ]
            ):
                if x["count"] > 75:
                    losing_lanes.append(x)
    god_wrs = {}
    for winning_duo in winning_lanes:
        for losing_duo in losing_lanes:
            if winning_duo["_id"] == losing_duo["_id"]:
                if winning_duo["_id"]["carry"] not in god_wrs:
                    carryWinRate = anlz.get_winrate(client, winning_duo["_id"]["carry"], "Carry", "8.11")["win_rate"]
                    god_wrs[winning_duo["_id"]["carry"]] = carryWinRate
                else:
                    carryWinRate = god_wrs[winning_duo["_id"]["carry"]]
                if winning_duo["_id"]["support"] not in god_wrs:
                    supportWinRate = anlz.get_winrate(client, winning_duo["_id"]["support"], "Support", "8.11")["win_rate"]
                    god_wrs[winning_duo["_id"]["support"]] = supportWinRate
                else:
                    supportWinRate = god_wrs[winning_duo["_id"]["support"]]

                syneryFactor = round(winning_duo["count"]/(winning_duo["count"]+losing_duo["count"])*100, 2) - sqrt(carryWinRate*supportWinRate)
                lanes[str(winning_duo["_id"]["carry"]) + str(winning_duo["_id"]["support"])] = {
                    **winning_duo, 
                    **{"losses": losing_duo["count"], "winRate": round(winning_duo["count"]/(winning_duo["count"]+losing_duo["count"])*100, 2) },
                    **{"carryWinRate": carryWinRate, "supportWinRate": supportWinRate, "syneryFactor": syneryFactor},
                    }
    
    return lanes