def get_new_id(client, smite_api):
    mydb = client["God_Data"]
    gods = smite_api.getGods()
    for god in range(len(gods)):
        if gods[god]["Name"] == "Shiva":
            mycol = mydb[gods[god]["Name"]]
            data = create_god_data_dict(gods[god])
            mycol.insert_one(data)


def create_god_data_dict(data):
    ret_data = {}
    ret_data["Ability1"] = data["Ability1"]
    ret_data["Ability2"] = data["Ability2"]
    ret_data["Ability3"] = data["Ability3"]
    ret_data["Ability4"] = data["Ability4"]
    ret_data["Ability5"] = data["Ability5"]
    ret_data["AbilityId1"] = data["AbilityId1"]
    ret_data["AbilityId2"] = data["AbilityId2"]
    ret_data["AbilityId3"] = data["AbilityId3"]
    ret_data["AbilityId4"] = data["AbilityId4"]
    ret_data["AbilityId5"] = data["AbilityId5"]
    ret_data["Ability_1"] = data["Ability_1"]
    ret_data["Ability_2"] = data["Ability_2"]
    ret_data["Ability_3"] = data["Ability_3"]
    ret_data["Ability_4"] = data["Ability_4"]
    ret_data["Ability_5"] = data["Ability_5"]
    ret_data["AttackSpeed"] = data["AttackSpeed"]
    ret_data["AttackSpeedPerLevel"] = data["AttackSpeedPerLevel"]
    ret_data["AutoBanned"] = data["AutoBanned"]
    ret_data["Cons"] = data["Cons"]
    ret_data["HP5PerLevel"] = data["HP5PerLevel"]
    ret_data["Health"] = data["Health"]
    ret_data["HealthPerFive"] = data["HealthPerFive"]
    ret_data["HealthPerLevel"] = data["HealthPerLevel"]
    ret_data["Lore"] = data["Lore"]
    ret_data["MagicProtection"] = data["MagicProtection"]
    ret_data["MagicProtectionPerLevel"] = data["MagicProtectionPerLevel"]
    ret_data["MagicalPower"] = data["MagicalPower"]
    ret_data["MagicalPowerPerLevel"] = data["MagicalPowerPerLevel"]
    ret_data["MP5PerLevel"] = data["MP5PerLevel"]
    ret_data["Mana"] = data["Mana"]
    ret_data["ManaPerFive"] = data["ManaPerFive"]
    ret_data["ManaPerLevel"] = data["ManaPerLevel"]
    ret_data["Name"] = data["Name"]
    ret_data["OnFreeRotation"] = data["OnFreeRotation"]
    ret_data["Pantheon"] = data["Pantheon"]
    ret_data["PhysicalPower"] = data["PhysicalPower"]
    ret_data["PhysicalPowerPerLevel"] = data["PhysicalPowerPerLevel"]
    ret_data["PhysicalProtection"] = data["PhysicalProtection"]
    ret_data["PhysicalProtectionPerLevel"] = data["PhysicalProtectionPerLevel"]
    ret_data["Pros"] = data["Pros"]
    ret_data["Roles"] = data["Roles"]
    ret_data["Speed"] = data["Speed"]
    ret_data["Title"] = data["Title"]
    ret_data["Type"] = data["Type"]
    ret_data["abilityDescription1"] = data["abilityDescription1"]
    ret_data["abilityDescription2"] = data["abilityDescription2"]
    ret_data["abilityDescription3"] = data["abilityDescription3"]
    ret_data["abilityDescription4"] = data["abilityDescription4"]
    ret_data["abilityDescription5"] = data["abilityDescription5"]
    ret_data["basicAttack"] = data["basicAttack"]
    ret_data["godAbility1_URL"] = data["godAbility1_URL"]
    ret_data["godAbility2_URL"] = data["godAbility2_URL"]
    ret_data["godAbility3_URL"] = data["godAbility3_URL"]
    ret_data["godAbility4_URL"] = data["godAbility4_URL"]
    ret_data["godAbility5_URL"] = data["godAbility5_URL"]
    ret_data["godCard_URL"] = data["godCard_URL"]
    ret_data["godIcon_URL"] = data["godIcon_URL"]
    ret_data["id"] = data["id"]
    ret_data["latestGod"] = data["latestGod"]
    ret_data["ret_msg"] = data["ret_msg"]
    return ret_data


def get_item_abs_price(name, family, tier, tree):
    price = 0
    index = 1
    for element in tree[family]:
        if tree[family][element]["Name"] == name:
            price += tree[family][element]["Price"]

        if tree[family][element]["Tier"] < tier:
            price += tree[family][element]["Price"]

    return price


def create_item_dict(item, item_prices):
    ret_data = {}
    ret_data["ChildItemId"] = item["ChildItemId"]
    ret_data["DeviceName"] = item["DeviceName"]
    ret_data["ItemDescription"] = item["ItemDescription"]
    ret_data["ItemTier"] = item["ItemTier"]
    ret_data["relativePrice"] = item["Price"]
    ret_data["absolutePrice"] = get_item_abs_price(
        item["DeviceName"], item["RootItemId"], item["ItemTier"], item_prices)
    ret_data["ShortDesc"] = item["ShortDesc"]
    ret_data["itemIcon_URL"] = item["itemIcon_URL"]
    return ret_data


def get_new_items(client, smite_api):
    mydb = client["Item_Data"]
    prices = {}
    items = smite_api.getItems()
    for item in range(len(items)):
        if items[item]["RootItemId"] not in prices:
            prices[items[item]["RootItemId"]] = {items[item]["DeviceName"]: {
                "Price": items[item]["Price"], "Tier": items[item]["ItemTier"], "Name": items[item]["DeviceName"]}}
        else:
            prices[items[item]["RootItemId"]][items[item]["DeviceName"]] = {
                "Price": items[item]["Price"], "Tier": items[item]["ItemTier"], "Name": items[item]["DeviceName"]}

    for item in range(len(items)):
        mycol = mydb[items[item]["DeviceName"]]
        item = create_item_dict(items[item], prices)
        mycol.insert_one(item)
