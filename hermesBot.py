## Discord Bot testing
# bot.py
#ID 845256099711680542
import discord
import sys
import analyze as anlz
# import pandas as pd
from main import client as dbClient
from constants import Assassins, Guardians, Hunters, Mages, Warriors, patch


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
            if len(m) < 3:
                await message.channel.send("Must use $god role format")
            else:
                actgod = ""
                god = m[1:len(m)-1]
                role = m[-1]
                for x in range(len(god)):
                    actgod += god[x]+" "
                actgod = actgod.strip()
                data = anlz.get_top_builds(dbClient, actgod, role, patch)
                ItemWR = []
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
                embed=discord.Embed(title=f"{actgod} {role} Build", description="Games: {} | Wins: {} | WR: {} \n [See more info here](https://www.smitestats.gg/#/{})".format(data["games"], data["wins"], data["winRate"], actgod.replace(" ", "_")), color = int(color, base=16))
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
            if len(m) < 3:
                await message.channel.send("Must use $god role format")
            else:
                actgod = ""
                god = m[1:len(m)-1]
                role = m[-1]
                for x in range(len(god)):
                    actgod += god[x]+" "
                actgod = actgod.strip()
                data = anlz.get_worst_matchups(mongo_client, actgod, role, patch)
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
                embed=discord.Embed(title=actgod+" "+role+" Worst Matchups", description="Games: {} | Wins: {} | WR: {} \n [See more info here](https://www.smitestats.gg/#/{})".format(data["games"], data["wins"], data["winRate"], actgod.replace(" ", "_")), color = int(color, base=16))
                embed.set_thumbnail(url=iconURL)
                for i, matchup in enumerate(data):
                    if matchup not in ["games", "wins", "winRate"] and i < 4:
                        embed.add_field(name=matchup, value="Games Played: "+str(data[matchup]["timesPlayed"])+"\nWR: "+str(data[matchup]["winRate"])+"%", inline=True)
                await message.channel.send(embed=embed)
        
        if message.content.lower().startswith("$paths"):
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
                data = anlz.get_build_path(dbClient, actgod, role, patch)
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
                embed=discord.Embed(title=actgod+" "+role+" Build Paths", description="[See more info here](https://www.smitestats.gg/#/{})".format(actgod.replace(" ", "_")), color = int(color, base=16))
                embed.set_thumbnail(url=iconURL)
                for i, path in enumerate(data):
                    if i < 2:
                        games = data[path]["wins"]+data[path]["losses"]
                        embed.add_field(name=f"Path {i+1}", value="{}\nGames: {} Win Rate: {}".format(path.replace(",", ", "), games, round(data[path]["wins"]/games * 100,2)), inline=True)
                await message.channel.send(embed=embed)
                

    client.run(token)
