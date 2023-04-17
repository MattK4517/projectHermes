# get winrates of adc and support
# all we need from matches

### players.role and players.win_status

# create duo lane data base
# {
#     winningCarry:
#     winningSupport:
#     losingCarry:
#     losingSupport:
#     MatchId:
#     patch:
# }


from math import sqrt

from pymongo import MongoClient

import analyze as anlz
from constants.constants import patch
from main import client


def get_lanes(role_one: str, role_two: str, patch: str) -> list:
    duodb = client["Duo_Tierlist"]
    duocol = duodb[f"{patch} Matches"]
    role_one_lowercase = role_one.lower()
    role_two_lowercase = role_two.lower()
    lanes = {}
    myquery = {"Patch": {"$exists": True}, "Type": f"{role_one}{role_two}"}
    winning_lanes = []
    for x in duocol.aggregate(
        [
            {
                "$match": myquery,
            },
            {
                "$group": {
                    "_id": {
                        f"{role_one_lowercase}": f"$winning{role_one}",
                        f"{role_two_lowercase}": f"$winning{role_two}",
                    },
                    f"winning{role_one}WR": {"$avg": f"${role_one_lowercase}WinRate"},
                    f"winning{role_two}WR": {"$avg": f"${role_two_lowercase}WinRate"},
                    "games": {"$sum": 1},
                }
            },
            {"$sort": {"games": 1}},
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
                        f"{role_one_lowercase}": f"$losing{role_one}",
                        f"{role_two_lowercase}": f"$losing{role_two}",
                    },
                    f"winning{role_one}WR": {"$avg": f"${role_one_lowercase}WinRate"},
                    f"winning{role_two}WR": {"$avg": f"${role_two_lowercase}WinRate"},
                    "games": {"$sum": 1},
                }
            },
            {"$sort": {"games": 1}},
        ]
    ):
        losing_lanes.append(x)
    god_wrs = {role_one: {}, role_two: {}}
    for winning_duo in winning_lanes:
        for losing_duo in losing_lanes:
            if winning_duo["games"] + losing_duo["games"] > 0:
                if winning_duo["_id"] == losing_duo["_id"] and (
                    winning_duo["_id"][role_one_lowercase]
                    and winning_duo["_id"][role_two_lowercase]
                ):

                    syneryFactor = round(
                        winning_duo["games"]
                        / (winning_duo["games"] + losing_duo["games"])
                        * 100,
                        2,
                    ) - sqrt(
                        winning_duo[f"winning{role_one}WR"]
                        * winning_duo[f"winning{role_two}WR"]
                    )
                    lanes[
                        str(winning_duo["_id"][role_one_lowercase])
                        + str(winning_duo["_id"][role_two_lowercase])
                    ] = {
                        **winning_duo,
                        **{
                            "losses": losing_duo["games"],
                            "winRate": round(
                                winning_duo["games"]
                                / (winning_duo["games"] + losing_duo["games"])
                                * 100,
                                2,
                            ),
                        },
                        **{
                            f"{role_one_lowercase}WinRate": winning_duo[
                                f"winning{role_one}WR"
                            ],
                            f"{role_two_lowercase}WinRate": winning_duo[
                                f"winning{role_two}WR"
                            ],
                            "syneryFactor": syneryFactor,
                        },
                    }
    return lanes


# gen_regular_tier_entry(client, god, role, rank, patch)


def calc_duo_tier_list(
    client: MongoClient, role_one: str, role_two: str, patch: str
) -> None:
    mydb = client["Matches"]
    mycol = mydb["9.1 Matches"]
    role_one_lowercase = role_one.lower()
    role_two_lowercase = role_two.lower()

    duodb = client["Duo_Tierlist"]
    duocol = duodb["9.1 Matches"]
    myquery = {f"player{i}.Role": 1 for i in range(10)}
    myquery = {
        **myquery,
        **{f"player{i}.Win_Status": 1 for i in range(10)},
        **{"_id": 0, "MatchId": 1, "Patch": 1},
        **{f"player{i}.godName": 1 for i in range(10)},
    }
    set = []
    wrs = {}
    for queue_type in ["Ranked"]:
        for x in mycol.find({}, myquery):
            insert_data = {
                f"winning{role_one}": "",
                f"winning{role_two}": "",
                f"losing{role_one}": "",
                f"losing{role_two}": "",
                "MatchId": x["MatchId"],
                "Patch": x["Patch"],
                "Type": f"{role_one}{role_two}",
            }
            for player in x.keys():
                if "player" in player:
                    if (
                        x[player]["Role"] == role_one
                        and x[player]["Win_Status"] == "Winner"
                    ):
                        insert_data[f"winning{role_one}"] = x[player]["godName"]
                        if x[player]["godName"] in wrs:
                            insert_data[f"{role_one_lowercase}WinRate"] = wrs[
                                x[player]["godName"]
                            ]
                        else:
                            insert_data[
                                f"{role_one_lowercase}WinRate"
                            ] = anlz.get_winrate(
                                client,
                                x[player]["godName"],
                                role_one,
                                patch,
                                queue_type=queue_type,
                            )[
                                "win_rate"
                            ]
                            wrs[x[player]["godName"]] = insert_data[
                                f"{role_one_lowercase}WinRate"
                            ]

                    elif (
                        x[player]["Role"] == role_two
                        and x[player]["Win_Status"] == "Winner"
                    ):
                        insert_data[f"winning{role_two}"] = x[player]["godName"]
                        if x[player]["godName"] in wrs:
                            insert_data[f"{role_two_lowercase}WinRate"] = wrs[
                                x[player]["godName"]
                            ]
                        else:
                            insert_data[
                                f"{role_two_lowercase}WinRate"
                            ] = anlz.get_winrate(
                                client,
                                x[player]["godName"],
                                role_two,
                                patch,
                                queue_type=queue_type,
                            )[
                                "win_rate"
                            ]
                            wrs[x[player]["godName"]] = insert_data[
                                f"{role_two_lowercase}WinRate"
                            ]

                    elif (
                        x[player]["Role"] == role_one
                        and x[player]["Win_Status"] == "Loser"
                    ):
                        insert_data[f"losing{role_one}"] = x[player]["godName"]
                        if x[player]["godName"] in wrs:
                            insert_data[f"{role_one_lowercase}WinRateLoser"] = wrs[
                                x[player]["godName"]
                            ]
                        else:
                            insert_data[
                                f"{role_one_lowercase}WinRateLoser"
                            ] = anlz.get_winrate(
                                client,
                                x[player]["godName"],
                                role_one,
                                patch,
                                queue_type=queue_type,
                            )[
                                "win_rate"
                            ]
                            wrs[x[player]["godName"]] = insert_data[
                                f"{role_one_lowercase}WinRateLoser"
                            ]

                    elif (
                        x[player]["Role"] == role_two
                        and x[player]["Win_Status"] == "Loser"
                    ):
                        insert_data[f"losing{role_two}"] = x[player]["godName"]
                        if x[player]["godName"] in wrs:
                            insert_data[f"{role_two_lowercase}WinRateLoser"] = wrs[
                                x[player]["godName"]
                            ]
                        else:
                            insert_data[
                                f"{role_two_lowercase}WinRateLoser"
                            ] = anlz.get_winrate(
                                client,
                                x[player]["godName"],
                                role_two,
                                patch,
                                queue_type=queue_type,
                            )[
                                "win_rate"
                            ]
                            wrs[x[player]["godName"]] = insert_data[
                                f"{role_two_lowercase}WinRateLoser"
                            ]

            set.append(insert_data)
            if len(set) > 1000:
                duocol.insert_many(set)
                set = []


if __name__ == "__main__":
    get_lanes("Support", "Carry", "10.3")
    pass
