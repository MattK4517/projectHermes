import pymongo
import os

# if not os.getenv("DB_URI"):
#     import dev_config

client = pymongo.MongoClient(
    "mongodb+srv://sysAdmin:8MS78W5khKLvpPmu@dev.t8xlvge.mongodb.net/?retryWrites=true&w=majority")
