const MQService = require('../services/MQService');
const csv = require('csv-parser');
const https = require('https');
let message;
class Bot {
    constructor() {}
    getMessage(parameter, callback) {        
        https.get(`https://stooq.com/q/l/?s=${parameter}&f=sd2t2ohlcv&h&e=csv`, res => res
            .pipe(csv())
            .on('data', (row) => {               
                message =  row.Close !== 'N/D' ? `${row.Symbol} quote is $${row.Close} per share`: `The company ${row.Symbol} doesn\'t exist`;              
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                let MQS = new MQService();
                MQS.publishToQueue('user_messages',message, function(returnValue) {
                    console.log('all good in boot');
                    callback({text: message, user: "Bot", index: null, date: null});
                });
            })
        );
    }
}
module.exports = Bot;

