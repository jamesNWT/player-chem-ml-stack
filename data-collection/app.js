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

    my_data = await HLTV.getMatchesStats(my_filter);

    console.log(my_data[0])

}