### 2021-02-22

Was about to give in to despair with the API not returning nearly enough info 
with the GetMatchesStats function, but found that getMatchMapStats function will
the info I need. So, I'll get a list of match ID's using the former and then get
useful information out of these matches with the former.

I still need to figure out how to get this data from a series of API calls
that return json objects to a csv...

### 2021-02-23
Well, I was on my way to finishing the script but I've just gotten banned from
making IP requests to HLTV.org. I've contacted a couple people at hltv to ask
about getting whitelisted but I'm not holding out hope. I figure I can give them
a day to get back to me and in the meantime think about back-up plans.

### 2021-02-24 
Turns out I'm not actually IP banned! I've also figured out how to actually get
waiting to work so that's good. I've made an issue asking how severly I'll have 
to slow requests down to avoid getting flagged in the future. I still need to 
figure out how I'm going to represent this data.

### 2021-03-02
Today and yesterday I tweaked the script. I added a catch for cloudflare
timeouts, waiting 5 minutes if that happens to retry the request. I have no idea
if that's enough time, right now cloudflare isnt even catching me if i dont wait
at all. I made the wait time a command line variable. I now save a master list
of players, and I store all the matches in a big list of objects. Now I have to
turn that big list of objects into a csv that makes sense...