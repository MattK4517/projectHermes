import pymongo
import os

client = pymongo.MongoClient(os.environ["DB_URI"])
