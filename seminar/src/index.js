const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const statusRouter = require('./routes/status');
const feedRouter = require('./routes/feed');
const accountRouter = require('./routes/account');

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/static', express.static(path.join(__dirname, '/public'))); // Serve other static files

const whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    console.log('[REQUEST-CORS] Request from origin: ', origin);
    // Allow all origins for testing purposes
    callback(null, true);
  },
  credentials: true,
}


app.use(cors(corsOptions));

app.use('/status', statusRouter);
app.use('/feed', feedRouter);
app.use('/account', accountRouter);

app.listen(port, () => {
   console.log(`Example App Listening @ http://localhost:${ port }`);
});
