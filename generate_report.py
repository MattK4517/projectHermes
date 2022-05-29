from numpy import Infinity
from main import client
import analyze as anlz
import df2gspread
import gspread
import pandas as pd


class Report():
    # FUTURE IDEAS
    # group god data by role if multiple roles
    def __init__(self):
        self.params = {}
        self.report_data = {}

    def set_params(self, params):
        for param in params:
            self.params[param] = params[param]
        print(self.params)

    def create_report(self):
        # god, items, attribute, enemy
        # role, patch, mode
        self.report_data = anlz.get_match_stats(
            client, self.params["god"], self.params["role"], self.params["patch"],
            self.params["attribute"], self.params["rank"], self.params["queue_type"],
            self.params["mode"])

    def upload_report(self):
        # attributes_in_rank|role|mode_for_SMITE_patch_patch
        # title = f"SMITE {self.params['patch'][0]} data"
        title = "SMITE 9.5 data"
        with open("projectAthena/filepath.txt", "r") as f:
            filepath = f.readline()
            gc = gspread.service_account(filename=filepath)
            sh = gc.open(title)
            # sh.del_worksheet("Sheet1")
            for mode in self.params["mode"]:
                # print("HERE", self.report_data[mode])
                if mode == "Conquest":
                    parsed_report = []
                    parsed_report = self.parse_report(
                        self.report_data[mode].values())
                    print(parsed_report)
                    for key in parsed_report:
                        print(key, len(parsed_report[key]))
                    report = pd.DataFrame(parsed_report)
                else:
                    report = pd.DataFrame(self.report_data[mode].values(), self.report_data[mode].keys(
                    ), self.report_data[mode][list(self.report_data[mode].keys())[0]].keys())

                worksheet = sh.add_worksheet(mode, rows=1000, cols=26)
                worksheet.update(
                    [report.columns.values.tolist()] + report.values.tolist())

            # need to share to see in google drive
            # sh.share("admin@smitestats.gg", perm_type='user', role='writer')

        pass

    def parse_report(self, data):
        parsed_report = {"Role": []}
        data = list(data)
        i = 1
        for god_data in data:
            for patch_data in god_data:
                for role in god_data[patch_data]:
                    parsed_report["Role"].append(role)
                    print(i)
                    for attribute in god_data[patch_data][role]:
                        if attribute not in parsed_report:
                            parsed_report[attribute] = [
                                god_data[patch_data][role][attribute]]
                        else:
                            parsed_report[attribute].append(
                                god_data[patch_data][role][attribute])
                    i += 1
        return parsed_report
    '''
    def set_params <- set param data from frontend
    def create_report <- create report with analzye funtion
    def upload_report <- parse report and upload to google sheet
    '''


# {
#     'god': ['Achilles'],
#     'items': [''],
#     'attribute': ['Damage Player'],
#     'enemy': [''],
#     'role': ['Solo'],
#     'patch': ['9.5'],
#     'mode': ['Conquest'],
#     'queue_type': ['Ranked'],
#     'rank': ['All Ranks']
# }

if __name__ == "__main__":
    print(anlz.get_gods())
