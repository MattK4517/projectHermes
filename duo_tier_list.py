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
# if __name__ == "__main__":
#     mydb = client["Matches"]
#     mycol = mydb["8.10 Matches"]


#     duodb = client["Duo_Tierlist"]
#     duocol = duodb["8.10 Matches"]
#     myquery = {f"player{i}.Role": 1 for i in range(10)}
#     myquery = {**myquery, **{f"player{i}.Win_Status": 1 for i in range(10)}, **{"_id": 0, "MatchId": 1, "Patch": 1}, **{f"player{i}.godName": 1 for i in range(10)}}
#     # for x in mycol.find({"Entry_Datetime": {"$gt": "10/21/2021"}}, myquery):
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
        
    #     duocol.insert_one(insert_data)
def get_lanes():
    duodb = client["Duo_Tierlist"]
    duocol = duodb["8.10 Matches"]
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
                losing_lanes.append(x)
        
    for winning_duo in winning_lanes:
        for losing_duo in losing_lanes:
            if winning_duo["_id"] == losing_duo["_id"]:
                lanes[str(winning_duo["_id"]["carry"]) + str(winning_duo["_id"]["support"])] = {**winning_duo, **{"losses": losing_duo["count"], "winRate": round(winning_duo["count"]/(winning_duo["count"]+losing_duo["count"])*100, 2) }}
    
    return lanes