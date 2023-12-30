const fs = require('fs');
const Record = require('../models/record');

const listenMessage = async (client) => {
    client.on('message', async (devID, message) => {
        console.log("* Received uplink from*** ", devID);
        const payload = JSON.parse(message).uplink_message; 

        if(payload?.decoded_payload) {
            console.log(payload);

            const dataVacas = JSON.stringify(payload.decoded_payload, null, 2);
            // fs.appendFileSync('measure.txt',  dataVacas + '\n');
            fs.appendFileSync('vaca0712.txt',  dataVacas + ',' + '\n');

            const record = new Record({
                aid_Vaca: payload.decoded_payload.aid_Vaca,
                c02_scd: payload.decoded_payload.Co2_scd,
                temp_scd: payload.decoded_payload.temp_scd,  
                hum_scd: payload.decoded_payload.hum_scd,  
                heart_valid: payload.decoded_payload.heart_valid,  

            });
            await record.save();
        }
    });
}

module.exports = {
    listenMessage,
}
