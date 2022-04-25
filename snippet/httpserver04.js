//Server POST implementation
const http = require('http');
const port = 8080;

http.createServer((req, res) => {
   try {
      console.log(`Request for ${req.url}`);
      let jsonData = "";
      req.on("data", (chunk) => {
         jsonData += chunk;
      });
      req.on("end", () => {
         const reqObj = JSON.parse(jsonData);
         const resObj = { identity: `Welcome, ${ reqObj.NAME } (${ reqObj.SPARCS_ID }@SPARCS)` };
         res.writeHead(200);
         res.end(JSON.stringify(resObj));
      });
   } catch (e) {
      res.setHeader("Content-Type", "text/html");
      res.writeHead(500);
      res.end(`Error - ${e}`);
   }
}).listen(port);

console.log(`[Server] Listening on port ${ port }`);