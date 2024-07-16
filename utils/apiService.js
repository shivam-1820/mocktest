const axios = require('axios');


async function apiRequest(method, url, data, headers) {

    return await axios({
        method: method,
        url: url,
        data: data,
        headers: headers
    })
        .catch(async (err) => {
            return err
        })
}


module.exports = {
    apiRequest
}