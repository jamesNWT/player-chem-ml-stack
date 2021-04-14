# player-chem-ml-stack

This was a school projcet for my machine learning class. 

The idea was to try to model the Chemistry between teammates in professional CSGO.

The code is a bit of a mess and unorganized but for a personal project it did the job.

This project contains code that pulled data from eight thousand games from HLTV.org, and trained a neural network to try to be able to predict player performance based soley on the identities of the players in the game. In this way I hoped the model could model the "chemistry" between teammates in professional CSGO.

## Some results of the model (taken from the .pdf report)

# Finding the best teammates:
![best teammates](https://github.com/jamesNWT/player-chem-ml-stack/blob/master/duos.png?raw=true)

A convenient feature of the model is that it can serve predictions on incomplete teams. I used this feature to predict the ratings of pairs of players, leaving the rest of the team and the other team empty. I created a list of every player that played over 300 games in the dataset. For each of these players I listed all of their teammates they played over 150 games with and predicted the rating of them with each of these players. I chose this high threshold of games because some players act as stand-ins for only a short period of time, and if for that time the team plays easier games it will show that player as providing great chemistry to his team. 

Figure 9 contains the top 20 results of this process. The player column contains the player that had his rating improved, and the helper column is the teammate which improved the rating. The rating diff is the rating the player got in the pair, minus the average rating the player got with all his teammates. The top pair, MSL and Kjaerbye, played together for a stint in 2018 on a team called North. They won several tournaments, but the team quickly fell to middling results when MSL left. A player that appears in the helper column a lot is Xyp9x (pronounced Zipix). He is a player on Astralis and he took a hiatus from the game in 2018. Without him Astralis fell from absolutely dominating the game to “just pretty good”. We can see the model has captured how much better all his teammates do when he is with them. Based on these results it seems like the model is capable of modeling some chemistry between players

# Finding the best teams:

![best teams](https://github.com/jamesNWT/player-chem-ml-stack/blob/master/teams.png?raw=true)
Similar to what I did in section 5.1, I also got a list of every lineup that appeared in the dataset, that played more than 30 games together. I then predicted the rating for every lineup against an empty team and kept track of the aggregate rating. I put the lineup and aggregate rating into a pandas dataframe and sorted it. 

Figure 10 shows the top 15 lineups from this dataframe. These teams do correspond to the most dominant teams from the time period of my dataset. The top two teams are both Astralis, with the second one containing es3tag, their substitute/map-specialist player. An interesting result is how many changes the Team Liquid (the lineups containing NAF and EliGE) has gone through while still being a top team. To me this shows that NAF and EliGE form the true “core” of team liquid and are probably the most important pieces to the teams success, which they had a lot of in 2019 when they dethroned Australis to briefly become the best team in the world. 
