from __init__ import client
import analyze as anlz
from constants import patch, roles


def add_carry_scores():
    mydb = client["Matches"]
    mycol = mydb[f"{patch} Matches"]

    updatedb = client["CarryScores"]
    updatecol = updatedb[f"{patch} Matches"]
    data = []
    for x in mycol.find({}):
        data.append({**{"MatchId": x["MatchId"]}, **anlz.get_carry_score(x)})

        if len(data) == 1000:
            updatecol.insert_many(data)
            data = []
            print("1k done")


if __name__ == "__main__":
    mydb = client["CarryScores"]
    mycol = mydb[f"{patch} Matches"]

    for field in ["goldScore", "damageScore", "killPart"]:
        for team in ["Winner", "Loser"]:
            for role in roles:
                if field == "goldScore":
                    final = "goldShare"

                elif field == "damageScore":
                    final = "damageShare"
                    
                elif field == "killPart":
                    final = "killShare"
                    
                for x in mycol.aggregate(
                    [
                        {
                            "$group": {
                                "_id": f"{role}{team}{field}",
                                "stdDev": {"$stdDevPop": f"${field}.{team}.{role}.{final}"},
                                "avg": {"$avg": f"${field}.{team}.{role}.{final}"},
                                "max": {"$max": f"${field}.{team}.{role}.{final}"},
                                "min": {"$min": f"${field}.{team}.{role}.{final}"},
                            }
                        }
                    ]
                ):
                    print(f"{team} {field} {role}")
                    print(x)
