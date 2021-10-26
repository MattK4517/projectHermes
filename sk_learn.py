import matplotlib.pyplot as plt
import numpy as np
from numpy.core.fromnumeric import size
import pandas as pd
import rfpimp
from sklearn import datasets, linear_model
from sklearn.metrics import mean_squared_error, r2_score
import pymongo
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")


# Load the diabetes dataset
mydb = client["test"]
mycol = mydb["8.9 Matches"]
myquery = {}
diabetes_X = []
diabetes_y = []

db = mydb
collection = mycol
df = pd.DataFrame(list(collection.find()))

features = ['Time_Dead', 'Ranked_Stat_Conq', 'Minutes', 'Deaths', 'Damage_Taken']

######################################## Train/test split #########################################

df_train, df_test = train_test_split(df, test_size=0.20)
df_train = df_train[features]
df_test = df_test[features]

X_train, y_train = df_train.drop('Prod',axis=1), df_train['Prod']
X_test, y_test = df_test.drop('Prod',axis=1), df_test['Prod']

################################################ Train #############################################

rf = RandomForestRegressor(n_estimators=100, n_jobs=-1)
rf.fit(X_train, y_train)

############################### Permutation feature importance #####################################

imp = rfpimp.importances(rf, X_test, y_test)

############################################## Plot ################################################

fig, ax = plt.subplots(figsize=(6, 3))

ax.barh(imp.index, imp['Importance'], height=0.8, facecolor='grey', alpha=0.8, edgecolor='k')
ax.set_xlabel('Importance score')
ax.set_title('Permutation feature importance')
ax.text(0.8, 0.15, 'aegis4048.github.io', fontsize=12, ha='center', va='center',
        transform=ax.transAxes, color='grey', alpha=0.5)
plt.gca().invert_yaxis()

fig.tight_layout()

# # Use only one feature
# data_breakpoint = round(len(diabetes_X) * .5)
# # Split the data into training/testing sets
# diabetes_X_train = diabetes_X[:-data_breakpoint]
# diabetes_X_test = diabetes_X[-data_breakpoint:]

# # Split the targets into training/testing sets
# diabetes_y_train = diabetes_y[:-data_breakpoint]
# diabetes_y_test = diabetes_y[-data_breakpoint:]

# # Create linear regression object
# regr = linear_model.LinearRegression()

# # Train the model using the training sets
# regr.fit(diabetes_X_train, diabetes_y_train)
# # Make predictions using the testing set
# diabetes_y_pred = regr.predict(diabetes_X_test)
# print(size(diabetes_X_test))
# print(len(diabetes_X_test))
# print(size(diabetes_y_pred))
# print(size(diabetes_y_test))


# # The coefficients
# print('Coefficients: \n', regr.coef_)
# # The mean squared error
# print('Mean squared error: %.2f'
#       % mean_squared_error(diabetes_y_test, diabetes_y_pred))
# # The coefficient of determination: 1 is perfect prediction
# print('Coefficient of determination: %.2f'
#       % r2_score(diabetes_y_test, diabetes_y_pred))

# # Plot outputs
# plt.scatter(diabetes_X_test, diabetes_y_test,  color='black')
# plt.plot(diabetes_X_test, diabetes_y_pred, color='blue', linewidth=3)

# plt.xticks(())
# plt.yticks(())

# plt.show()