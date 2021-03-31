import json
import csv
import pandas as pd

file_to_use = "test.json"

def make_player_list(file_to_use):
    with open(file_to_use, encoding="utf-8") as json_file:
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

def create_df_simple(file_to_use):
    raw_dataset = pd.read_json(file_to_use)
    processed_data = []

    players_list = make_player_list(file_to_use)
    numPlayers = len(players_list)

    for index, game in raw_dataset.iterrows():

        if len(game.team1) > 5 or len(game.team2) > 5:
            continue
        roster_team1 = [0] * numPlayers
        roster_team2 = [0] * numPlayers
        rating_vector = [0]*10

        # populate the team 1 roster and performance vectors
        for i, player in enumerate(game.team1):
            player_index = players_list.index(player['name'])
            roster_team1[player_index] = 1
            rating_vector[i] = round(float(player['rating']), 3)
        # populate the team 2 roster and performance vectors
        for i, player in enumerate(game.team2):
            player_index = players_list.index(player['name'])
            roster_team2[player_index] = 1
            rating_vector[i+5] = round(float(player['rating']), 3)
        row = [roster_team1+roster_team2, rating_vector]
        processed_data.append(row)

    return players_list, pd.DataFrame(processed_data, columns=['rosters vector',
                                                               'rating vector'])

def create_example(team1, team2, players_list):
    rosters_vector = [0] * len(players_list) * 2
    for player in team1:
        i = players_list.index(player)
        rosters_vector[i] = 1
    for player in team2:
        i = players_list.index(player)
        rosters_vector[i+len(players_list)] = 1
    return rosters_vector

# if __name__ == '__main__':
#     players_list, df = create_df_simple('very-big.json')
#     print(sorted(players_list))
#     team1 = ['shox', 'ZywOo', 'NAF', 's1mple', 'FalleN']
#     team2 = ['autimatic', 'blameF', 'Brehze', 'broky', 'Bubzkji']
#     players_list = make_player_list('very_big.json')
#     vec = create_example(team1, team2, players_list)
#     print('done')