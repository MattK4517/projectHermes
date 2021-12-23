import pymongo
from main import client
import analyze as anlz
from constants import num_hits_dict, scaling_dict, Warriors

def special_case(ability):
    if ability == "Twin Cleave (Bladestorm) Cleave Damage":
        return 2
    if ability == "Twin Cleave (Bladestorm) Spin Damage":
        return 5
    if ability == "Twin Cleave (Bladestorm) Final Damage":
        return 1
    if ability == "Sundering Strike (Excalibur's Wrath) Jab Damage":
        return 1
    if ability == "Sundering Strike (Excalibur's Wrath) Damage Per Hit":
        return 6
    if ability == "Sundering Strike (Excalibur's Wrath) Landing Damage":
        return 1
    if ability == "Fearless Assault Damage:":
        return 2
    return None

def get_special_ability(ability):
    if ability == "Raven Shout":
        return True
    if ability == "Web":
        return True
    return False

def append_special(god, ability_numbers):
    if god == "Odin":
        ability_numbers.append(                                    
            {"damage":  str(int(ability_numbers[0]["damage"]) + round((float(ability_numbers[1]["damage"]) *1.15))), 
            "scaling": ability_numbers[0]["scaling"], 
            "abilityName": f"Bird Bomb",
            "displayName": f"Bird Bomb"
            })
    if god == "Arachne":
        pass

def get_num_hits(god, ability):
    if special_case(ability):
        return special_case(ability)

    ability_key = ""
    if ability[:-1] in num_hits_dict[god]:
        return num_hits_dict[god][ability[:-1]]

    for key in num_hits_dict[god]:
        if key in ability:
            ability_key = key
            return num_hits_dict[god][ability_key]
    return 0

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
                    if "damage:" in item["description"].lower() or "damage per" in item["description"].lower() or get_special_ability(ability_names[int(ability[-1])-1]):
                        if levels[ability[-1]] != 0:
                            # print(item)
                            if len(item["value"].split("(")) > 1:
                                damage = item["value"].split("(")[0]
                                if len(item["value"].split("(")) > 1:
                                    scaling = item["value"].split("(")[1]
                                if len(damage.split("/")) > 1:
                                    damage = damage.split("/")[levels[ability[-1]] -1]
                                else:
                                    damage = damage
                                scaling = scaling.split("%")[0]
                                if "+" in scaling:
                                    scaling = scaling[scaling.index("+")+1:]
                            else:
                                if "damage:" in item["description"].lower() or "damage per" in item["description"].lower():
                                    if len(item["value"].split(" ")[0].split("/")) > 1:
                                        damage = item["value"].split(" ")[0].split("/")[levels[ability[-1]] -1]
                                        scaling = 0

                            ability_numbers.append(
                                {"damage": damage, 
                                "scaling": scaling, 
                                "abilityName": f"{ability_names[int(ability[-1])-1]} {item['description']}",
                                "displayName": f"{ability_names[int(ability[-1])-1]}"
                                })

    print(ability_numbers)
    for ability in ability_numbers:
        if "damage" not in ability["abilityName"].lower():
            ability_numbers.pop(ability_numbers.index(ability))
    append_special(god, ability_numbers)
    # print(ability_numbers)
    for ability, index in enumerate(ability_numbers):
        # print(index["damage"], index["scaling"], 0, god, ability_numbers[ability]['abilityName'])
        if "%" not in index["damage"]:
            damage = calc_ability_damage_raw(index["damage"], index["scaling"], power, god, ability_numbers[ability]['abilityName'])
            print(f"{ability_numbers[ability]['abilityName']} damage: {damage['damageTotal']}")
            total_damage += damage["damageTotal"]
    print(f"{god} Total Damage: {total_damage}")

levels  =  {
    "1": 5, 
    "2": 5, 
    "3": 5, 
    "4": 5, 
    "5": 5
    }

calc_combo_damage_raw(client, "Fenrir", levels, 0, 0)
for warrior in Warriors:
    print(warrior)
    calc_combo_damage_raw(client, warrior, levels, 0, 0)
    print("\n")


# About 106-108 wraiths in Ah Puch ult