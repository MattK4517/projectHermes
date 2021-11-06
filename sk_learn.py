import pandas as pd
import pymongo
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn import metrics
import matplotlib.pyplot as plt
import seaborn as sns
from constants import godsDict
import os
from constants import Hunters
from bson import BSON
from bson import json_util

client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

# col_names = ["gold", "damage_bot", "kills_bot", "tower_kills", "phoenix_kills", "tower_damage", "objective_assists", "wards_placed"]
# mydb = client["single_objective_stats"]

# col_names = ["kills", "deaths", "assists", "damage_player", "damage_taken", "damage_mitigated","healing", "healing_self"]
# mydb = client["single_combat_stats"]

data = pd.DataFrame()
mydb = client["Matches"]
mycol = mydb["8.10 Matches"]
print(mycol.count_documents({"Entry_Datetime": "11/4/2021"}))
# carrydb = client["carryScore"]
# carrycol = carrydb["8.10 Matches"]
# fil = {f"player{i}.Role": 1 for i in range(10)}
# fil = {**fil, **{f"player{i}.godName": 1 for i in range(10)}} cv6566666666
# fil = {**fil, **{f"player{i}.Win_Status": 1 for i in range(10)}}
# print(fil)
# for x in mycol.find({}, {**fil, **{"carryScore": 1, "MatchId": 1, "Entry_Datetime": 1,"_id": 0}}):
#     print(x)
#     # carrycol.insert_many(scores)

# print(data)
# X = data[col_names]
# y = data["win_status"]
# X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.25,random_state=0)
# logreg = LogisticRegression()
# logreg.fit(X_train,y_train)
# y_pred=logreg.predict(X_test)

# score = logreg.score(X_test, y_test)


# cm = metrics.confusion_matrix(y_test, y_pred)
# plt.figure(figsize=(9,9))
# sns.heatmap(cm, annot=True, fmt=".3f", linewidths=.5, square = True, cmap = 'Blues_r');
# plt.ylabel('Actual label');
# plt.xlabel('Predicted label');
# plt.title(f"Warriors")
# all_sample_title = 'Accuracy Score: {0}'.format(score)
# plt.title(all_sample_title, size = 15)

# # if not os.path.exists(f"C:\\Users\\MayheM\\Desktop\\python\\projectHermes\\charts\\_Machine Learning\\{god}"):
# #     os.mkdir(f"C:\\Users\\MayheM\\Desktop\\python\\projectHermes\\charts\\_Machine Learning\\{god}")

# plt.savefig(f"C:\\Users\\MayheM\\Desktop\\python\\projectHermes\\charts\\_Machine Learning\\{god}", 
# dpi=None, 
# facecolor='w', 
# edgecolor='w',
# orientation='portrait', 
# papertype=None, 
# format=None,
# transparent=False, 
# bbox_inches=None, 
# pad_inches=0.1,
# metadata=None)
# plt.close()