const NodeCache = require("node-cache");

// the time to live of the cache is 10 minutes
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

module.exports = cache;
