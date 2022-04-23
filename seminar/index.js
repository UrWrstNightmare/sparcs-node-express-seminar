const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

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

app.get('/', (req, res) => {
    res.status(200).send('Hello, World!');
});

app.get('/status', (req, res) => {
    res.status(200).json({ isOnline: true });
})

app.listen(port, () => {
   console.log(`Example App Listening @ http://localhost:${ port }`);
});
