'use strict';

const { HLTV } = require('hltv');
const args = require('yargs').argv;

var mapsFilter = {
    startDate: args.start_date, 
    endDate: args.end_date, 
    rankingFilter: args.rank_filter
};

main(mapsFilter);

async function main(mapsFilter) {
    
    var mapIds = await getMapIds(mapsFilter);

    await getPlayerStatsOverMaps(mapIds);

    async function getMapIds(mapsFilter) {
        var mapsOverview = await HLTV.getMatchesStats(mapsFilter);

        var mapIds = [];
        mapsOverview.forEach(element => {
            mapIds.push(element.id);
        });

        return mapIds
    }

    async function getPlayerStatsOverMaps(mapIds) {
        mapIds.forEach(async mapId => {

            // wait a second so I dont get banned by cloudflare (hopefully)
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            var match = await HLTV.getMatchMapStats({id: mapId});
            
            var team1Players = [];
            var team2Players = [];
            
            match.playerStats.team1.forEach(element =>{
                team1Players.push(
                    new MapPlayer(element.id, element.rating)
                )
            });
            match.playerStats.team2.forEach(player =>{
                team2Players.push(
                    new MapPlayer(player.id, player.rating)
                )
            });
            
            console.log(team1Players)
        });
    }
}

class MapPlayer {
    constructor(id, rating) {
        this.id = id;
        this.rating = rating;
    }
}