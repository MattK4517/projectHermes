import pymongo
from datetime import datetime
from constants import (
    Tier_Three_items,
    godsDict,
    roles,
    ranks,
    slots,
    Assassins,
    Guardians,
    Hunters,
    Mages,
    Warriors,
    Starter_items,
)
from main import client
import numpy as np
import matplotlib.pyplot as plt
import os
import analyze as anlz
import pandas as pd

# def mergeDict(dict1, dict2):
#    ''' Merge dictionaries and keep values of common keys in list'''
#    dict3 = {**dict1, **dict2}
#    for key, value in dict3.items():
#        if key in dict1 and key in dict2:
#                dict3[key] = [value , dict1[key]]
#    return dict3


def get_items_by_class(client, class_name, role):
    items = {f"slot{i+1}": {} for i in range(6)}
    for char in class_name:
        print(char)
        char_items = anlz.get_all_builds(
            client, char, role, "9.4", queue_type="Casual", mode="Assault"
        )
        for slot in char_items:
            if "slot" in slot:
                for item in char_items[slot]:
                    if item in items[slot]:
                        items[slot][item]["games"] += char_items[slot][item]["games"]
                        items[slot][item]["wins"] += char_items[slot][item]["wins"]
                    else:
                        items[slot][item] = char_items[slot][item]

    with open("items.txt", "w") as f:
        for slot in items:
            for item in items[slot]:
                if items[slot][item]["games"] > 25:
                    games = items[slot][item]["games"]
                    wins = items[slot][item]["wins"]
                    wr = round(wins / games * 100, 2)
                    f.writelines(f"{slot}, {item} , {wins} , {games} , {wr}% \n")


def get_match_time(patch):
    import numpy

    mydb = client["Matches"]
    mycol = mydb[f"{patch} Matches"]
    total_bans = []
    for x in mycol.find({"Minutes": {"$gte": 12}}, {"Minutes": 1}):
        total_bans.append(x["Minutes"])
    return total_bans
    # print("Total Time: ", sum(total_bans) ,"Max Time: ", max(total_bans), "Number of f6 10s: ", mycol.count_documents({"Minutes": {"$lte": 12}}))
    # print("Average Time: ", numpy.average(total_bans), "Median Time: ", numpy.median(total_bans))
    # print("Standard Dev: ", numpy.std(total_bans))


if __name__ == "__main__":
    total_bans = pd.DataFrame(get_match_time("9.5"))
    total_bans2 = pd.DataFrame(get_match_time("9.4"))
    total_bans3 = pd.DataFrame(get_match_time("9.3"))
    total_bans4 = pd.DataFrame(get_match_time("9.2"))
    total_bans5 = pd.DataFrame(get_match_time("9.1"))
    plt.hist(total_bans.values, alpha=0.75, label="9.5")
    plt.hist(total_bans2.values, alpha=0.5, label="9.4")
    plt.hist(total_bans3.values, alpha=0.5, label="9.3")
    plt.hist(total_bans4.values, alpha=0.5, label="9.2")
    plt.hist(total_bans5.values, alpha=0.5, label="9.1")
    plt.legend()
    plt.show()
    pass
    # items = {item: {"games": 0, "wins": 0} for item in Tier_Three_items}
    # for god in Hunters:
    #     for role in roles:
    #         char_items = anlz.get_all_builds(
    #             client, god, role, "9.2", rank="Diamond+")
    #         for slot in char_items:
    #             if "slot" in slot:
    #                 for item in char_items[slot]:
    #                     if item in items:
    #                         items[item]["games"] += char_items[slot][item]["games"]
    #                         items[item]["wins"] += char_items[slot][item]["wins"]
    #     print(f"{god} done")

    # with open("items.txt", "w") as f:
    #     for item in items:
    #         if items[item]["games"] > 0:
    #             games = items[item]["games"]
    #             wins = items[item]["wins"]
    #             wr = round(wins/games * 100, 2)
    #             f.writelines(f"{item} , {wins} , {games} , {wr}% \n")
    # def get_combat_stats_by_class(client, class_name):
    #     mydb= client["single_combat_stats"]
    #     myquery = {"role": "Mid", "patch": "8.10"}
    #     for god in class_name:
    #         mycol = mydb[god]
    #         for x in mycol.aggregate([
    #             {
    #                 "$match": myquery
    #             },
    #             {
    #                 "$group": {
    #                     "_id": f"{god}",
    #                     "kills": { "$avg": "$kills"},
    #                     "deaths": { "$avg": "$deaths"},
    #                     "damage_": { "$avg": "$damage_player"},
    #                     "damageTaken": { "$avg": "$damage_taken"},
    #                     "damageMitigated": { "$avg": "$damage_mitigated"},
    #                     "healing": { "$avg": "$healing"},
    #                     "selfHealing": { "$avg": "$healing_self"},
    #                     "games": {"$sum": 1},
    #                 }
    #             }
    #         ]):
    #             df = pd.DataFrame(x, index=[0])
    #             df.to_csv("test.csv", queue_type='a', index = False, header=None)

    # get_combat_stats_by_class(client, Warriors)

    # for char_class in [Assassins, Guardians, Hunters, Mages, Warriors]:
    #     games = 0
    #     wins = 0
    #     for god in char_class:
    #         if god in Assassins:
    #             role = "Jungle"
    #         elif god in Guardians:
    #             role = "Support"
    #         elif god in Hunters:
    #             role = "Carry"
    #         elif god in Mages:
    #             role = "Mid"
    #         else:
    #             role = "Solo"
    #         for god in char_class:
    #             win_rate = anlz.get_winrate(client, god, role, "8.10")
    #             wins += win_rate["wins"]
    #             games += win_rate["games"]

    #     print(f"{wins}, {games}, winrate={round(wins/games*100,5)}")

    # match_ids = []
    # mydb = client["single_objective_stats"]
    # def get_style(rank):
    #     if rank == "Bronze":
    #         style = "peru"
    #     elif rank == "Silver":
    #         style = "silver"
    #     elif rank == "Gold":
    #         style = "gold"
    #     elif rank == "Platinum":
    #         style = "slategray"
    #     elif rank == "Diamond":
    #         style = "royalblue"
    #     elif rank == "Masters":
    #         style = "purple"
    #     elif rank == "GrandMaster":
    #         style = "aqua"
    #     return style

    # mydb = client["single_match_stats"]
    # starttime = datetime.now()
    # fields = ["gold", "damage_bot", "kills_bot", "tower_kills","phoenix_kills", "tower_damage", "objective_assists", "wards_placed"]
    # fields = ["kills", "deaths", "assists", "damage_player", "damage_mitigated", "damage_taken", "healing", "healing_self",]
    # dmg_dict = {field: {role: {"god": "", "amount": 0} for role in roles} for field in fields}
    # for field in fields:
    #     top = 0
    #     for god in godsDict:
    #         mycol = mydb[god]
    #         all_games = []
    #         #pymongo.ASCENDING
    #         #pymongo.DESCENDING
    #         #{"damage_mitigated": {"$gt": 0}
    #         #.sort("damage_mitigated", pymongo.DESCENDING)
    #         avg_deaths = 0
    #         deaths = 0
    #         games = 0
    #         for x in mycol.find({"role": {"$exists": True}, "patch": "9.1", "queue_type": f"RankedConq"}, {"_id": 0, field: 1, "role": 1, "matchId": 1}):
    #             deaths += x[field]
    #             games += 1
    #         avg_deaths += deaths/games
    #         mean = sum(all_games) / len(all_games)
    #         variance = sum([((x - mean) ** 2) for x in all_games]) / len(all_games)
    #         res = variance ** 0.5

    #         print(god)
    #         print(f"The Max of the sample is: {max(all_games)}")
    #         print(f"The Min of the sample is: {min(all_games)}")
    #         print(f"The Average of the sample is: {mean}")
    #         print(f"Standard deviation of sample is: {res}")
    #         for role in dmg_dict:
    #             x = np.array([i for i in range(len(dmg_dict[role]))])
    #             y = np.array(sorted(dmg_dict[role]))
    #             # m, b = np.polyfit(x, y, 1)
    #             # plt.plot(x, m*x+b, "r-")
    #             plt.scatter(x, y, label=f"{god} - {role}")
    #             plt.legend(bbox_to_anchor = (1.05, 0.6), loc='upper left')
    #             plt.title(f'{god} {field.replace("_", " ")} across roles')
    #             plt.xlabel("# of games")
    #             plt.ylabel(f'{field.replace("_", " ")}')
    #             plt.tight_layout()
    #             if not os.path.exists(f"C:\\Users\\MayheM\\Desktop\\python\\projectHermes\\charts\\_Role Specific\\{god}"):
    #                 os.mkdir(f"C:\\Users\\MayheM\\Desktop\\python\\projectHermes\\charts\\_Role Specific\\{god}")

    #             plt.savefig(f"C:\\Users\\MayheM\\Desktop\\python\\projectHermes\\charts\\_Role Specific\\{god}\\{field}",
    #             dpi=None,
    #             facecolor='w',
    #             edgecolor='w',
    #             orientation='portrait',
    #             papertype=None,
    #             format=None,
    #             transparent=False,
    #             bbox_inches=None,
    #             pad_inches=0.1,
    #             metadata=None)
    #         # plt.figure()
    #         plt.close()

    # print(f"Completed in {datetime.now() - starttime}")
