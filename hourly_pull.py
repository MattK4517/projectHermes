from re import match
import analyze as anlz
import pyrez
import pymongo
from pyrez.api import SmiteAPI
from datetime import datetime, timedelta
from constants import roles, patch, ranks
from data_pull_insert import run_pull_hourly
from data_pull_formatting_rewrite import run_format_hourly
from create_tier_list import gen_tier_list
from pytz import timezone
import os
import time

client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:EafI4Wb0QeFly01h@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

eastern = timezone('US/Eastern')

def get_date_format():
    time = datetime.now(eastern)
    yesterday = time - timedelta(days = 1)
    return f"{yesterday.month}/{yesterday.day}/{yesterday.year}"

def get_date_insert():
    time = datetime.now(eastern)
    yesterday = time - timedelta(days = 0)
    ret_string = f"{yesterday.year}{yesterday.month}{yesterday.day}"
    if yesterday.day < 10:
        ret_string = f"{yesterday.year}{yesterday.month}0{yesterday.day}"
    if yesterday.day < 10 and yesterday.month < 10:
        ret_string = f"{yesterday.year}0{yesterday.month}0{yesterday.day}"
    elif yesterday.month < 10:
        ret_string = f"{yesterday.year}0{yesterday.month}{yesterday.day}"
    return ret_string

if __name__ == "__main__":
    while True:
        t = datetime.now()
        curr_time = f"{t.hour-1}"
        date_insert = get_date_insert()
        starttime = datetime.now()
        with open("cred.txt", "r") as creds:
            lines = creds.readlines()
            smite_api = SmiteAPI(devId=lines[0].strip(), authKey=lines[1].strip(), responseFormat=pyrez.Format.JSON)

        print(smite_api.getDataUsed())
        patch = smite_api.getPatchInfo()["version_string"]
        run_pull_hourly(patch, curr_time, date_insert)
        time.sleep(3600)
    # anlz.calc_total_matches(client, ranks, "single_items", patch)
    # today = datetime.date.today()
    # weekday = today.weekday()
    # if weekday == 0:
    #     gen_tier_list(client, roles, patch, ["Combat", "Regular"], ranks)


## 5 looops 2507 matches in 2:23:46
## 1 large loop