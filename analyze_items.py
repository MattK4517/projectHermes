from collections import OrderedDict
from operator import getitem
from analyze import get_query, return_pipeline
from main import client


def get_item_winrate_by_god(
    client, item, role, patch, queue_type="Ranked", rank="All Ranks", mode="Conquest"
):
    mydb = client["single_match_stats"]
    mycol = mydb[patch + "-" + mode + "-" + queue_type]
    mypipeline = return_pipeline("Achilles", rank, role, patch, queue_type, mode)
    myquery = get_query(rank, role, patch, queue_type, mode)
    mypipeline["$search"]["compound"]["filter"].pop()
    total_games = mycol.count_documents(myquery)
    mypipeline["$search"]["compound"]["filter"].append(
        {"phrase": {"query": item, "path": [f"build.slot{i+1}" for i in range(6)]}}
    )
    data = {}
    games = 0
    for x in mycol.aggregate(
        [
            mypipeline,
            {
                "$project": {
                    "build": 1,
                    "god": 1,
                    "win_status": 1,
                }
            },
            {
                "$group": {
                    "_id": {"god": "$god", "win_status": "$win_status"},
                    "count": {"$sum": 1},
                }
            },
            {"$sort": {"count": -1}},
        ]
    ):
        if x["_id"]["god"] not in data:
            data[x["_id"]["god"]] = {x["_id"]["win_status"]: x["count"]}
        else:
            data[x["_id"]["god"]][x["_id"]["win_status"]] = x["count"]
    for god in data:
        if "Winner" not in data[god]:
            data[god]["Winner"] = 0
        if "Loser" not in data[god]:
            data[god]["Loser"] = 0
        data[god]["games"] = data[god]["Loser"] + data[god]["Winner"]
        data[god]["winRate"] = round(data[god]["Winner"] / data[god]["games"] * 100, 2)
        games += data[god]["games"]
    print(games, total_games, round(games / total_games * 100, 2))
    return data


def get_item_winrate_by_enemy(
    client, item, role, patch, queue_type="Ranked", rank="All Ranks", mode="Conquest"
):
    mydb = client["single_match_stats"]
    mycol = mydb[patch + "-" + mode + "-" + queue_type]
    mypipeline = return_pipeline("Achilles", rank, role, patch, queue_type, mode)
    myquery = get_query(rank, role, patch, queue_type, mode)
    mypipeline["$search"]["compound"]["filter"].pop()
    mypipeline["$search"]["compound"]["filter"].append(
        {"phrase": {"query": item, "path": [f"build.slot{i+1}" for i in range(6)]}}
    )
    data = {}
    for x in mycol.aggregate(
        [
            mypipeline,
            {
                "$project": {
                    "build": 1,
                    "enemies": 1,
                    "win_status": 1,
                }
            },
            {"$unwind": "$enemies"},
            {
                "$group": {
                    "_id": {"god": "$enemies", "win_status": "$win_status"},
                    "count": {"$sum": 1},
                }
            },
            {"$sort": {"count": -1}},
        ]
    ):
        if x["_id"]["god"] not in data:
            data[x["_id"]["god"]] = {x["_id"]["win_status"]: x["count"]}
        else:
            data[x["_id"]["god"]][x["_id"]["win_status"]] = x["count"]
    for god in data:
        if "Winner" not in data[god]:
            data[god]["Winner"] = 0
        if "Loser" not in data[god]:
            data[god]["Loser"] = 0
        data[god]["games"] = data[god]["Loser"] + data[god]["Winner"]
        data[god]["winRate"] = round(data[god]["Winner"] / data[god]["games"] * 100, 2)
    test_sort = OrderedDict(sorted(data.items(), key=lambda x: getitem(x[1], "games")))
    return dict(test_sort)


if __name__ == "__main__":
    # data = get_item_winrate_by_god(client, "Divine Ruin", "All Roles", "9.8")
    # print(data)
    data = get_item_winrate_by_enemy(client, "Divine Ruin", "Solo", "9.8")
    print(data)
