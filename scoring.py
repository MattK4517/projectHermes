    dataDB = client["scoringAverages"]
    mydb = client["test"]
    ## CODE FOR AVERAGE EFFICIENCY ###
    average_efficiency = {role: {"efficiency": 0} for role in roles}
    mycol = mydb["8.9 Matches"]
    datacol = dataDB["efficiency"]
    count = 0 
    for x in mycol.find({}, {"efficiency": 1,"_id": 0}):
        for team in x["efficiency"]:
            for role in x["efficiency"][team]:
                average_efficiency[role]["efficiency"] += x["efficiency"][team][role]["efficiency"]

        count += 1
    
    for role in average_efficiency:
        average_efficiency[role]["efficiency"] = round(average_efficiency[role]["efficiency"] / ( 2 * count ), 2)
    
    datacol.insert_one(average_efficiency)

    ## CODE FOR AVERAGE LEVEL DIFF ###
    average_level_diff = {role: {"levelDiff": 0} for role in roles}
    mycol = mydb["8.9 Matches"]
    datacol = dataDB["levelDiff"]
    count = 0
    for x in mycol.find({}, {"levelDiff": 1, "_id": 0}):
        if "levelDiff" in x.keys():
            for role in x["levelDiff"]["Winner"]:
                if role in average_level_diff.keys():
                    average_level_diff[role]["levelDiff"] += x["levelDiff"]["Winner"][role]["level_diff"]
            count += 1
    for role in average_level_diff:
        average_level_diff[role]["levelDiff"] = round(average_level_diff[role]["levelDiff"] / count)
    
    datacol.insert_one(average_level_diff)
    ## CODE FOR AVERAGE DAMAGE SHARE ###
    average_damage_share = {role: {"damageShare": 0} for role in roles}
    mycol = mydb["8.9 Matches"]
    datacol = dataDB["damageShare"]
    count = 0
    for x in mycol.find({}, {"damageScore": 1, "_id": 0}):
        if "damageScore" in x.keys():
            for team in x["damageScore"]:
                del x["damageScore"][team]["totalDamage"]
                for role in x["damageScore"][team]:
                    if role in average_damage_share.keys():
                        average_damage_share[role]["damageShare"] += x["damageScore"][team][role]["damageShare"] / 2
            count += 1

    for role in average_damage_share:
        average_damage_share[role]["damageShare"] = round(average_damage_share[role]["damageShare"] / count, 2)

    datacol.insert_one(average_damage_share)


    # CALCS AVERAGE GOLD SHARE FOR THE ROLES
    average_gold_share = {role: {"goldShare": 0} for role in roles}
    mycol = mydb["8.9 Matches"]
    datacol = dataDB["goldShare"]
    count = 0
    for x in mycol.find({}, {"carryScore": 1, "_id": 0}):
        if "carryScore" in x.keys():
            for team in x["carryScore"]:
                del x["carryScore"][team]["totalGold"]
                for role in x["carryScore"][team]:
                    if role in average_gold_share.keys():
                        average_gold_share[role]["goldShare"] += x["carryScore"][team][role]["goldShare"] / 2
            count += 1

    for role in average_gold_share:
        average_gold_share[role]["goldShare"] = round(average_gold_share[role]["goldShare"] / count, 2)

    datacol.insert_one(average_gold_share)