// Step 1: accept input variables (date range, top n teams)
// Step 2: create request to hltv server
// Step 3: send request
// Step 4: accept response
// Step 5: parse response into csv



const { HLTV } = require('hltv')

var myvar = HLTV.getMatch({id: 2306295})

data = await myvar

console.log(myvar)