import pymongo
from datetime import datetime
from constants import godsDict, roles, ranks, slots, Assassins, Guardians, Hunters, Mages, Warriors
from main import client
import numpy as np
import matplotlib.pyplot as plt
import os 



match_ids = []
mydb = client["single_combat_stats"]
def get_style(rank):
    if rank == "Bronze":
        style = "peru"
    elif rank == "Silver":
        style = "silver"
    elif rank == "Gold":
        style = "gold"
    elif rank == "Platinum":
        style = "slategray"
    elif rank == "Diamond":
        style = "royalblue"
    elif rank == "Masters":
        style = "purple"
    elif rank == "GrandMaster":
        style = "aqua"
    return style


starttime = datetime.now()
fields = ["kills", "deaths", "assists", "damage_player","damage_taken", "damage_mitigated", "healing", "healing_self"]
for field in fields:
    for god in godsDict:
        mycol = mydb[god]
        all_games = []
        dmg_dict = {role: [] for role in roles}
        #pymongo.ASCENDING
        #pymongo.DESCENDING
        #{"damage_mitigated": {"$gt": 0}
        #.sort("damage_mitigated", pymongo.DESCENDING)
        for x in mycol.find({"role": {"$exists": True}}, {"_id": 0, field: 1, "role": 1}):
            if x["role"] in roles:
                dmg_dict[x["role"]].append(x[field])

        # mean = sum(all_games) / len(all_games)
        # variance = sum([((x - mean) ** 2) for x in all_games]) / len(all_games)
        # res = variance ** 0.5

        # print(god)
        # print(f"The Max of the sample is: {max(all_games)}")
        # print(f"The Min of the sample is: {min(all_games)}")
        # print(f"The Average of the sample is: {mean}")
        # print(f"Standard deviation of sample is: {res}")
        for role in dmg_dict:
            x = np.array([i for i in range(len(dmg_dict[role]))]) 
            y = np.array(sorted(dmg_dict[role]))
            # m, b = np.polyfit(x, y, 1)
            # plt.plot(x, m*x+b, "r-")
            plt.scatter(x, y, label=f"{god} - {role}")
            plt.legend(bbox_to_anchor = (1.05, 0.6), loc='upper left')
            plt.title(f'{god} {field.replace("_", " ")} across roles')
            plt.xlabel("# of games")
            plt.ylabel(f'{field.replace("_", " ")}')
            plt.tight_layout()
            if not os.path.exists(f"C:\\Users\\MayheM\\Desktop\\python\\projectHermes\\charts\\_Role Specific\\{god}"):
                os.mkdir(f"C:\\Users\\MayheM\\Desktop\\python\\projectHermes\\charts\\_Role Specific\\{god}")

            plt.savefig(f"C:\\Users\\MayheM\\Desktop\\python\\projectHermes\\charts\\_Role Specific\\{god}\\{field}", 
            dpi=None, 
            facecolor='w', 
            edgecolor='w',
            orientation='portrait', 
            papertype=None, 
            format=None,
            transparent=False, 
            bbox_inches=None, 
            pad_inches=0.1,
            metadata=None)
        # plt.figure()
        plt.close()

print(f"Completed in {datetime.now() - starttime}")