import json
import csv
import pandas as pd

def make_player_list():
    with open('allMaps-big.json') as json_file:
        data = json.load(json_file)
        
        players_list = []

        for cs_map in data:
            for player in cs_map['team1']:
                if player['name'] not in players_list:
                    players_list.append(player['name'])
            for player in cs_map['team2']:
                if player['name'] not in players_list:
                    players_list.append(player['name'])

        return  players_list

players_list = make_player_list()
numPlayers = len(players_list)

raw_dataset = pd.read_json("allMaps-big.json")
processed_data = []
for index, game in raw_dataset.iterrows():
    roster_team1 = [0] * numPlayers
    roster_team2 = [0] * numPlayers
    rating_team1 = [0] * numPlayers
    rating_team2 = [0] * numPlayers

    # populate the team 1 roster and performance vectors
    for player in game.team1:
        player_index = players_list.index(player['name'])
        roster_team1[player_index] = 1
        rating_team1[player_index] = float(player['rating'])
    # populate the team 2 roster and performance vectors
    for player in game.team2:
        player_index = players_list.index(player['name'])
        roster_team2[player_index] = 1
        rating_team2[player_index] = float(player['rating'])
    row = [roster_team1, roster_team2, rating_team1, rating_team2]
    processed_data.append(row)

df = pd.DataFrame(processed_data, columns=['team1roster', 'team2roster',
                                           'team1rating', 'team2rating'])
df.to_csv(r'big.csv')
print(df)
# print(raw_dataset.team1[0][0]['name'])
