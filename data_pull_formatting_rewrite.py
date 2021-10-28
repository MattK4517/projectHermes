import pymongo
from datetime import datetime
from constants import godsDict, roles, ranks, slots, patch

client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")


class GodData:
    def __init__(self, god):
        self.name = god
        self.matches = []


    def insert_ban(self, matchId, rank):
        mydb = client["single_god_bans"]
        mycol = mydb[self.name]
        mycol.insert_one({
            "Banned in": matchId,
            "rank": rank,
            "patch": patch,
            "Entry_Datetime": match["Entry_Datetime"],
            })

    def set_matches(self, data):
        """append match Ids to self.matches when gods in data"""
        for match in data:
            for key in match:
                if "player" in key and match[key]["godName"] == self.name:
                    self.matches.append(match)
                if "Ban" in key and match[key] == self.name:
                    self.insert_ban(match["MatchId"], normalize_rank(match["player0"]["Conquest_Tier"]))

    def get_matches(self):
        return len(self.matches)

    def calc_matchups(self):
        mydb = client["single_matchups"]
        mycol = mydb[self.name]
        for match in self.matches:
            for key in match:
                if "player" in key and match[key]["godName"] == self.name:
                    flag_player = key
            for key in match:
                if "player" in key and match[key]["Role"] == match[flag_player]["Role"] and match[key]["godName"] != match[flag_player]["godName"]:
                    role_played = match[key]["Role"]
                    enemy = match[key]["godName"]
                    rank = normalize_rank(match[key]["Conquest_Tier"])
                    matchId = match[key]["MatchID"]
                    mycol.insert_one(
                        {   self.name : match[flag_player]["Win_Status"],
                            "rank": rank,
                            "role_played": role_played,
                            "enemy": enemy,
                            "matchId": matchId,
                            "patch": patch,
                            "Entry_Datetime": match["Entry_Datetime"],
                        }
                    )

    def calc_items(self):
        mydb = client["single_items"]
        mycol =  mydb[self.name]
        for match in self.matches:
            build = {}
            for key in match:
                if "player" in key and match[key]["godName"] == self.name:
                    role_played = match[key]["Role"]
                    rank = normalize_rank(match[key]["Conquest_Tier"])
                    win_status = match[key]["Win_Status"]
                    matchId = match[key]["MatchID"]
                    for player_key in match[key]:
                        if "Item_Purch" in player_key:
                            item, purch, number = player_key.split("_")
                            build[f"slot{number}"] = match[key][player_key]

                    mycol.insert_one(
                        {self.name: build,
                        "role_played": role_played,
                        "rank": rank,
                        "win_status": win_status,
                        "matchId": matchId,
                        "patch": patch,
                        "Entry_Datetime": match["Entry_Datetime"],
                        }
                    )

    def calc_combat_stats(self):
        mydb = client["single_combat_stats"]
        mycol =  mydb[self.name]
        for match in self.matches:
            for key in match:
                if "player" in key and match[key]["godName"] == self.name:
                    rank = normalize_rank(match[key]["Conquest_Tier"])
                    role = match[key]["Role"]
                    matchId = match[key]["MatchID"]
                    kills = match[key]["Kills_Player"]
                    deaths = match[key]["Deaths"]
                    assists = match[key]["Assists"]
                    damage_player = match[key]["Damage_Player"]
                    damage_taken = match[key]["Damage_Taken"]
                    damage_mitigated = match[key]["Damage_Mitigated"]
                    healing = match[key]["Healing"]
                    healing_self = match[key]["Healing_Player_Self"]
                    win_status = match[key]["Win_Status"]

                    mycol.insert_one({
                        "rank": rank,
                        "role": role,
                        "matchId": matchId,
                        "kills": kills,
                        "deaths": deaths,
                        "assists": assists,
                        "damage_player": damage_player,
                        "damage_taken": damage_taken,
                        "damage_mitigated": damage_mitigated,
                        "healing": healing,
                        "healing_self": healing_self,
                        "win_status": win_status,
                        "patch": patch,
                        "Entry_Datetime": match["Entry_Datetime"],
                    })


def normalize_rank(tier):
    rank = "Error"
    if tier <= 5:
        rank = "Bronze"
    elif tier <= 10:
        rank = "Silver"
    elif tier <= 15:
        rank = "Gold"
    elif tier <= 20:
        rank = "Platinum"
    elif tier <= 25:
        rank = "Diamond"
    elif tier == 26:
        rank = "Masters"
    elif tier == 27:
        rank = "Grandmaster"
    return rank



def get_date():
    time = datetime.now()
    return f"{time.month}/{time.day}/{time.year}"



# {"Entry_Datetime": {"$lte": "8/30/2021", "$gte": "8/27/2021" }}
def run_format(patch, date):
    sum_gods = 0
    mydb = client["test"]
    mycol = mydb[f"{patch} Matches"]
    set_matches = []
    for match in mycol.find({"Entry_Datetime": {"$gte": date}}):
        set_matches.append(match)


    for god in godsDict:
        godsDict[god] = GodData(god)
        godsDict[god].set_matches(set_matches)
        sum_gods += godsDict[god].get_matches()
        godsDict[god].calc_matchups()
        godsDict[god].calc_items()
        godsDict[god].calc_combat_stats()


        print(f"{god}: {godsDict[god].get_matches()}")