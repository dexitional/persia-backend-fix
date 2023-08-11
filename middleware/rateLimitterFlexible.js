const { default: axios } = require("axios");
const { SSO } = require("../model/mysql/ssoModel");
const db = require("../config/mysql");
const { RateLimiterMemory, RateLimiterMySQL } = require("rate-limiter-flexible");
//const loc = await axios.get(`https://geolocation-db.com/json/`);
   
const opts = {
    storeClient: db,
    dbName: 'ehub_vote',
    tableName: 'rate', // all limiters store data in one table
    duration: 3,   // Per Second
    points:   1    // Requests
  };
  
// const rateLimiter = new RateLimiterMemory({
//     duration: 3,   // Per Second
//     points:   1    // Requests
// });

const rateLimiter = new RateLimiterMySQL(opts, (err) => {
   console.log(err)
})


const voteLimiter = (req,res,next) => {
  rateLimiter
    .consume(req.userId)
    .then((rateLimiterRes) => {
      res.setHeader('Retry-After', rateLimiterRes.msBeforeNext / 1000);
      res.setHeader('X-RateLimit-Limit', 1);
      res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());
      // CORS (optional)
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
     
      next();
    })
    .catch(async () => {
      
      // Log to Rate Attacks
      axios.get(`https://geolocation-db.com/json/`).then( async (resp) => {
        const loc = resp.data;
        await SSO.logAttack({
            period: new Date(),
            tag: req.userId,
            election_id: 0,
            ip: loc?.data?.IPv4,
            location: `Country: ${loc?.data?.country_name}, Coordinates: [ Lat ${loc?.data?.latitude}, Long ${loc?.data?.longitude} ] ${loc?.data?.city && loc?.data?.city != 'null' && ', City: '+loc?.data?.city}`,
            meta: "RATE ATTACK"
          })
      })
      
      res.status(429).json({ message: 'Too Many Requests !' });
    });
};


 
module.exports = {
    voteLimiter
}
 

// EH/BSS/19/0234 - adongo
// EH/ACT/20/0075 - abanga

