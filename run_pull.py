import pyrez
from pyrez.api import SmiteAPI
from datetime import datetime, timedelta
from constants import patch, all_ranks
from data_pull_insert import run_pull
import analyze as anlz

# from data_pull_formatting_rewrite import run_format_hourly
from pytz import timezone
import os
import time
from main import client


def get_date_format():
    time = datetime.now()
    yesterday = time - timedelta(days=1)
    return f"{yesterday.month}/{yesterday.day}/{yesterday.year}"


def get_date_insert():
    time = datetime.now()
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
    modes = ["Conquest", "Joust", "Duel", "Arena", "Slash", "Assault"]
    queue_types = ["Ranked", "Casual"]
    input_types = ["KBM", "Controller"]

    t = datetime.now()
    print(t)
    curr_time = f"{t.hour-1}"
    if int(curr_time) == -1:
        curr_time = 0
    curr_time = -1
    date_insert = get_date_insert()
    starttime = datetime.now()
    with open("cred.txt", "r") as creds:
        lines = creds.readlines()
        smite_api = SmiteAPI(
            devId=lines[0].strip(),
            authKey=lines[1].strip(),
            responseFormat=pyrez.Format.JSON,
        )

    patch = smite_api.getItems()
    print(patch)