import pymongo
from main import client
import analyze as anlz
from constants import num_hits_dict, scaling_dict, percentage_dict, Warriors, Assassins

def special_case(ability, base):
    base = base.strip()
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
    if ability == "Fear No Evil Damage per Tick:":
        if base == "30":
            return 4
        if base == "35":
            return 5
        if base == "40":
            return 6
        if base == "45":
            return 7
        if base == "50":
            return 8
    if ability == "Destruction Damage:":
        if base == "25":
            return 8
        if base == "30":
            return 8
        if base == "35":
            return 9
        if base == "40":
            return 9
        if base == "45":
            return 10
    if ability == "Univeral Ring Toss":
        pass
    
    if ability == "Sever Damage":
        if base == "100":
            return 10
        if base == "150":
            return 11
        if base == "200":
            return 12
        if base == "255":
            return 13
        if base == "300":
            return 14
    return None

def get_special_ability(ability):
    if ability == "Raven Shout":
        return True
    if ability == "Web":
        return True
    return False

def change_special(god, ability_numbers, levels):

    if god == "Cthulhu":
        ability_numbers.append( 
            {"damage": "100/150/200/255/300".split("/")[levels["1"] - 1],
            "scaling": "25",
            "abilityName": f"Sever Damage",
            "displayName": f"Sever"}
        )
    if god == "Odin":
        ability_numbers.append(                                    
            {"damage":  str(int(ability_numbers[0]["damage"]) + round((float(ability_numbers[1]["damage"]) *1.15))), 
            "scaling": ability_numbers[0]["scaling"], 
            "abilityName": f"Bird Bomb",
            "displayName": f"Bird Bomb"
            })
    if god == "Mercury":
        for ability in ability_numbers:
            if ability["abilityName"] == "Special Delivery Minion Damage:":
                ability_numbers.remove(ability)
    
    if god == "Serqet":
        damage = "0"
        if ability_numbers[3]["damage"].strip() == "100":
            damage = "20"
        if ability_numbers[3]["damage"].strip() == "175":
            damage = "35"
        if ability_numbers[3]["damage"].strip() == "250":
            damage = "50"
        if ability_numbers[3]["damage"].strip() == "325":
            damage = "75" 
        if ability_numbers[3]["damage"].strip() == "400":
            damage = "90"
        
        ability_numbers.append({
        "damage": damage, 
        "scaling": "16", 
        "abilityName": f"Last Breath Poison Damage",
        "displayName": f"Last Breath Poison"
        })
    
    if god == "Set": 
        pass

    if god == "Merlin":
        ability_numbers.append({
            "damage": "10/20/30/40/50".split("/")[levels["1"] - 1],
            "scaling": "30",
            "abilityName": f"Radiate Damage per tick",
            "displayName": f"Radiate",
        })

        ability_numbers.append({
            "damage": "5/10/15/20/25".split("/")[levels["1"] - 1],
            "scaling": "5",
            "abilityName": f"Radiate Burn Damage",
            "displayName": f"Radiate",
        })

        ability_numbers.append({
            "damage": "60/95/130/165/200".split("/")[levels["1"] - 1],
            "scaling": "55",
            "abilityName": f"Frostbolt Damage",
            "displayName": f"Frostbolt",
        })

        ability_numbers.append({
            "damage": "6/12/18/24/30".split("/")[levels["2"] - 1],
            "scaling": "18",
            "abilityName": f"Dragonfire Damage per tick",
            "displayName": f"Dragonfire",
        })

        ability_numbers.append({
            "damage": "10/25/40/55/70".split("/")[levels["2"] - 1],
            "scaling": "15",
            "abilityName": f"Blizzard Damage per tick",
            "displayName": f"Blizzard",
        })
        

def get_num_hits(god, ability, base):
    if special_case(ability, base):
        return special_case(ability, base)

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
    if ability_key in scaling_dict:
        return scaling_dict[ability_key][f"hit{hit}"]
    return 0

def get_percent_change(god, ability, hit):
    ability_key = ""
    for key in num_hits_dict[god]:
        if key in ability:
            ability_key = key
    if ability_key in percentage_dict:
        return percentage_dict[ability_key][f"hit{hit}"]
    return 1

def calc_ability_damage_raw(base, scaling, power, god, ability, **procs):
    proc_damage = 0
    damage = 0
    for i in range(get_num_hits(god, ability, base)):
        # print(get_scaling_changes(god, ability, i+1))
        damage += (((float(base) + ((float(scaling)/100) * float(power))) + (float(base) * get_scaling_changes(god, ability, i+1)/100))) * get_percent_change(god, ability, i+1)
    
    # if ability == "Tearing The Veil Rift Damage:":
    #     damage = damage * 3
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
                **{f"abilityDescription{i+1}": 1 for i in range(abilites)},
                **{f"Ability_{i+1}": 1 for i in range(abilites)},
    }
    god = god.title()
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
                    if ("damage:" in item["description"].lower() 
                    or "damage per" in item["description"].lower()
                    or get_special_ability(ability_names[int(ability[-1])-1]) 
                    or "initial hit:" in item["description"].lower()
                    or "damage" in item["description"].lower()
                    ) and ("lane minion damage" not in item["description"].lower()
                    and "self damage" not in item["description"].lower()
                    and "jealousy damage" not in item["description"].lower()
                    and "buff" not in item["description"].lower()
                    and "damage mitigation" not in item["description"].lower()
                    and "damage reduction" not in item["description"].lower()
                    ):
                        if levels[ability[-1]] != 0:
                            if len(item["value"].split("(")) > 1:
                                damage = item["value"].split("(")[0]
                                if len(item["value"].split("(")) > 1:
                                    scaling = item["value"].split("(")[1]
                                if len(damage.split("/")) > 4:
                                    damage = damage.split("/")[int(levels[ability[-1]]) -1]
                                else:
                                    damage = damage
                                scaling = scaling.split("%")[0]
                                if "+" in scaling:
                                    scaling = scaling[scaling.index("+")+1:]
                            else:
                                if ("damage:" in item["description"].lower() or "damage per" in item["description"].lower()) and "reduced damage:" not in item["description"].lower():
                                    print(item)
                                    if len(item["value"].split(" ")[0].split("/")) > 1:
                                        damage = item["value"].split(" ")[0].split("/")[int(levels[ability[-1]]) -1]
                                        scaling = 0

                            ability_numbers.append(
                                {"damage": damage, 
                                "scaling": scaling, 
                                "abilityName": f"{ability_names[int(ability[-1])-1]} {item['description']}",
                                "displayName": f"{ability_names[int(ability[-1])-1]}"
                                })


    print(ability_numbers)
    ret_data = {}
    for ability in ability_numbers:
        if "damage" not in ability["abilityName"].lower() and "initial hit:" not in ability["abilityName"].lower():
            ability_numbers.pop(ability_numbers.index(ability))
    change_special(god, ability_numbers, levels)
    # print(ability_numbers)
    for ability, index in enumerate(ability_numbers):
        # print(index["damage"], index["scaling"], 0, god, ability_numbers[ability]['abilityName'])
        if "%" not in index["damage"]:
            damage = calc_ability_damage_raw(index["damage"], index["scaling"], power, god, ability_numbers[ability]['abilityName'])
            ret_data[ability] = {"damage": damage, "name": ability_numbers[ability]['abilityName']}
            print(f"{ability_numbers[ability]['abilityName']} damage: {damage['damageTotal']}")
            total_damage += damage["damageTotal"]
    print(f"{god} Total Damage: {total_damage}")
    return ret_data

if __name__ == "__main__":  
    levels  =  {
        "1": 5, 
        "2": 5, 
        "3": 5, 
        "4": 5, 
        "5": 5
        }
    calc_combo_damage_raw(client, "Xing Tian", levels, 0, 0)
# for warrior in Warriors:
#     print(warrior)
#     calc_combo_damage_raw(client, warrior, levels, 0, 0)
#     print("\n")

  
# # About 106-108 wraiths in Ah Puch ult

# # Set calc
# # Baba Ult