// Client GET implementation
const https = require('https');
const options = {
    hostname: "sparcs.org",
};

const handleResponse = (response) => {
    let serverData = '';
    response.on('data', (chunk) => {
        serverData += chunk;
    });
    response.on('end', (chunk) => {
       console.log(serverData);
    });
};

https.request(options, (response) => handleResponse(response)).end();
