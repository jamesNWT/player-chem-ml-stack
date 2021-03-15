import json
import csv

with open('allMaps.json') as json_file:
    data = json.load(json_file)

players_list = []

for cs_map in data:
    for player in cs_map['team1']:
        if player['name'] not in players_list:
            players_list.append(player['name'])
    for player in cs_map['team2']:
        if player['name'] not in players_list:
            players_list.append(player['name'])

print(players_list)
