from constants import Assassins, Guardians, Hunters, Mages, Warriors


def calc_set_damage(base, ability_level, scaling_changes):
    damage = 0
    for i in range(8):
        if i >= 1:
            damage += (base * (int(scaling_changes.split("/")
                       [ability_level-1])/100)) * .4
        else:
            damage += base * int(scaling_changes.split("/")
                                 [ability_level-1]) / 100
    return damage


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
            {"damage":  str(int(ability_numbers[0]["damage"]) + round((float(ability_numbers[1]["damage"]) * 1.15))),
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


def get_correct_prots(god, phys, mag):
    if god in Assassins + Hunters + Warriors:
        return phys
    if god in Guardians + Mages:
        return mag
    return 0


def special_description_parsing(description):
    return ("damage:" in description
            or "damage per" in description
            or "initial hit:" in description
            or "damage" in description
            ) and ("lane minion damage" not in description
                   and "self damage" not in description
                   and "jealousy damage" not in description
                   and "buff" not in description
                   and "damage mitigation" not in description
                   and "damage reduction" not in description
                   and "damage taken" not in description
                   )
