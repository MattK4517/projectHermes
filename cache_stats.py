from datetime import datetime

import analyze as anlz
from constants.constants import godsDict, patch
from data_pull_formatting_rewrite import GodData
from main import client


class Cache:
    def __init__(self, database, queue_type, mode):
        self.database = client[database]
        self.queue_type = queue_type
        self.mode = mode

    def clear_cache(self):
        for god in godsDict:
            mycol = self.database[god]
            mycol.delete_many({})

    def create_cache(self):
        for god in godsDict:
            data = []
            mycol = self.database[god]
            mycol.delete_many({})
            data.append(
                {
                    **anlz.get_top_builds(
                        client,
                        god,
                        godsDict[god],
                        patch,
                        self.queue_type,
                        mode=self.mode,
                    ),
                    "cache_type": "build",
                    "queue_type": self.queue_type,
                    "mode": self.mode,
                }
            )
            data.append(
                {
                    **anlz.get_worst_matchups(
                        client,
                        god,
                        godsDict[god],
                        patch,
                        self.queue_type,
                        mode=self.mode,
                    ),
                    "cache_type": "matchup",
                    "queue_type": self.queue_type,
                    "mode": self.mode,
                }
            )
            mycol.insert_many(data)


if __name__ == "__main__":
    # cache = Cache("CacheStats", "queue_type", "Conquest")
    # cache.clear_cache()
    starttime = datetime.now()
    for queue_type in ["Ranked", "Casual"]:
        cache = Cache("CacheStats", queue_type, "Conquest")
        cache.create_cache()
    print(datetime.now() - starttime)
