## Discord Bot testing
# bot.py
import discord
import sys
import analyze as anlz
# import pandas as pd
from main import client as dbClient
from constants import Assassins, Guardians, Hunters, Mages, Warriors, patch

def godAbbreviations(godName):
    godName = godName.lower()
    if godName == "amc" or godName == "ah muzen cab":
        godName = "Ah-Muzen-Cab"
    elif godName == "ap" or godName == "ah puch":
        godName = "Ah-Puch"
    elif godName == "ama":
        godName = "Amaterasu"
    elif godName == "goobis":
        godName = "Anubis"
    elif godName == "ao" or godName == "ak" or godName == "ao kuang":
        godName = "Ao-Kuang"
    elif godName == "aphro":
        godName = "Aphrodite"
    elif godName == "ara":
        godName = "Arachne"
    elif godName == "art":
        godName = "Artemis"
    elif godName == "baba" or godName == "baba yaga":
        godName = "Baba-Yaga"
    elif godName == "bacc":
        godName = "Bacchus"
    elif godName == "baka":
        godName = "Bakasura"
    elif godName == "baron" or godName == "baron samedi":
        godName = "Baron-Samedi"
    elif godName == "bast":
        godName = "Bastet"
    elif godName == "bell":
        godName = "Bellona"
    elif godName == "cab" or godName == "cabra":
        godName = "Cabrakan"
    elif godName == "cama":
        godName = "Camazotz"
    elif godName == "cerb":
        godName = "Cerberus"
    elif godName == "cern":
        godName = "Cernunnos"
    elif godName == "change" or godName == "chang'e":
        godName = "Chang-e"
    elif godName == "chary" or godName == "char":
        godName = "Charybdis"
    elif godName == "chern" or godName == "cherno":
        godName = "Chernobog"
    elif godName == "lulu":
        godName = "Cthulu"
    elif godName == "cu" or godName == "cu chu" or godName == "cu chulainn" or godName == "chu chu":
        godName = "Cu-Chulainn"
    elif godName == "daji" or godName == "da ji":
        godName = "Da-Ji"
    elif godName == "danza":
        godName = "Danzaburou"
    elif godName == "disco":
        godName = "Discordia"
    elif godName == "erlang" or godName == "erlang shen":
        godName = "Erlang-Shen"
    elif godName == "isis":
        godName = "Eset"
    elif godName == "faf":
        godName = "Fafnir"
    elif godName == "fen":
        godName = "Fenrir"
    elif godName == "ganesh":
        godName = "Ganesha"
    elif godName == "gil" or godName == "gilga":
        godName = "Gilgamesh"
    elif godName == "guan" or godName == "guan yu":
        godName = "Guan-Yu"
    elif godName == "hachi":
        godName = "Hachiman"
    elif godName == "hebo" or godName == "he bo":
        godName = "He-Bo"
    elif godName == "heim":
        godName = "Heimdallr"
    elif godName == "herc":
        godName = "Hercules"
    elif godName == "hou" or godName == "hou yi":
        godName = "Hou-Yi"
    elif godName == "hun" or godName == "batz" or godName == "hun batz":
        godName = "Hun-Batz"
    elif godName == "iza":
        godName = "Izanami"
    elif godName == "jing" or godName == "jing wei":
        godName = "Jing-Wei"
    elif godName == "jorm":
        godName = "Jormungandr"
    elif godName == "khep":
        godName = "Khepri"
    elif godName == "king" or godName == "arthur" or godName == "king arthur" or godName == "ka":
        godName = "King-Arthur"
    elif godName == "kuku":
        godName = "Kukulkan"
    elif godName == "kumbha" or godName == "kumba":
        godName = "Kumbhakarna"
    elif godName == "kuzen":
        godName = "Kuzenbo"
    elif godName == "dusa":
        godName = "Medusa"
    elif godName == "merc":
        godName = "Mercury"
    elif godName == "morgan le fay" or godName == "morgan" or godName == "morgan fay" or godName == "morg":
        godName = "Morgan-Le-Fay"
    elif godName == "nezha" or godName == "ne zha":
        godName = "Ne-Zha"
    elif godName == "nem":
        godName = "Nemesis"
    elif godName == "nuwa" or godName == "nu wa":
        godName = "Nu-Wa"
    elif godName == "olo":
        godName = "Olorun"
    elif godName == "osi":
        godName = "Osiris"
    elif godName == "pers" or godName == "perse":
        godName = "Persephone"
    elif godName == "pos" or godName == "pose":
        godName = "Poseidon"
    elif godName == "ram":
        godName = "Rama"
    elif godName == "rat":
        godName = "Ratatoskr"
    elif godName == "rav" or godName == "ravan":
        godName = "Ravana"
    elif godName == "serq":
        godName = "Serqet"
    elif godName == "swk" or godName == "wukong" or godName == "sun wukong":
        godName = "Sun-Wukong"
    elif godName == "susan" or godName == "sus":
        godName = "Susano"
    elif godName == "sylv"or godName == "tree":
        godName = "Sylvanus"
    elif godName == "thana" or godName == "than":
        godName = "Thanatos"
    elif godName == "morrigan" or godName == "morri" or godName == "the morrigan":
        godName = "The-Morrigan"
    elif godName == "tia":
        godName = "Tiamat"
    elif godName == "tsuku" or godName == "tsuki" or godName == "tsu":
        godName = "Tsukuyomi"
    elif godName == "vam" or godName == "vaman":
        godName = "Vamana"
    elif godName == "xbal":
        godName = "Xbalanque"
    elif godName == "xing" or godName == "xing tian" or godName == "XT":
        godName = "Xing-tian"
    elif godName == "yem":
        godName = "Yemoja"
    elif godName == "zhong" or godName == "zhong kui":
        godName = "Zhong-Kui"
    return godName.title()

def get_role(god):
    if god.lower() in (assassin.lower() for assassin in Assassins):
        role = "Jungle"
    elif god.lower() in (guardian.lower() for guardian in Guardians):
        role = "Support"
    elif god.lower() in (hunter.lower() for hunter in Hunters):
        role = "Carry"
    elif god.lower() in (mage.lower() for mage in Mages):
        role = "Mid"
    elif god.lower() in (warrior.lower() for warrior in Warriors):
        role = "Solo"
    else:
        print(f"ERROR WITH: {god}")
    return role
if __name__ == "__main__":
    token = open("token.txt", "r").read()  # I've opted to just save my token to a text file. 

    client = discord.Client()  # starts the discord client.
    mongo_client = dbClient
    @client.event  # event decorator/wrapper. More on decorators here: https://pythonprogramming.net/decorators-intermediate-python-tutorial/
    async def on_ready():  # method expected by client. This runs once when connected
        print(f'We have logged in as {client.user}')  # notification of login.
        print(client.guilds)

    @client.event
    async def on_message(message):  # event that happens per any message.
        if message.author == client.user: 
            return
        # each message has a bunch of attributes. Here are a few.
        # check out more by print(dir(message)) for example.
        print(f"{message.guild}: {message.channel}: {message.author}: {message.author.name}: {message.content}")

        if message.content.lower().startswith("$build"):
            m = message.content.split(" ")
            if len(m) < 2:
                await message.channel.send("Must use $god [role] (optional) format")
            else:
                if len(m) == 2:
                    actgod = m[1]
                    actgod = godAbbreviations(actgod.strip()).replace("-"," ")   
                    role = get_role(actgod)
                else:
                    actgod = ""
                    god = m[1:len(m)-1]
                    role = m[-1]
                    if role.lower() not in ["solo", "jungle", "mid", "support", "carry"]:
                        god.append(role)
                        god = " ".join(god)
                        actgod = godAbbreviations(god.title()).replace("-", " ")
                        role = get_role(god)
                    else:
                        god = " ".join(god)
                        actgod = godAbbreviations(god.title()).replace("-", " ")

                data = anlz.get_top_builds(dbClient, actgod, role.capitalize(), patch)
                ItemWR = []
                iconURL = anlz.get_url(actgod)
                if actgod.lower() in (assassin.lower() for assassin in Assassins):
                    color = "fce703"
                elif actgod.lower() in (guardian.lower() for guardian in Guardians):
                    color = "067527"
                elif actgod.lower() in (hunter.lower() for hunter in Hunters):
                    color = "754306"
                elif actgod.lower() in (mage.lower() for mage in Mages):
                    color = "9a1af0"
                elif actgod.lower() in (warrior.lower() for warrior in Warriors):
                    color = "fc0303"
                embed=discord.Embed(title=f"{actgod} {role} Build".title(), description="Games: {} | Wins: {} | WR: {} \n [See more info here](https://www.smitestats.gg/#/{})".format(data["games"], data["wins"], data["winRate"], actgod.replace(" ", "_")), color = int(color, base=16))
                embed.set_thumbnail(url=iconURL)
                for i, slot in enumerate(data):
                    if "slot" in slot:
                        item1 = data[slot]["item1"]["item"]
                        item2 = data[slot]["item2"]["item"]
                        item1WR = round(data[slot]["item1"]["wins"]/data[slot]["item1"]["games"]*100 , 2)
                        item2WR = round(data[slot]["item2"]["wins"]/data[slot]["item2"]["games"]*100, 2)
                        embed.add_field(name=f"Slot {i+1}", value=f"{item1} WR: {item1WR}%\n {item2} WR: {item2WR}%", inline=True)
                    
                await message.channel.send(embed=embed)
        
        if message.content.lower().startswith("$matchups"):
            m = message.content.split(" ")
            if len(m) < 2:
                await message.channel.send("Must use $god [role] (optional) format")
            else:
                if len(m) == 2:
                    actgod = m[1]
                    actgod = godAbbreviations(actgod.strip()).replace("-"," ")   
                    role = get_role(actgod)
                else:
                    actgod = ""
                    god = m[1:len(m)-1]
                    role = m[-1]
                    if role.lower() not in ["solo", "jungle", "mid", "support", "carry"]:
                        god.append(role)
                        god = " ".join(god)
                        actgod = godAbbreviations(god.title()).replace("-", " ")
                        role = get_role(god)
                    else:
                        god = " ".join(god)
                        actgod = godAbbreviations(god.title()).replace("-", " ")

                data = anlz.get_worst_matchups(mongo_client, actgod, role.capitalize(), patch)
                iconURL = anlz.get_url(actgod)
                if actgod.lower() in (assassin.lower() for assassin in Assassins):
                    color = "fce703"
                elif actgod.lower() in (guardian.lower() for guardian in Guardians):
                    color = "067527"
                elif actgod.lower() in (hunter.lower() for hunter in Hunters):
                    color = "754306"
                elif actgod.lower() in (mage.lower() for mage in Mages):
                    color = "9a1af0"
                elif actgod.lower() in (warrior.lower() for warrior in Warriors):
                    color = "fc0303"
                embed=discord.Embed(title=actgod+" "+role+" Worst Matchups".title(), description="Games: {} | Wins: {} | WR: {} \n [See more info here](https://www.smitestats.gg/#/{})".format(data["games"], data["wins"], data["winRate"], actgod.replace(" ", "_")), color = int(color, base=16))
                embed.set_thumbnail(url=iconURL)
                for i, matchup in enumerate(data):
                    if matchup not in ["games", "wins", "winRate"] and i < 4:
                        embed.add_field(name=matchup, value="Games Played: "+str(data[matchup]["timesPlayed"])+"\nWR: "+str(data[matchup]["winRate"])+"%", inline=True)
                await message.channel.send(embed=embed)

        if message.content.lower().startswith("$goodmatchups"):
            m = message.content.split(" ")
            if len(m) < 2:
                await message.channel.send("Must use $god [role] (optional) format")
            else:
                if len(m) == 2:
                    actgod = m[1]
                    actgod = godAbbreviations(actgod.strip()).replace("-"," ")   
                    role = get_role(actgod)
                else:
                    actgod = ""
                    god = m[1:len(m)-1]
                    role = m[-1]
                    if role.lower() not in ["solo", "jungle", "mid", "support", "carry"]:
                        god.append(role)
                        god = " ".join(god)
                        actgod = godAbbreviations(god.title()).replace("-", " ")
                        role = get_role(god)
                    else:
                        god = " ".join(god)
                        actgod = godAbbreviations(god.title()).replace("-", " ")
                
                data = anlz.get_worst_matchups(mongo_client, actgod, role.capitalize(), patch)
                iconURL = anlz.get_url(actgod)
                if actgod.lower() in (assassin.lower() for assassin in Assassins):
                    color = "fce703"
                elif actgod.lower() in (guardian.lower() for guardian in Guardians):
                    color = "067527"
                elif actgod.lower() in (hunter.lower() for hunter in Hunters):
                    color = "754306"
                elif actgod.lower() in (mage.lower() for mage in Mages):
                    color = "9a1af0"
                elif actgod.lower() in (warrior.lower() for warrior in Warriors):
                    color = "fc0303"
                embed=discord.Embed(title=f"{actgod} {role} Best Matchups".title(), description="Games: {} | Wins: {} | WR: {} \n [See more info here](https://www.smitestats.gg/#/{})".format(data["games"], data["wins"], data["winRate"], actgod.replace(" ", "_")), color = int(color, base=16))
                embed.set_thumbnail(url=iconURL)
                for i, matchup in enumerate(data):
                    if matchup not in ["games", "wins", "winRate"] and i > (len(data)-9):
                        embed.add_field(name=matchup, value="Games Played: "+str(data[matchup]["timesPlayed"])+"\nWR: "+str(data[matchup]["winRate"])+"%", inline=True)
                await message.channel.send(embed=embed)                
        
        if message.content.lower().startswith("$paths"):
            m = message.content.split(" ")
            if len(m) < 2:
                await message.channel.send("Must use $god [role] (optional) format")
            else:
                if len(m) == 2:
                    actgod = m[1]
                    actgod = godAbbreviations(actgod.strip()).replace("-"," ")   
                    role = get_role(actgod)
                else:
                    actgod = ""
                    god = m[1:len(m)-1]
                    role = m[-1]
                    if role.lower() not in ["solo", "jungle", "mid", "support", "carry"]:
                        god.append(role)
                        god = " ".join(god)
                        actgod = godAbbreviations(god.title()).replace("-", " ")
                        role = get_role(god)
                    else:
                        god = " ".join(god)
                        actgod = godAbbreviations(god.title()).replace("-", " ")

                data = anlz.get_build_path(dbClient, actgod, role.capitalize(), patch)
                iconURL = anlz.get_url(actgod)
                if actgod.lower() in (assassin.lower() for assassin in Assassins):
                    color = "fce703"
                elif actgod.lower() in (guardian.lower() for guardian in Guardians):
                    color = "067527"
                elif actgod.lower() in (hunter.lower() for hunter in Hunters):
                    color = "754306"
                elif actgod.lower() in (mage.lower() for mage in Mages):
                    color = "9a1af0"
                elif actgod.lower() in (warrior.lower() for warrior in Warriors):
                    color = "fc0303"
                embed=discord.Embed(title=f"{actgod} {role} Build Paths".title(), description="[See more info here](https://www.smitestats.gg/#/{})".format(actgod.replace(" ", "_")), color = int(color, base=16))
                embed.set_thumbnail(url=iconURL)
                for i, path in enumerate(data):
                    # print(data)
                    if i < 2:
                        games = data[path]["wins"]+data[path]["losses"]
                        embed.add_field(name=f"Path {i+1}", value="{}\nGames: {} Win Rate: {}".format(path.replace(",", ", "), games, round(data[path]["wins"]/games * 100,2)), inline=True)
                await message.channel.send(embed=embed)
                

    client.run(token)
