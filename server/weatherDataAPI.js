const https = require("https");
const weather_key =
    process.env.WEATHER_API_KEY || require("./secrets.json").WEATHER_API_KEY;

const { replaceUmlaute } = require("./replaceUmlaute");

module.exports.getAddressWeatherData = function (address, country, callback) {

    address = address.split(" ");
    let cleanAddress = address[address.length - 2];
    cleanAddress += "%20" + address[address.length - 1] + "%20" + country;
    cleanAddress = replaceUmlaute(cleanAddress);

    const options = {
        method: "GET",
        protocol: "https:",
        host: "weather.visualcrossing.com",
        path: `/VisualCrossingWebServices/rest/services/timeline/${cleanAddress}?unitGroup=metric&key=${weather_key}&contentType=json`,
        headers: {},
    };

    function makeRequest(resp) {
        if (resp.statusCode != 200) {
            callback(new Error(resp.statusCode));
            return;
        } else {
            let body = "";
            resp.on("data", (chunk) => {
                body += chunk;
            });

            resp.on("end", () => {
                let parsedBody = JSON.parse(body);
                callback(null, parsedBody);
            });
        }
    }

    const reqTweet = https.request(options, makeRequest);

    reqTweet.end();
};
