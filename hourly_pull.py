from re import match
import analyze as anlz
import pyrez
import pymongo
from pyrez.api import SmiteAPI
from datetime import datetime, timedelta
from constants import roles, patch, ranks
from data_pull_insert import run_pull_hourly
# from data_pull_formatting_rewrite import run_format_hourly
from pytz import timezone
import os
import time

client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:hce8zwL0tdCspUlD@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

eastern = timezone('US/Eastern')

def get_date_format():
    time = datetime.now(eastern)
    yesterday = time - timedelta(days = 1)
    return f"{yesterday.month}/{yesterday.day}/{yesterday.year}"

def get_date_insert():
    time = datetime.now(eastern)
    yesterday = time
    ret_string = f"{yesterday.year}{yesterday.month}{yesterday.day}"
    if yesterday.day < 10:
        ret_string = f"{yesterday.year}{yesterday.month}0{yesterday.day}"
    if yesterday.day < 10 and yesterday.month < 10:
        ret_string = f"{yesterday.year}0{yesterday.month}0{yesterday.day}"
    elif yesterday.month < 10:
        ret_string = f"{yesterday.year}0{yesterday.month}{yesterday.day}"
    return ret_string

if __name__ == "__main__":
    mydb = client["CasualMatches"]
    mycol = mydb["9.1 Matches"]
    t = datetime.now(eastern)
    print(f"time: {t}")
    print(f"Init Count {mycol.count_documents({})}")
    curr_time = f"{t.hour-1}"
    if int(curr_time) == -1:
        curr_time = 0
    date_insert = get_date_insert()
    starttime = datetime.now()
    with open("cred.txt", "r") as creds:
        lines = creds.readlines()
        smite_api = SmiteAPI(devId=lines[0].strip(), authKey=lines[1].strip(), responseFormat=pyrez.Format.JSON)

    print(smite_api.getDataUsed())
    print(curr_time, date_insert)
    patch = smite_api.getPatchInfo()["version_string"]
    run_pull_hourly(patch, curr_time, date_insert)
    print(f"Final Count {mycol.count_documents({})}")
    print("pull done")


## 5 looops 2507 matches in 2:23:46
## 1 large loop