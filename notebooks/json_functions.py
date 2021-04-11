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

def get_teammates(player, file_to_use):
    with open(file_to_use, encoding="utf-8") as json_file:
        data = json.load(json_file)

        all_teammates = []
        for cs_map in data:
            if player in [tm['name'] for tm in cs_map['team1']]:
                for teammate in [tm['name'] for tm in cs_map['team1']]:
                    if teammate not in all_teammates:
                        all_teammates.append(teammate)

            elif player in [tm['name'] for tm in cs_map['team2']]:
                for teammate in [tm['name'] for tm in cs_map['team2']]:
                    if teammate not in all_teammates:
                        all_teammates.append(teammate)
        
        all_teammates.remove(player)
        # # remove the player in question from list of temmates he appeared with
        # while(player in teammates):
        #     all_teammates.remove(player)
        return all_teammates
            
            

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

def create_df_fixed(file_to_use, mirror=True):
    import numpy as np
    raw_dataset = pd.read_json(file_to_use)
    processed_data = []

    players_list = make_player_list(file_to_use)
    numPlayers = len(players_list)

    for index, game in raw_dataset.iterrows():

        if len(game.team1) > 5 or len(game.team2) > 5:
            continue
        roster_team1 = [0] * numPlayers
        roster_team2 = [0] * numPlayers
        rating_vector = [[0, 0.]] * 10
        rating_vector = np.array(rating_vector)

        # populate the team 1 roster and performance vectors
        for i, player in enumerate(game.team1):
            player_index = players_list.index(player['name'])
            roster_team1[player_index] = 1
            rating_vector[i][0] = player_index
            rating_vector[i][1] = round(float(player['rating']), 3)
        # populate the team 2 roster and performance vectors
        for i, player in enumerate(game.team2):
            player_index = players_list.index(player['name'])
            roster_team2[player_index] = 1
            rating_vector[i+5][0] = player_index
            rating_vector[i+5][1] = round(float(player['rating']), 3)
        
        # sort ratings acording to corresponding player index
        rating_vector = rating_vector[rating_vector[:,0].argsort()]

        # put it all together in row, keep only ratings part of rating vector
        row = [roster_team1+roster_team2, rating_vector[:,1].tolist()]
        processed_data.append(row)

        if mirror:
            # now flip the teams around and add that to the training data
            temp = rating_vector[:,1].tolist()
            rating_vector_mirrored = temp[5:10] + temp[0:5]
            
            row_mirrored = [roster_team2+roster_team1, rating_vector_mirrored]
            processed_data.append(row_mirrored)

    return players_list, pd.DataFrame(processed_data, columns=['rosters vector',
                                                               'rating vector'])

def create_df_big_output(file_to_use, mirror=True):
    raw_dataset = pd.read_json(file_to_use)
    processed_data = []

    players_list = make_player_list(file_to_use)
    numPlayers = len(players_list)

    for index, game in raw_dataset.iterrows():

        if len(game.team1) > 5 or len(game.team2) > 5:
            continue
        roster_team1 = [0] * numPlayers
        roster_team2 = [0] * numPlayers
        rating_vector = [0]*2*numPlayers

        # populate the team 1 roster and performance vectors
        for i, player in enumerate(game.team1):
            player_index = players_list.index(player['name'])
            roster_team1[player_index] = 1
            rating_vector[player_index] = round(float(player['rating']), 3)
        # populate the team 2 roster and performance vectors
        for i, player in enumerate(game.team2):
            player_index = players_list.index(player['name'])
            roster_team2[player_index] = 1
            rating_vector[player_index + numPlayers] = round(
                                                        float(player['rating']),
                                                        3
                                                    )
        row = [roster_team1+roster_team2, rating_vector]
        processed_data.append(row)
    
        if mirror:
            # now flip the teams around and add that to the training data
            rating_vector_mirrored = (
                rating_vector[numPlayers:2*numPlayers] 
                + rating_vector[0:numPlayers]
            )
            
            row_mirrored = [roster_team2+roster_team1, rating_vector_mirrored]
            processed_data.append(row_mirrored)

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

if __name__ == '__main__':
    teammates= get_teammates('s1mple', 'data/very-big.json')
    print('done')
