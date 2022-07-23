import pymongo
from main import client
import analyze as anlz
import math
import matplotlib as plt
from constants import num_hits_dict, scaling_dict, percentage_dict, Warriors, Assassins, Hunters, Mages, Guardians
from random import randint
from damage_calc_helpers import *


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


def calc_ability_damage_raw(base, scaling, power, god, ability, prot, miti, armor_reduction_per, armor_reduction_flat, pen_per, pen_flat, **procs):
    proc_damage = 0
    damage = 0
    for i in range(get_num_hits(god, ability, base)):
        # print(get_scaling_changes(god, ability, i+1))
        damage += (((float(base) + ((float(scaling)/100) * float(power))) + (float(base) *
                   get_scaling_changes(god, ability, i+1)/100))) * get_percent_change(god, ability, i+1)

    # if ability == "Tearing The Veil Rift Damage:":
    #     damage = damage * 3
    if procs:
        for proc in procs:
            proc_damage += proc["damage"]

    mitigated = calc_mitigation((proc_damage + damage), prot, miti,
                                armor_reduction_per, armor_reduction_flat, pen_per, pen_flat)
    return {
        "procDamage": proc_damage,
        "damageRaw": damage,
        "damageMitigated": mitigated[1],
        "damageTotal": mitigated[0]
    }


def calc_combo_damage_raw(client, god, levels, power, build, enemy, enemy_build, level=20, enemy_level=20):
    temp = anlz.get_god_stats(client, god, level)
    attSpeed, power, critChance, armor_reduction_per, armor_reduction_flat, pen_per, pen_flat = calc_dps_stats(
        client, god, build, temp["AttackSpeed"])

    defense_stats = anlz.get_god_stats(client, enemy, enemy_level)
    temp_def = calc_tank_stats(client, enemy, enemy_build)
    targetHP = defense_stats["Health"] + temp_def[0]
    targetPhys = defense_stats["PhysicalProtection"] + temp_def[1]
    targetMag = defense_stats["MagicProtection"] + temp_def[2]
    # check for item procs
    # get base damage and scaling of all abilities
    # get raw damage per ability with calc_ability_damage_raw
    abilites = 5  # anlz.get_abilities(god)

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
                                    damage = damage.split(
                                        "/")[int(levels[ability[-1]]) - 1]
                                else:
                                    damage = damage
                                scaling = scaling.split("%")[0]
                                if "+" in scaling:
                                    scaling = scaling[scaling.index("+")+1:]
                            else:
                                if ("damage:" in item["description"].lower() or "damage per" in item["description"].lower()) and "reduced damage:" not in item["description"].lower():
                                    # print(item)
                                    if len(item["value"].split(" ")[0].split("/")) > 1:
                                        damage = item["value"].split(" ")[0].split(
                                            "/")[int(levels[ability[-1]]) - 1]
                                        scaling = 0

                            ability_numbers.append(
                                {"damage": damage,
                                 "scaling": scaling,
                                 "abilityName": f"{ability_names[int(ability[-1])-1]} {item['description']}",
                                 "displayName": f"{ability_names[int(ability[-1])-1]}"
                                 })
    ret_data = {}
    for ability in ability_numbers:
        if "damage" not in ability["abilityName"].lower() and "initial hit:" not in ability["abilityName"].lower():
            ability_numbers.pop(ability_numbers.index(ability))
    change_special(god, ability_numbers, levels)

    for ability, index in enumerate(ability_numbers):
        if "%" not in index["damage"]:
            damage = calc_ability_damage_raw(
                index["damage"], index["scaling"], power, god, ability_numbers[ability]['abilityName'], targetPhys, 0, armor_reduction_per, armor_reduction_flat, pen_per, pen_flat)
            ret_data[ability] = {"damage": damage,
                                 "name": ability_numbers[ability]['abilityName'],
                                 }
    #         print(
    #             f"{ability_numbers[ability]['abilityName']} damage: {damage['damageTotal']}")
    #         total_damage += damage["damageTotal"]
    # print(f"{god} Total Damage: {total_damage}")
    return ret_data


def get_special_item(item):
    if item == "The Executioner":
        return {"Physical Armor Reduction": 7}
    return {}


def calc_dps_stats(client, god, build, baseAttSpeed):
    myfilter = {
        **{"_id": 0},
        **{f"AttackSpeed": 1}
    }
    god = god.title()
    attSpeedIncease = 0
    attSpeedDecrease = 0
    power = 0
    critChance = 0
    armor_reduction_per = 0
    armor_reduction_flat = 0
    pen_per = 0
    pen_flat = 0
    itemdb = client["Item_Data"]
    for item in build:
        stat = get_special_item(item)
        if "Physical Armor Reduction" in stat.keys() and item == "The Executioner":
            armor_reduction_per = 7 # dont think this is needed as exe is taken into account later on right?
        itemcol = itemdb[item]
        for x in itemcol.find({}, {"ItemDescription": 1}): #pls update
            for stat in x["ItemDescription"]["Menuitems"]:
                # print(item, stat)
                if stat["Description"] == "Attack Speed":
                    attSpeedIncease += int(stat["Value"].replace("%",
                                           "").replace("+", ""))/100
                elif "Power" in stat["Description"]:
                    power += int(stat["Value"].replace("%",
                                 "").replace("+", ""))
                elif "Critical" in stat["Description"]:
                    critChance += int(stat["Value"].replace("%",
                                      "").replace("+", ""))
                elif "Penetration" in stat["Description"]:
                    if "%" in stat["Value"]:
                        pen_per += int(stat["Value"].replace("%",
                                                             "").replace("+", ""))
                    else:
                        pen_flat += int(stat["Value"].replace("%",
                                                              "").replace("+", ""))

    attSpeed = baseAttSpeed * (1+(attSpeedIncease - attSpeedDecrease))
    attSpeed = round(attSpeed, 2)
    print(attSpeed)
    return (attSpeed, power, critChance, armor_reduction_per, armor_reduction_flat, pen_per, pen_flat)


def calc_tank_stats(client, god, build):
    god = god.title()
    print(god)
    physProt = 0
    magProt = 0
    mitigation = 0
    health = 0
    itemdb = client["Item_Data"]
    for item in build:
        itemcol = itemdb[item]
        for x in itemcol.find({}, {"ItemDescription": 1}): #pls update x
            for stat in x["ItemDescription"]["Menuitems"]:
                # print(item, stat)
                if stat["Description"] == "Physical Protection":
                    physProt += int(stat["Value"].replace("+", ""))
                elif stat["Description"] == "Magical Protection":
                    magProt += int(stat["Value"].replace("+", ""))
                elif stat["Description"] == "Health":
                    health += int(stat["Value"].replace("+", ""))

    return (health, physProt, magProt, mitigation)


def calc_qins_dmg(hp):
    dmg = 0
    if hp <= 2000:
        dmg = round(hp * .03)
    elif hp >= 2750:
        dmg = round(hp * .05)
    else:
        percent = (.002667 * hp) - 2.333
        dmg = round(hp * percent/100)
    return dmg


def calc_auto_dmg(god, power):
    if (god.lower() in [assassin.lower() for assassin in Assassins]
        or god.lower() in [warrior.lower() for warrior in Warriors]
            or god.lower() in [hunter.lower() for hunter in Hunters]):
        attDamage = power

    return attDamage

x_axis = []
y_axis = []
def calc_dps(client, god, build, enemy, enemy_build, enemy_level, number_of_autos, level=20):
    temp = anlz.get_god_stats(client, god, level)
    baseAttSpeed = temp["AttackSpeed"]
    attSpeed, power, critChance, armor_reduction_per, armor_reduction_flat, pen_per, pen_flat = calc_dps_stats(
        client, god, build, baseAttSpeed)

    if "Dominance" in build:
        pen_per += 10
    defense_stats = anlz.get_god_stats(client, enemy, enemy_level)
    temp_def = calc_tank_stats(client, enemy, enemy_build)
    targetHP = defense_stats["Health"] + temp_def[0]
    targetPhys = defense_stats["PhysicalProtection"] + temp_def[1]
    targetMag = defense_stats["MagicProtection"] + temp_def[2]
    power += temp["PhysicalPower"]
    if (god.lower() in [assassin.lower() for assassin in Assassins]
        or god.lower() in [warrior.lower() for warrior in Warriors]
            or god.lower() in [hunter.lower() for hunter in Hunters]):
        attDamage = power
        damage_type = "Physical"

    dmg = 0
    item_dmg = 0
    item_dmg_out = {"Qin's Sais": 0, "Odysseus' Bow": 0,
                    "Ichaival": 0, "Silverbranch Bow": 0, "Total Item Damage": 0}
    qins = 0
    obow = 0
    ichi_stacks = 0
    sbow_stacks = 0
    crit = 0
    if damage_type == "Physical":
        enemy_prot = targetPhys
    elif damage_type == "Magical":
        enemy_prot = targetMag

    mitigated = {"Qin's Sais": 0, "Odysseus' Bow": 0,
                 "Ichaival": 0, "Silverbranch Bow": 0, "Total Item Damage": 0}

    flag = False
    for i in range(number_of_autos):
        if "The Executioner" in build:
            if i < 5 and i > 0:
                armor_reduction_per = (7 * (i))

        elif "The Heavy Executioner" in build:
            if i < 3 and i > 0:
                armor_reduction_per = 17.5*i

        if "The Ferocious Executioner" in build:
            if i < 11 and i > 1:
                dmg *= 1.02

        if "Ichaival" in build:
            if i < 4 and i > 0:
                attDamage += 10
                ichi_stacks += 1
            item_dmg_out["Ichaival"] += 10 * ichi_stacks

        if "Silverbranch Bow" in build:
            if attSpeed > 2.5:
                sbow_stacks = round((attSpeed - 2.5) / .02)
            attDamage += 2 * sbow_stacks
            item_dmg_out["Silverbranch Bow"] += 2 * sbow_stacks

        if critChance > 0:
            if randint(0, 100) <= critChance:
                crit += 1
                if "Spectral Armor" in enemy_build:
                    dmg += attDamage * .55
                elif "Deathbringer" in build:
                    dmg += attDamage * 1.3
                elif "Spectral Armor" in enemy_build and "Deathbringer" in build:
                    dmg += attDamage * (1.3 - .55)
                else:
                    dmg = attDamage * 1.75
                if "Wind Demon" in build and not flag:
                    pen_per += 10
                    flag = True

        if (i > 0 and i % 4 == 0) and "Odysseus' Bow" in build:
            item_dmg += round(15 + (calc_auto_dmg(god, attDamage) * .6)) 
            item_dmg_out["Odysseus' Bow"] += round(15 + (calc_auto_dmg(god, attDamage) * .6))
            dmg += item_dmg
            item_dmg = 0
            obow += 1

        if "Qin's Sais" in build:
            item_dmg += calc_qins_dmg(targetHP)
            mitigated["Qin's Sais"] += round(calc_mitigation(calc_qins_dmg(
                targetHP), enemy_prot, 0, armor_reduction_per, armor_reduction_flat, pen_per, pen_flat)[1])
            item_dmg_out["Qin's Sais"] += round(calc_mitigation(calc_qins_dmg(
                targetHP), enemy_prot, 0, armor_reduction_per, armor_reduction_flat, pen_per, pen_flat)[0])
            dmg += item_dmg
            item_dmg = 0
            qins += 1

        if "Manikin Mace" in build:
            if attSpeed <= 2:
                item_dmg = attSpeed * 60
            else:
                item_dmg += 2 * 60
            dmg += item_dmg

        if "Stone Cutting Sword" in build:
            if i < 4 and i>0:
                armor_reduction_flat+=7

        if "Void Shield" in build:
            armor_reduction_per += 15

####### Magical items

        if "Telkhines Ring" in build:
            item_dmg += 10 + power * 0.1
            dmg += item_dmg

        if "Void Stone" in build:
            armor_reduction_per += 15

        if "Demonic Grip" in build:
            if i < 4 and i > 0:
                armor_reduction_per += 10

        if "Nimble Bancroft's Talon" in build:
            attSpeed += baseAttSpeed * math.floor(power / 40)

        mitigated["Total Item Damage"] += round(calc_mitigation(calc_auto_dmg(god, attDamage), enemy_prot, 0,
                                                                armor_reduction_per, armor_reduction_flat, pen_per, pen_flat)[1])
        dmg += round(calc_mitigation(calc_auto_dmg(god, attDamage), enemy_prot, 0,
                                     armor_reduction_per, armor_reduction_flat, pen_per, pen_flat)[0])
        # print(item_dmg_out)

####### Graph

        x_axis.append(i)
        y_axis.append(dmg)
    plt.plot(x_axis, y_axis)
    plt.xlabel("Auto Attack Numer")
    plt.ylabel("Damage Dealt")
    plt.title("Damage Graph")
    plt.show()

# store this somewhere, allow user to compare graphs after selecting a different build? just plot 2 sets of numbers        

    item_dmg_out["Total Item Damage"] = item_dmg_out["Qin's Sais"] + \
        item_dmg_out["Odysseus' Bow"] + item_dmg_out["Ichaival"] + \
        item_dmg_out["Silverbranch Bow"]

    mitigated["Total Item Damage"] += mitigated["Qin's Sais"] + \
        mitigated["Odysseus' Bow"]

    mitigated["Total Item Damage Item"] = mitigated["Qin's Sais"] + \
        mitigated["Odysseus' Bow"]

    dps = dmg * attSpeed

    # print(f"Num Crits: {crit}")
    # print(f"Damage Autos: {dmg - item_dmg_out['Total']}")
    # print(f"Damage Total: {dmg}")
    # print(f"Damage Mitigated: {mitigated['Total']}")
    # for key in item_dmg_out:
    #     if item_dmg_out[key] > 0:
    #         print(f"{key} Item Damage: {item_dmg_out[key]}")
    # for key in mitigated:
    #     if mitigated[key] > 0 and key == "Total Item":
    #         print(f"{key} Damage Mitigated: {mitigated[key]}")
    # print(f"Damage per Second: {round(dps)}")
    # print(f"Percent of {enemy}s HP dealt: {round(dmg/targetHP*100,2)}")

    return {**{
        "Number of Crits": crit,
        "Basic Attack Damge": dmg - item_dmg_out['Total Item Damage'],
        "Damage Total": dmg,
        "Damage Mitigated": mitigated["Total Item Damage"]
    },
        **{item: item_dmg_out[item] for item in item_dmg_out}}


def calc_mitigation(dmg, prot, miti, armor_reduction_per, armor_reduction_flat, pen_per, pen_flat):
    # print(armor_reduction_per, armor_reduction_flat, pen_per, pen_flat)
    # % armor reduction
    # Flat armor reduction
    # % pen
    # flat pen
    prot = ((prot * (1 - armor_reduction_per/100))-armor_reduction_flat) * (1-(pen_per/100)) - pen_flat

    taken = dmg * (1-miti) * (100/(100+prot))
    return [round(taken), round(dmg-taken)]


if __name__ == "__main__":
    levels = {
        "1": 4,
        "2": 5,
        "3": 5,
        "4": 1,
        "5": 5
    }
    # print(calc_dps(client, "Achilles", [
    #     "Odysseus' Bow",
    #     "Toxic Blade",
    #     "Shogun's Kusari",
    #     "Silverbranch Bow",
    #     "Ichaival"
    # ], "Odin", [
    #     "Bluestone Brooch",
    #     "Runeforged Hammer",
    #     "Breastplate of Determination",
    #     "Bulwark of Hope",
    #     "Pridwen",
    #     "Spectral Armor"
    # ], 20, 20))
    # avg = 0
    # for i in range(10):
    # calc_dps(client, "Achilles", ["Manikin Mace", "Bloodforge", "Evolved Rage", "Serrated Edge", "Deathbringer", "Wind Demon"],
    # "Agni", [], 20, 20)
    # print(avg/10)
    # for guardian in Guardians:
    print(calc_combo_damage_raw(client, "Chaac",
          levels, 0, ["Bluestone Pendant"], "Baron Samedi", [], 5, 6))

    # 470 + 83
