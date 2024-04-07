const express = require('express');

const router = express.Router();

class FeedDB {
    static _inst_;
    static getInst = () => {
        if ( !FeedDB._inst_ ) FeedDB._inst_ = new FeedDB();
        return FeedDB._inst_;
    }

    #id = 1; #itemCount = 1; #LDataDB = [{ id: 0, title: "test1", content: "Example body" }];

    constructor() { console.log("[Feed-DB] DB Init Completed"); }

    selectItems = ( count ) => {
        if (count > this.#itemCount) return { success: false, data: "Too many items queried"  };
        if (count < 0) return { success: false, data: "Invalid count provided" };
        else return { success: true, data: this.#LDataDB.slice(0, count) }
    }

    insertItem = ( item ) => {
        const { title, content } = item;
        this.#LDataDB.push({ id: this.#id, title, content });
        this.#id++; this.#itemCount++;
        return true;
    }

    updateItem = ( id, content ) => {
        let BItemEdited = false;
        this.#LDataDB = this.#LDataDB.map((value) => {
            if (value.id === id) {
                value.content = content;
                BItemEdited = true;
            }
            return value;
        });
        return BItemEdited;
    }

    duplicateItem = ( id ) => {
        let BItemFound = false;
        let OItem = null;
        this.#LDataDB = this.#LDataDB.map((value) => {
            if (value.id === id) {
                BItemFound = true;
                OItem = value;
            }
            return value;
        });
        if (BItemFound) {
            this.#LDataDB.push({id: this.#id, title: OItem.title, content: OItem.content});
            this.#id++; this.#itemCount++;
        }
        return BItemFound;
    }

    deleteItem = ( id ) => {
        let BItemDeleted = false;
        this.#LDataDB = this.#LDataDB.filter((value) => {
            const match = (value.id === id);
            if (match) BItemDeleted = true;
            return !match;
        });
        if (BItemDeleted) id--;
        return BItemDeleted;
    }
}

const feedDBInst = FeedDB.getInst();

router.get('/getFeed', (req, res) => {
    try {
        const requestCount = parseInt(req.query.count);
        const dbRes = feedDBInst.selectItems(requestCount);
        if (dbRes.success) return res.status(200).json(dbRes.data);
        else return res.status(500).json({ error: dbRes.data })
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/addFeed', (req, res) => {
   try {
       const { title, content } = req.body;
       const addResult = feedDBInst.insertItem({ title, content });
       if (!addResult) return res.status(500).json({ error: dbRes.data })
       else return res.status(200).json({ isOK: true });
   } catch (e) {
       return res.status(500).json({ error: e });
   }
});

router.post('/updateFeed', (req, res) => {
    try {
        const { id, content } = req.body;
        const Nid = parseInt(id);
        const updateResult = feedDBInst.updateItem( Nid, content );
        if (!updateResult) return res.status(500).json({ error: { Nid, content, updateResult } })
        else return res.status(200).json({ isOK: true });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/duplicateFeed', (req, res) => {
    try {
        const { id } = req.body;
        const Nid = parseInt(id);
        const updateResult = feedDBInst.duplicateItem( Nid );
        if (!updateResult) return res.status(500).json({ error: { Nid, updateResult } })
        else return res.status(200).json({ isOK: true });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});
 
router.post('/deleteFeed', (req, res) => {
    try {
        const { id } = req.body;
        const deleteResult = feedDBInst.deleteItem(parseInt(id));
        if (!deleteResult) return res.status(500).json({ error: "No item deleted" })
        else return res.status(200).json({ isOK: true });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

module.exports = router;