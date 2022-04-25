// Server GET implementation
const http = require('http');
const url = require('url');

const port = 8080;

const items = ["Item 01", "Item 02", "Item 03"];

http.createServer((req, res) => {
    try {
        console.log(`Request for ${req.url}`);
        const queryObject = url.parse(req.url, true).query;
        const elemNo = parseInt(queryObject["index"]);
        if ( !Number.isInteger(elemNo) ) throw Error("Not a integer!");
        if (elemNo < 0 || elemNo >= items.length) throw Error("Index out of range!");

        const resHTML = `
            <html>
                <head><title>Simple HTTP Server (GET)</title></head>
                <body>Result: ${ items[elemNo] }</body>
            </html>
        `;

        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(resHTML);
    } catch (e) {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(500);
        res.end(`Error - ${e}`);
    }
}).listen(port);

console.log(`[Server] Listening on port ${ port }`);