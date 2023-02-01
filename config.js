const twitter = require('twitter-lite');

exports.newClient = function (subdomain = 'api') {
    return new twitter({
        subdomain,
        consumer_key: process.env['consumer_key'],  // api Key
        consumer_secret: process.env['consumer_secret'],   // api secret
        access_token_key: process.env['access_token_key'],
        access_token_secret: process.env['access_token_secret'],  
    });
}
