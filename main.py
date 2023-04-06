import pymongo
import os

# if not os.getenv("DB_URI"):
#     import dev_config

client = pymongo.MongoClient(os.getenv("DB_URI"))
