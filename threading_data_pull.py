from threading import Thread
import pyrez
from datetime import datetime
from pyrez.api import SmiteAPI
import pymongo
import random
import time
import analyze as anlz
from pyrez.models import Smite
from pyrez.models.MatchHistory import MatchHistory
from data_pull_formatting_rewrite import format_no_query, threadedd_format_no_query
from data_pull_insert import create_sets, threaded_pull
import os
from sys import getsizeof
# from data_pull_formatting_rewrite import format_no_query
from __init__ import client



def init_api(patch, date):
    with open("cred.txt", "r") as f:
        data = f.readlines()
        smite_api = SmiteAPI(devId=data[0].strip(), authKey=data[1].strip(), responseFormat=pyrez.Format.JSON)
    date = date
    match_ids = smite_api.getMatchIds(426, date=date, hour=-1)
    threaded_process_range(4, create_sets(match_ids), patch)
    print(len(create_sets(match_ids)))

def threaded_process_range(nthreads, id_range, patch):
    threads = []
    # create the threads
    for i in range(nthreads):
        ids = id_range[i::nthreads]
        # print(ids)
        print(len(ids))
        t = Thread(target=threaded_pull, args=(patch, ids))
        threads.append(t)

    # start the threads
    [ t.start() for t in threads ]
    # wait for the threads to finish
    [ t.join() for t in threads ]

def threaded_process_format(nthreads):
    threads = []
    # create the threads
    mydb = client["CasualMatches"]
    mycol = mydb["9.1 Matches"]
    matches = []
    print(mycol.count_documents({"Entry_Datetime": "1/30/2022"}))
    for x in mycol.find({"Entry_Datetime": "1/30/2022"}, {"_id": 0}):
        matches.append(x)
        if len(matches) % 10000 == 0:
            print("10k done")
    
    for i in range(nthreads):
        match_data = matches[i::nthreads]
        # print(ids)
        print(len(match_data))
        t = Thread(target=threadedd_format_no_query, args=([match_data]))
        threads.append(t)

    # start the threads
    [ t.start() for t in threads ]
    # wait for the threads to finish
    [ t.join() for t in threads ]

starttime = datetime.now()
init_api("9.1", "20220201")
# threaded_process_format(5)
print(f"ENDED IN {datetime.now() - starttime}")
