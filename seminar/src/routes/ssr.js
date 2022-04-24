const express = require('express');
const ejs = require('ejs');
const path = require('path');

const router = express.Router();

router.get('/getpage', (req, res) => {
    try {
        const { arg } = req.query;
        const ejsArg = { arg: arg };
        const ejsConfig = {};
        ejs.renderFile( path.join(__dirname,'../templates/getPage.html'), ejsArg, ejsConfig, (err, renderedStr) => {
            if (err) throw err;
            else return res.status(200).send(renderedStr);
        });
    } catch (e) {
        return res.status(500).send(`Error! ${ e }`);
    }
});

module.exports = router;