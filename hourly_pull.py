import pyrez
from pyrez.api import SmiteAPI
from datetime import datetime, timedelta
from constants import patch
from data_pull_insert import run_pull
# from data_pull_formatting_rewrite import run_format_hourly
from pytz import timezone
import os
import time
from main import client

eastern = timezone('US/Eastern')


def get_date_format():
    time = datetime.now(eastern)
    yesterday = time - timedelta(days=1)
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
    modes = ["Conquest", "Joust", "Duel"]
    queue_types = ["Ranked", "Casual"]
    input_types = ["KBM", "Controller"]

    t = datetime.now(eastern)
    curr_time = f"{t.hour-1}"
    if int(curr_time) == -1:
        curr_time = 0
    date_insert = get_date_insert()
    starttime = datetime.now()
    with open("cred.txt", "r") as creds:
        lines = creds.readlines()
        smite_api = SmiteAPI(devId=lines[0].strip(
        ), authKey=lines[1].strip(), responseFormat=pyrez.Format.JSON)

    patch = smite_api.getPatchInfo()["version_string"]
    for mode in modes:
        for queue_type in queue_types:
            for input_type in input_types:
                run_pull(patch, curr_time, queue_type,
                         mode, input_type, date_insert)
                print(
                    f"pull done: {patch}, {curr_time}, {queue_type},{mode}, {input_type}, {date_insert}")
