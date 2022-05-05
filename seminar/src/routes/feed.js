const express = require('express');
const FeedModel = require('../models/feed');

const router = express.Router();

class FeedDB {
    static _inst_;
    static getInst = () => {
        if ( !FeedDB._inst_ ) FeedDB._inst_ = new FeedDB();
        return FeedDB._inst_;
    }

    // #id = 1; #itemCount = 1; #LDataDB = [{ id: 0, title: "test1", content: "Example body" }];

    constructor() { console.log("[Feed-DB] DB Init Completed"); }

    selectItems = async ( count, search ) => {
        try {
            if (count === 0) return { success: true, data: [] };
            // We'll Remove the Item Count Limit for Search... (Really, this is unnecessary)
            /*
            const DBItemCount = await FeedModel.countDocuments();
            if (count > DBItemCount) return { success: false, data: "Too many items queried"  };
            if (count < 0) return { success: false, data: "Invalid count provided" };
            */
            const findArguments = search === "" ? {} : {$or: [ { title: { "$regex": search } }, { content: { "$regex": search } } ]};
            const res = await FeedModel.find(findArguments).sort({'createdAt': -1}).limit(count).exec();
            return { success: true, data: res };
        } catch (e) {
            console.log(`[Feed-DB] Select Error: ${ e }`);
            return { success: false, data: `DB Error - ${ e }` };
        }
    }

    insertItem = async ( item ) => {
        const { title, content } = item;
        try {
            const newItem = new FeedModel({ title, content });
            const res = await newItem.save();
            return true;
        } catch (e) {
            console.log(`[Feed-DB] Insert Error: ${ e }`);
            return false;
        }
    }

    deleteItem = async ( id ) => {
        try {
            const ODeleteFiler = { _id: id };
            const res = await FeedModel.deleteOne(ODeleteFiler);
            return true;
        } catch (e) {
            console.log(`[Feed-DB] Delete Error: ${ e }`);
            return false;
        }
    }
}

const feedDBInst = FeedDB.getInst();

router.get('/getFeed', async (req, res) => {
    try {
        const requestCount = parseInt(req.query.count);
        const searchString = req.query.search;
        const dbRes = await feedDBInst.selectItems(requestCount, searchString);
        if (dbRes.success) return res.status(200).json(dbRes.data);
        else return res.status(500).json({ error: dbRes.data })
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/addFeed', async (req, res) => {
   try {
       const { title, content } = req.body;
       const addResult = await feedDBInst.insertItem({ title, content });
       if (!addResult) return res.status(500).json({ error: dbRes.data })
       else return res.status(200).json({ isOK: true });
   } catch (e) {
       return res.status(500).json({ error: e });
   }
});

router.post('/deleteFeed', async (req, res) => {
    try {
        const { id } = req.body;
        const deleteResult = await feedDBInst.deleteItem(id);
        if (!deleteResult) return res.status(500).json({ error: "No item deleted" })
        else return res.status(200).json({ isOK: true });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

module.exports = router;