// test command: 
// node ./data-collection/app.js --start_date 2021-02-21 --end_date 2021-02-23 --rank_filter Top10 --wait_time 3.5 --file_out test.json
// node ./data-collection/app.js --start_date 2019-02-19 --end_date 2019-02-23 --rank_filter Top30 --wait_time 3.5 --file_out test.json
// node ./data-collection/app.js --start_date 2019-01-01 --end_date 2020-03-19 --rank_filter Top30 --wait_time 3.5 --file_out test.json
// should correspond to these matches: 
// https://www.hltv.org/stats/matches?startDate=2021-02-21&endDate=2021-02-23&rankingFilter=Top10
// https://www.hltv.org/stats/matches?startDate=2019-02-19&endDate=2019-02-23&rankingFilter=Top30

'use strict';

const { HLTV } = require('hltv');
const args = require('yargs').argv;

class MapPlayer {
    constructor(rating, name) {
        this.rating = rating;
        this.name = name;
    }
}

/**
 * Represents a map played. for the purpose of this program, map and match are
 * synonomous.
 */
class MapPlayed {
    constructor(id, date, map, team1, team2) {
        this.id = id;
        this.date = date;
        this.map = map;
        this.team1 = team1;
        this.team2 = team2;
    }
}

class DateInterval {
    constructor(start, end) {
        this.start = start.toISOString().substr(0, 10);
        this.end = end.toISOString().substr(0, 10);
    }
}

if (args.wait_time) {
    var waitTime = args.wait_time;   
}
else {
    waitTime = 0;
}

main();

async function main() {
    
    var mapsFilter = {
        startDate: args.start_date, 
        endDate: args.end_date, 
        rankingFilter: args.rank_filter
    };
    
    var mapIds = await getMapIds(mapsFilter);

    var results = await getPlayerStatsOverMaps(mapIds);

    var playerMasterList = results[0];
    var allMaps = results[1];

    console.log(playerMasterList);
    console.log(allMaps);

    writePlayersToJSON(allMaps);
}

function writePlayersToJSON(allMaps) {
    var fs = require('fs');
    var json = JSON.stringify(allMaps);
    fs.writeFile(args.file_out, json, 'utf8', function(err) {
        if (err) throw err;
        console.log('Complete');
    });
}
async function getMapIds(mapsFilter) {

    var intervals = breakdown_date_range(args.start_date, args.end_date);
    
    var mapIds = [];
    var i = 0;
    for (const interval of intervals) {
        console.log("Getting matches batch ", i, " of ", intervals.length);

        mapsFilter.startDate = interval.start;
        mapsFilter.endDate   = interval.end;
        var maps = await recursiveCallAPI(HLTV.getMatchesStats(mapsFilter));

        maps.forEach(map => {
            mapIds.push(map.id);
        });
        console.log("waiting " + waitTime + " seconds");
        await sleep(waitTime*1000)
        i++;
    }

    return mapIds
}

function breakdown_date_range(start_date, end_date) {
    var addDays = require('date-fns/addDays');
    var compareAsc = require('date-fns/compareAsc')

    const INTERVAL = 5;

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    var intervals = [];
    
    var currentDate = startDate
    var nextDate = addDays(currentDate, INTERVAL);
    while (compareAsc(nextDate, endDate) < 0) {
        intervals.push(new DateInterval(currentDate, nextDate));
        currentDate = addDays(nextDate, 1); // Start next intrvl day after last
        nextDate = addDays(currentDate, INTERVAL)
    }
    if (compareAsc(nextDate, endDate) == 0) {
        intervals.push(new DateInterval(currentDate, nextDate));
    } else if (compareAsc(nextDate, endDate) > 0) {
        intervals.push(new DateInterval(currentDate, endDate));
    }

    return intervals;
}

async function getPlayerStatsOverMaps(mapIds) {
    
    var n = 0;
    var allPlayers = [];
    var allMaps = [];
    
    for (const mapId of mapIds) {
        n++;

        var match = await recursiveCallAPI(HLTV.getMatchMapStats({id: mapId}));

        console.log("Recieved match " + n + " of " + mapIds.length);

        var team1Players = [];
        var team2Players = [];

        match.playerStats.team1.forEach(player => {
            team1Players.push(
                new MapPlayer(player.rating, player.name)
            );
            if (!allPlayers.includes(player.name)) {
                allPlayers.push(player.name);
            }
        });
        match.playerStats.team2.forEach(player => {
            team2Players.push(
                new MapPlayer(player.rating, player.name)
            );
            if (!allPlayers.includes(player.name)) {
                allPlayers.push(player.name);
            }
        });

        const mapPlayed = new MapPlayed(
            mapId, match.date, match.map, team1Players, team2Players
        );

        // console.log(JSON.stringify(mapPlayed));
        // console.log(mapPlayed);
        allMaps.push(mapPlayed)

        if (mapId != mapIds[mapIds.length - 1] && waitTime != 0) {
            // wait some time so I dont get banned by cloudflare (hopefully)
            console.log("waiting " + waitTime + " seconds for next request")
            await sleep(waitTime * 1000);
        }
    }
    console.log("Successfully recieved all matches!")
    return [allPlayers, allMaps];
}

// Recursively call HLTV.getMatchMapStats with a wait if cloudflare temporarily
// bans me.
async function recursiveCallAPI(func) {
    const longWaitTime = 2;
    try {
        console.log("making request to hltv database")
        var match = await func;
        return match;
    } catch(err) {
        
        console.log(err);
        waitTime = waitTime+0.5
        console.log("waiting " + longWaitTime 
                    + " minutes and trying again, with " + waitTime 
                    + " seconds between requests");
        await sleep(1000*60*longWaitTime);
        return recursiveCallAPI(func);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}