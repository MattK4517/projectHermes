from re import match
import analyze as anlz
import pymongo
from datetime import datetime
from constants import roles
client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:vJGCNFK6QryplwYs@cluster0.7s0ic.mongodb.net/Cluster0?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs="CERT_NONE")

if __name__ == "__main__":
    # print(anlz.get_top_builds(client, "Achilles", "Solo"))
    match_roles = roles.copy()
    for role in roles:
        match_roles.append(role)
    print(match_roles)