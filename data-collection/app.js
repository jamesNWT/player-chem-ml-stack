
// test command: node ./data-collection/app.js --start_date 2021-02-21 --end_date 2021-02-23 --rank_filter Top10

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
        const waitTime = 5; 
        var n = 0;
        
        for (const mapId of mapIds) {
            n++;

            var match = await recursiveGetMatchMapStats(mapId);
             
            console.log("Recieved match " + n);
            console.log(match.map)
            
            var team1Players = [];
            var team2Players = [];
            
            match.playerStats.team1.forEach(player =>{
                team1Players.push(
                    new MapPlayer(player.id, player.rating, player.name)
                )
            });
            match.playerStats.team2.forEach(player =>{
                team2Players.push(
                    new MapPlayer(player.id, player.rating, player.name)
                )
            });
            
            console.log(team1Players);
            console.log(team2Players);
            
            if (mapId != mapIds[-1]) {
                // wait some time so I dont get banned by cloudflare (hopefully)
                console.log("waiting " + waitTime + " seconds for next request")
                await sleep(waitTime * 1000);
            }
            

        }
    }
}

// Recursively call HLTV.getMatchMapStats with a wait if cloudflare temporarily
// bans me.
async function recursiveGetMatchMapStats(mapId) {
    const waitTime = 5;
    try {
        console.log("requesting match from HLTV")
        var match = await HLTV.getMatchMapStats({id: mapId})
        return match;
    } catch(err) {
        
        console.log(err);
        console.log("waiting " + waitTime + " minutes and trying again");
        await sleep(1000*60*waitTime);
        return recursiveGetMatchMapStats(mapId);
    }

} 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class MapPlayer {
    constructor(id, rating, name) {
        this.id = id;
        this.rating = rating;
        this.name = name;
    }
}