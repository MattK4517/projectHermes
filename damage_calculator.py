import pymongo
from main import client
import analyze as anlz
from constants import num_hits_dict, scaling_dict

def get_num_hits(god, ability):
    ability_key = ""
    for key in num_hits_dict[god]:
        if key in ability:
            ability_key = key
    return num_hits_dict[god][ability_key]

def get_scaling_changes(god, ability, hit):
    ability_key = ""
    for key in num_hits_dict[god]:
        if key in ability:
            ability_key = key
    if type(scaling_dict[god][ability_key]) is dict:
        return scaling_dict[god][ability_key][f"hit{hit}"]
    return 0

def calc_ability_damage_raw(base, scaling, power, god, ability, **procs):
    proc_damage = 0
    damage = 0
    for i in range(get_num_hits(god, ability)):
        damage += (float(base) + ((float(scaling)/100) * float(power))) + (float(base) * get_scaling_changes(god, ability, i+1)/100)
    if procs:
        for proc in procs:
            proc_damage += proc["damage"]
    
    return {
            "procDamage": proc_damage, 
            "damageRaw": damage,
            "damageTotal": proc_damage + damage 
    }

# level
#  {
# abilityn: num_points
# for abilityn in god abilities
#  }
def calc_combo_damage_raw(client, god, levels, power, build):
    #check for item procs
    #get base damage and scaling of all abilities
    #get raw damage per ability with calc_ability_damage_raw
    abilites = 5 #anlz.get_abilities(god)
    total_damage = 0
    myfilter = {
                **{"_id": 0},
                **{f"abilityDescription{i}": 1 for i in range(abilites)},
                **{f"Ability_{i}": 1 for i in range(abilites)},
    }
    mydb = client["God_Data"]
    mycol = mydb[god]
    ability_numbers = []
    ability_names = []
    for x in mycol.find({}, myfilter):
        for ability in x:
            if "Ability_" in ability:
                ability_names.append(x[ability]["Summary"])
            else:
                for item in x[ability]["itemDescription"]["rankitems"]:
                    if "Damage:" in item["description"] or "Damage Per" in item["description"]:
                        # print(item["value"])
                        if levels[ability[-1]] != 0:
                            damage = item["value"].split("(")[0]
                            if len(item["value"].split("(")) > 1:
                                scaling = item["value"].split("(")[1]
                            damage = damage.split("/")[levels[ability[-1]] -1]
                            scaling = scaling.split("%")[0]
                            if "+" in scaling:
                                scaling = scaling[scaling.index("+")+1:]
                            ability_numbers.append(
                                {"damage": damage, 
                                "scaling": scaling, 
                                "abilityName": f"{ability_names[int(ability[-1])-1]} {item['description']}"
                                })
    print(ability_numbers)
    for ability, index in enumerate(ability_numbers):
        # print(index["damage"], index["scaling"], 0, god, ability_numbers[ability]['abilityName'])
        damage = calc_ability_damage_raw(index["damage"], index["scaling"], 0, god, ability_numbers[ability]['abilityName'])
        print(f"{ability_numbers[ability]['abilityName']} damage: {damage['damageTotal']}")
        total_damage += damage["damageTotal"]
    print(total_damage)

levels  =  {
    "1": 5, 
    "2": 5, 
    "3": 5, 
    "4": 5, 
    "5": 5
    }
calc_combo_damage_raw(client, "Amaterasu", levels, 0, 0)