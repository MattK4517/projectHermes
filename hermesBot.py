## Discord Bot testing
# bot.py
#ID 845256099711680542
import discord
import sys
import analyze as anlz
import pandas as pd
from main import client as dbClient


Assassins = ["Arachne", "Awilix", "Bakasura", "Bastet", "Camazotz", "Da Ji", "Fenrir", "Hun Batz", "Kali", "Loki", "Mercury", "Ne Zha", "Nemesis", "Pele", "Ratatoskr", "Ravana", "Serqet", "Set", "Susano", "Thanatos", "Thor"]
Guardians = ["Ares", "Artio", "Athena", "Bacchus", "Cabrakan", "Cerberus",  "Fafnir", "Ganesha", "Geb", "Jormungandr", "Khepri", "Kumbhakarna", "Kuzenbo", "Sobek", "Sylvanus", "Terra", "Xing Tian", "Yemoja", "Ymir"]
Hunters = ["Ah Muzen Cab", "Anhur", "Apollo", "Artemis", "Cernunnos", "Chernobog", "Chiron", "Cupid", "Hachiman", "Heimdallr", "Hou Yi", " Izanami", "Jing Wei", "Medusa", "Neith", "Rama", "Skadi", "Ullr", "Xbalanque"]
Mages = ["Agni", "Ah Puch", "Anubis", "Ao Kuang", "Aphrodite", "Baba Yaga", "Baron Samedi", "Chang\'e", "Chronos", "Discordia", "Eset", "Freya", "Hades", "He Bo", "Hel", "Hera", "Janus", "Kukulkan", "Merlin", "Nox",
"Nu Wa", "Olorun", "Persephone", "Poseidon", "Ra", "Raijin", "Scylla", "Sol", "The Morrigan", "Thoth", "Tiamat", "Vulcan", "Zeus", "Zhong Kui"]
Warriors = ["Amaterasu", "Achilles", "Bellona", "Chaac", "Cu Chulainn", "Erlang Shen", "Guan Yu", "Herculues", "Horus", "King Arthur", "Mulan", "Nike", "Odin", "Osiris", "Sun Wukong", "Tyr", "Vamana"]

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

        if message.content.startswith("$build"):
            m = message.content.split(" ")
            if len(m) < 3:
                await message.channel.send("Must use $god role format")
            else:
                actgod = ""
                god = m[1:len(m)-1]
                role = m[-1]
                for x in range(len(god)):
                    actgod += god[x]+" "
                actgod = actgod.strip()

                data = anlz.get_top_builds(mongo_client, actgod, role, req="discord")
                build = data[0]
                print(build)
                games = data[1][0]
                wins = data[1][1]
                wr = data[1][2]
                ItemWR = []
                iconURL = anlz.get_url(actgod)
                for slot in build:
                    if build[slot]["games"] != 0:
                        ItemWR.append(round(build[slot]["wins"]/build[slot]["games"] * 100, 2))
                    else:
                        ItemWR.append(0)
                    if build[slot]["games2"] != 0:
                        ItemWR.append(round(build[slot]["wins2"]/build[slot]["games2"] * 100, 2))
                    else:
                        ItemWR.append(0)
                    
                if actgod in Assassins:
                     color = "fce703"
                elif actgod in Guardians:
                    color = "067527"
                elif actgod in Hunters:
                    color = "754306"
                elif actgod in Mages:
                    color = "9a1af0"
                elif actgod in Warriors:
                    color = "fc0303"
                embed=discord.Embed(title=actgod+" "+role+" Build", description="Games: {} | Wins: {} | WR: {}".format(games, wins, wr), color = int(color, base=16))
                embed.set_thumbnail(url=iconURL["url"])
                embed.add_field(name="Slot 1", value=build["slot1"]["item"]+" WR: "+str( ItemWR[0] )+"%\n"+build["slot1"]["item2"]+" WR: "+str( ItemWR[1] )+"%", inline=True)
                embed.add_field(name="Slot 2", value=build["slot2"]["item"]+" WR: "+str( ItemWR[2] )+"%\n"+build["slot2"]["item2"]+" WR: "+str( ItemWR[3] )+"%", inline=True)
                embed.add_field(name="Slot 3", value=build["slot3"]["item"]+" WR: "+str( ItemWR[4] )+"%\n"+build["slot3"]["item2"]+" WR: "+str( ItemWR[5] )+"%", inline=True)
                embed.add_field(name="Slot 4", value=build["slot4"]["item"]+" WR: "+str( ItemWR[6] )+"%\n"+build["slot4"]["item2"]+" WR: "+str( ItemWR[7] )+"%", inline=True)
                embed.add_field(name="Slot 5", value=build["slot5"]["item"]+" WR: "+str( ItemWR[8] )+"%\n"+build["slot5"]["item2"]+" WR: "+str( ItemWR[9] )+"%", inline=True)
                embed.add_field(name="Slot 6", value=build["slot6"]["item"]+" WR: "+str( ItemWR[10] )+"%\n"+build["slot6"]["item2"]+" WR: "+str( ItemWR[11] )+"%", inline=True)
                await message.channel.send(embed=embed)
        
        if message.content.startswith("$matchups"):
            m = message.content.split(" ")
            if len(m) < 3:
                await message.channel.send("Must use $god role format")
            else:
                actgod = ""
                god = m[1:len(m)-1]
                role = m[-1]
                for x in range(len(god)):
                    actgod += god[x]+" "
                actgod = actgod.strip()
                print(actgod)
                data = anlz.get_worst_matchups(mongo_client, actgod, role, req="discord")
                matchups = data[0]
                games = data[1][0]
                wins = data[1][1]
                wr = data[1][2]
                iconURL = anlz.get_url(actgod)
                

                if actgod in Assassins:
                    color = "fce703"
                elif actgod in Guardians:
                    color = "067527"
                elif actgod in Hunters:
                    color = "754306"
                elif actgod in Mages:
                    color = "9a1af0"
                elif actgod in Warriors:
                    color = "fc0303"

                embed=discord.Embed(title=actgod+" "+role+" Matchups", description="Games: {} | Wins: {} | WR: {}".format(games, wins, wr), color = int(color, base=16))
                embed.set_thumbnail(url=iconURL["url"])
                for matchup in matchups:
                    embed.add_field(name=matchup, value="Games Played: "+str(matchups[matchup]["timesPlayed"])+" | WR: "+str(matchups[matchup]["winRate"])+"%", inline=True)
                await message.channel.send(embed=embed)

    client.run(token)
