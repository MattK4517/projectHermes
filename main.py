from re import match
import analyze as anlz
import pymongo
from datetime import datetime
from constants import roles, patch
from data_pull_insert import run_pull
client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

if __name__ == "__main__":
    print(anlz.get_top_builds(client, "Achilles", "Solo", "8.10"))
    # run_pull(patch, "20211020")
    # run_format(patch, "20211019")


## 5 looops 2507 matches in 2:23:46
## 1 large loop