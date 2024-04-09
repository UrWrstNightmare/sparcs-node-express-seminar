const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadsDir = path.join(__dirname , 'uploads');
        cb(null, 'uploads/'); // Make sure this uploads directory exists
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Naming the file uniquely
    }
});

const upload = multer({ storage: storage });

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

    insertItem = ( item, imagePath = '' ) => {
        const { title, content } = item;
        this.#LDataDB.push({ id: this.#id, title, content, imagePath });
        this.#id++; this.#itemCount++;
        return {success: true, id: this.#id-1 };
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

    editItem = (id, item) => {
        const { title, content, imagePath } = item;
        let itemUpdated = false;
        this.#LDataDB = this.#LDataDB.map((val) => {
            if (val.id === id) {
                itemUpdated = true;
                return { ...val, title, content, imagePath: imagePath || val.imagePath };
            } else {
                return val;
            }
        });
        return itemUpdated;
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
       if (!addResult.success) return res.status(500).json({ error: dbRes.data })
       else return res.status(200).json({ isOK: true, id: addResult.id });
   } catch (e) {
       return res.status(500).json({ error: e });
   }
});

router.post('/uploadImage', upload.single('image'), (req, res) => {
    console.log("Uploaded file:", req.file);
    console.log("Request body:", req.body);
    try {
        const postId = req.body.postId;
        const filePath = req.file.path;
        const itemToUpdate = feedDBInst.editItem(parseInt(postId), { imagePath: filePath });
        if (itemToUpdate) {
            res.status(200).json({ isOK: true, message: 'Image uploaded and post updated.', filePath: filePath });
        } else {
            res.status(404).json({ error: 'Post not found for given ID' })
        }
    } catch (e) {
        return res.status(500).json({error: e});
    }
})

router.post('/deleteFeed', (req, res) => {
    try {
        const { id } = req.body;
        const deleteResult = feedDBInst.deleteItem(parseInt(id));
        if (!deleteResult) return res.status(500).json({ error: "No item deleted" })
        else return res.status(200).json({ isOK: true });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

router.post('/editFeed', (req, res) => {
    try {
        const {id, title, content } = req.body;
        feedDBInst.editItem(parseInt(id), { title, content });
        return res.status(200).json({ isOK: true });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

module.exports = router;