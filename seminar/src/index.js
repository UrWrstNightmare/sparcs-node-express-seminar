const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const statusRouter = require('./routes/status');
const feedRouter = require('./routes/feed');
const accountRouter = require('./routes/account');
const ssrRouter = require('./routes/ssr');

const app = express();
const port = process.env.PORT;

app.use(express.json());

const whitelist = ['http://localhost:3000'];
const corsOptions = {
    origin: (origin, callback) => {
        console.log('[REQUEST-CORS] Request from origin: ', origin);
        if (!origin || whitelist.indexOf(origin) !== -1) callback(null, true)
        else callback(new Error('Not Allowed by CORS'));
    },
    credentials: true,
}

app.use(cors(corsOptions));

app.use('/status', statusRouter);
app.use('/feed', feedRouter);
app.use('/account', accountRouter);
app.use('/ssr', ssrRouter);

app.use('/static', express.static(path.join(__dirname,'public')));

// Connect to MongoDB
const OMongooseOption = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.MONGO_URI, OMongooseOption).then(
    () => { console.log("[Mongoose] Connection Complete!") },
    (err) => { console.log(`[Mongoose] Connection Error: ${ err }`) }
);

app.listen(port, () => {
   console.log(`Example App Listening @ http://localhost:${ port }`);
});
