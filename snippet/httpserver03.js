// Client POST implementation
const http = require('http');
const options = {
    host: 'localhost',
    path: '/',
    port: '8080',
    method: 'POST',
}

const readJSONResponse = (response) => {
    let responseData = '';
    response.on('data', (chunk) => {
        responseData += chunk;
    });
    response.on('end', () => {
       const dataObj = JSON.parse(responseData);
       console.log(dataObj);
    });
};

const req = http.request(options, readJSONResponse);
const body = { NAME: "Jiho Park", SPARCS_ID: "night" };
req.write(JSON.stringify(body));
req.end();