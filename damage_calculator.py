from math import ceil, floor
import pymongo
from main import client
import analyze as anlz
from constants import num_hits_dict, scaling_dict, percentage_dict, Warriors, Assassins, Hunters, Mages, Guardians
from random import randint
from damage_calc_helpers import *


def get_num_hits(god, ability, base):
    """
        returns the number of times each ability hits
    """
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
    """
        returns if ability has any changes to its damage scaling, and what said scaling is
    """
    ability_key = ""
    for key in num_hits_dict[god]:
        if key in ability:
            ability_key = key
    if ability_key in scaling_dict:
        return scaling_dict[ability_key][f"hit{hit}"]
    return 0


def get_percent_change(god, ability, hit):
    """
      returns if ability has any changes to its damage scaling, and what said scaling is
      # TODO remove funciton
    """
    ability_key = ""
    for key in num_hits_dict[god]:
        if key in ability:
            ability_key = key
    if ability_key in percentage_dict:
        return percentage_dict[ability_key][f"hit{hit}"]
    return 1


def get_proc(item):
    if item == "Bluestone Pendant":
        return


def calc_ability_damage_raw(base, scaling, power, god, ability, prot, armor_reduction_per, armor_reduction_flat, pen_per, pen_flat, miti=0, procs=[]):
    """
      returns damage stats for a given ability
    """
    proc_damage = 0
    damage = 0
    mitigated = 0
    hits = get_num_hits(god, ability, base)
    print(base, scaling, power, hits)
    for i in range(hits):
        # print(get_scaling_changes(god, ability, i+1))
        temp = calc_mitigation(((float(base) + ((float(scaling)/100) * float(power))) + (float(base) *
                                                                                         get_scaling_changes(god, ability, i+1)/100)) * get_percent_change(god, ability, i+1), prot,
                               armor_reduction_per, armor_reduction_flat, pen_per, pen_flat, miti)

        damage += temp["dealt"]
        mitigated += temp["mitigated"]
    if len(procs) > 0:
        for proc in procs:
            get_proc(proc)

    if hits > 1:
        temp = calc_mitigation(damage + mitigated, prot,
                               armor_reduction_per, armor_reduction_flat, pen_per, pen_flat, miti)
        # print("NEW MITI", temp, damage + mitigated, damage, mitigated)

        damage = temp["dealt"]
        mitigated = temp["mitigated"]
    return {
        "procDamage": proc_damage,
        "damageRaw": damage + mitigated,
        "damageMitigated": mitigated,
        "damageTotal": damage
    }


def calc_combo_damage_raw(client, god, levels, build, enemy, enemy_build, level=20, enemy_level=20):
    """ returns json for a gods damage stats given parameters
    Args:
        client ([MongoClient]): database connectionmitigated
        god ([String]): name of god
        levels ([Dict]): ability level for base damage, example in main function
        build ([String[]]): list of items to get stats for god
        enemy ([String]): enemy god to get base prots for
        enemy_build ([String[]]): list of items to get stats for enemy god
        level ([Int]): level of god (for base stats)
        enemy_level ([Int]): level of enemy (for base stats)
    """
    temp = anlz.get_god_stats(client, god, level)
    attSpeed, power, critChance, armor_reduction_per, armor_reduction_flat, pen_per, pen_flat = calc_dps_stats(
        client, god, build, temp["AttackSpeed"])

    defense_stats = anlz.get_god_stats(client, enemy, enemy_level)
    temp_def = calc_tank_stats(client, enemy, enemy_build)
    targetHP = defense_stats["Health"] + temp_def[0]
    targetPhys = defense_stats["PhysicalProtection"] + temp_def[1]
    targetMag = defense_stats["MagicProtection"] + temp_def[2]
    prots = get_correct_prots(god, targetPhys, targetMag)
    print(power)
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
                    if special_description_parsing(item["description"].lower()) or get_special_ability(ability_names[int(ability[-1])-1]):
                        if levels[ability[-1]] != 0:
                            split_line = len(item["value"].split("("))
                            if split_line > 1:
                                damage = item["value"].split("(")[0]
                                if split_line > 1:
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
                index["damage"], index["scaling"], power, god, ability_numbers[ability]['abilityName'], prots, armor_reduction_per, armor_reduction_flat, pen_per, pen_flat)
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
    """
      returns gods offensive stats with a given build
    """
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
        itemcol = itemdb[item]
        # pls update
        for item_description in itemcol.find({}, {"ItemDescription": 1}):
            for stat in item_description["ItemDescription"]["Menuitems"]:
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
    """
      returns gods defensive stats with a given build
    """
    god = god.title()
    print(god)
    physProt = 0
    magProt = 0
    mitigation = 0
    health = 0
    itemdb = client["Item_Data"]
    for item in build:
        itemcol = itemdb[item]
        # pls update x
        for item_description in itemcol.find({}, {"ItemDescription": 1}):
            for stat in item_description["ItemDescription"]["Menuitems"]:
                # print(item, stat)
                if stat["Description"] == "Physical Protection":
                    physProt += int(stat["Value"].replace("+", ""))
                elif stat["Description"] == "Magical Protection":
                    magProt += int(stat["Value"].replace("+", ""))
                elif stat["Description"] == "Health":
                    health += int(stat["Value"].replace("+", ""))

    return (health, physProt, magProt, mitigation)


def calc_qins_dmg(hp):
    """
        returns damage of qins sais given hp scaling
    """
    dmg = 0
    if hp <= 2000:
        dmg = hp * .03
    elif hp >= 2750:
        dmg = hp * .05
    else:
        percent = (.002667 * hp) - 2.333
        dmg = hp * percent/100
    return dmg


def calc_auto_dmg(god, power):
    """
      returns basic attack damage of gods
      # TODO add magical characters
    """
    if god in Assassins + Hunters + Warriors:
        att_damage = power

    return att_damage


def calc_dps(client, god, build, enemy, enemy_build, enemy_level, level=20, number_of_autos=10):
    """
      returns damage stats for basic attacks
      # TODO clean up entire function
    """
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
    if god in Assassins + Hunters + Warriors:
        attDamage = power
        damage_type = "Physical"

    dmg_out = {"Qin's Sais": 0, "Odysseus' Bow": 0,
               "Ichaival": 0, "Silverbranch Bow": 0, "Total Item Damage": 0, "Total Auto Damage": 0}
    obow = 0
    ichi_stacks = 0
    sbow_stacks = 0
    crit = 0
    if damage_type == "Physical":
        enemy_prot = targetPhys
    elif damage_type == "Magical":
        enemy_prot = targetMag

    mitigated = {"Qin's Sais": 0, "Odysseus' Bow": 0,
                 "Ichaival": 0, "Silverbranch Bow": 0, "Total Item Damage Mitigated": 0, "Total Auto Damage Mitigated": 0}

    flag = False
    for i in range(number_of_autos):
        if "Void Stone" in build or "Void Shield" in build:
            armor_reduction_per = 15

        if "Stone Cutting Sword" in build:
            if i < 3 and i > 0:
                armor_reduction_flat += 7

        if "The Executioner" in build:
            if i < 5 and i > 0:
                armor_reduction_per = (7 * (i))

        if "The Heavy Executioner" in build:
            if i < 3 and i > 0:
                armor_reduction_per = 17.5*i

        if "The Ferocious Executioner" in build:
            if i < 11 and i > 1:
                dmg *= 1.02

        if "Ichaival" in build:
            if i < 4 and i > 0:
                attDamage += 10
                ichi_stacks += 1
            dmg_out["Ichaival"] += 10 * ichi_stacks

        if "Silverbranch Bow" in build:
            if attSpeed > 2.5:
                sbow_stacks = round((attSpeed - 2.5) / .02)
            attDamage += 2 * sbow_stacks
            dmg_out["Silverbranch Bow"] += 2 * sbow_stacks
            dmg_out["Total Item Damage"] += 2 * sbow_stacks

        if critChance > 0:
            if randint(0, 100) <= critChance:
                crit += 1
                if "Spectral Armor" in enemy_build:
                    dmg_out["Total Auto Damage"] += attDamage * .55
                elif "Deathbringer" in build:
                    dmg_out["Total Auto Damage"] += attDamage * 1.3
                elif "Spectral Armor" in enemy_build and "Deathbringer" in build:
                    dmg_out["Total Auto Damage"] += attDamage * (1.3 - .55)
                else:
                    dmg_out["Total Auto Damage"] += attDamage * 0.75
                if "Wind Demon" in build and not flag:
                    pen_per += 10
                    flag = True

        if (i > 0 and i % 4 == 0) and "Odysseus' Bow" in build:
            obow_damage = calc_mitigation(
                15 + calc_auto_dmg(god, attDamage) * .6, targetPhys, armor_reduction_per, armor_reduction_flat, pen_per, pen_flat)

            dmg_out["Odysseus' Bow"] += obow_damage["dealt"]
            mitigated["Odysseus' Bow"] += obow_damage["mitigated"]
            obow += 1

        if "Qin's Sais" in build:
            qins_damage = calc_mitigation(calc_qins_dmg(
                targetHP), targetPhys, armor_reduction_per, armor_reduction_flat, pen_per, pen_flat)
            mitigated["Qin's Sais"] += qins_damage["mitigated"]

            dmg_out["Qin's Sais"] += qins_damage["dealt"]

        # TODO add manikin mace
        if "Manikin Mace" in build:
            if attSpeed <= 2:
                item_dmg = attSpeed * 60
            else:
                item_dmg += 2 * 60
# Magical items

        if "Telkhines Ring" in build:
            item_dmg += 10 + power * 0.1
            dmg += item_dmg

        if "Demonic Grip" in build:
            if i < 4 and i > 0:
                armor_reduction_per += 10

        if "Nimble Bancroft's Talon" in build:
            attSpeed += baseAttSpeed * power/40

        mitigated["Total Auto Damage Mitigated"] += round(calc_mitigation(calc_auto_dmg(god, attDamage), enemy_prot,
                                                                          armor_reduction_per, armor_reduction_flat, pen_per, pen_flat)["mitigated"])
        dmg_out["Total Auto Damage"] += round(calc_mitigation(calc_auto_dmg(god, attDamage), enemy_prot,
                                                              armor_reduction_per, armor_reduction_flat, pen_per, pen_flat)["dealt"])
        # print(item_dmg_out)

    for key in mitigated:
        if "Total" not in key and key not in ["Ichaival"]:
            mitigated["Total Item Damage Mitigated"] += mitigated[key]

    for key in dmg_out:
        if "Total" not in key and key not in ["Ichaival"]:
            dmg_out["Total Item Damage"] += dmg_out[key]
    # print("MITIGATED", mitigated)
    # print("DAMAGE", dmg_out)
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
        "Basic Attack Damge": dmg_out['Total Auto Damage'],
        "Damage Total": dmg_out['Total Auto Damage'] + dmg_out['Total Item Damage'],
        "Damage Mitigated": mitigated["Total Item Damage Mitigated"]
    },
        **{item: dmg_out[item] for item in dmg_out}}


def calc_mitigation(dmg, prot, armor_reduction_per, armor_reduction_flat, pen_per, pen_flat, miti=0):
    """
      returns how much damage was mitigated given pen/prot stats
    """
    # print(armor_reduction_per, armor_reduction_flat, pen_per, pen_flat)
    # % armor reduction
    # Flat armor reduction
    # % pen
    # flat pen
    print(miti)
    prot = (((prot * (1 - armor_reduction_per/100))) -
            armor_reduction_flat) * (1-(pen_per/100)) - pen_flat

    taken = dmg * (1-miti) * float((100/(100+prot)))
    return {
        "dealt": taken,
        "mitigated": dmg-taken
    }


if __name__ == "__main__":
    # ADJUST ABILITY LEVELS HERE
    # TO GET A RANK 1 ACHILLES 1 FOR EXAMPLE
    # set "1" to 1
    levels = {
        "1": 5,
        "2": 5,
        "3": 5,
        "4": 5,
        "5": 5
    }
    # build = [
    # "Stone Cutting Sword", "Odysseus' Bow", "Ichaival", "Qin's Sais", "Bloodforge"]
    # build = ["Archmage's Gem", "Chronos' Pendant", "Evolved Book of Thoth",
    #  "Jotunn's Cunning", "Heartseeker", "Serrated Edge"]
    build = []
    print(calc_combo_damage_raw(client, "Skadi",
          levels, build, "Odin", [], 20, 20))
    print(calc_combo_damage_raw(client, "Izanami",
          levels, build, "Odin", [], 20, 20))
    # print(calc_dps(client, "Achilles", build, "Odin", [], 1, 1))

    # print(calc_combo_damage_raw(client, "Chaac",
    #       ldmg, prot, armor_reduction_per, armor_reduction_flat, pen_per, pen_flatevels, ["Bluestone Pendant"], "Baron Samedi", [], 5, 6))
