// Step 1: accept input variables (date range, top n teams)
// Step 2: create request to hltv server
// Step 3: send request
// Step 4: accept response
// Step 5: parse response into csv

const { HLTV } = require('hltv')

main();

async function main() {
    my_filter = {startDate: '2017-07-10', 
                 endDate: '2017-07-18', 
                 rankingFilter: 'Top20'};
    
    my_match = {id: 2306295}    

    // my_data = await HLTV.getMatchesStats(my_filter);
    // console.log(my_data[0])

    // my_data = await HLTV.getMatch(my_match);
    // console.log(my_data.players.team1[0])

    my_data = await HLTV.getMatchMapStats({id: 29968});
    console.log(my_data.playerStats.team1[0].rating)

    my_player = await HLTV.getPlayer({id: 798});
    // console.log(my_player)
}