import pymongo
import os
import dev_config

client = pymongo.MongoClient(os.environ["DB_URI"])
