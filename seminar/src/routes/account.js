const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

class BankDB {
    static _inst_;
    static getInst = () => {
        if ( !BankDB._inst_ ) BankDB._inst_ = new BankDB();
        return BankDB._inst_;
    }

    #total = 10000;


    constructor() { console.log("[Bank-DB] DB Init Completed"); }

    getBalance = () => {
        return { success: true, data: this.#total };
    }

    transaction = ( amount ) => {
        this.#total += amount;
        return { success: true, data: this.#total };
    }
}

class BookDB {
    static _inst_;
    static getInst = () => {
        if ( !BookDB._inst_ ) BookDB._inst_ = new BookDB();
        return BookDB._inst_;
    }
    
    #id = 0; #itemCount = 0; #LDataDB = [];

    selectItems = () => {
        return { success: true, data: this.#LDataDB }
    }

    insertItem = ( item ) => {
        const { spend, purpose } = item;
        this.#LDataDB.push({ id: this.#id, spend, purpose });
        this.#id++; this.#itemCount++;
        return true;
    }

    deleteItem = ( id ) => {
        let BItemDeleted = false;
        this.#LDataDB = this.#LDataDB.filter((value) => {
            const match = (value.id === id);
            if (match) BItemDeleted = true;
            return !match;
        });
        if (BItemDeleted) {
            id--;
            this.#id--;
        }
        return BItemDeleted;
    }

    modifyItem = ( item ) => {
        let BItemModified = false;

        const { id, spend, purpose } = item;
        const num_id = parseInt(id);

        this.#LDataDB.forEach((value) => {
            const match = (value.id == num_id);
            if (match) {
                this.#LDataDB[value.id].spend = spend;
                this.#LDataDB[value.id].purpose = purpose;
                BItemModified = true;
            }
        });

        return BItemModified;
    }
}


const bankDBInst = BankDB.getInst();
const bookDBInst = BookDB.getInst();

router.post('/getInfo', authMiddleware, (req, res) => {
    try {
        const { success, data } = bankDBInst.getBalance();
        if (success) return res.status(200).json({ balance: data });
        else return res.status(500).json({ error: data });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/transaction', authMiddleware, (req, res) => {
    try {
        const { amount } = req.body;
        const { success, data } = bankDBInst.transaction( parseInt(amount) );
        if (success) res.status(200).json({ success: true, balance: data, msg: "Transaction success" });
        else res.status(500).json({ error: data })
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

router.get('/getBook', (req, res) => {
    try {
        const dbRes = bookDBInst.selectItems();
        if (dbRes.success) return res.status(200).json(dbRes.data);
        else return res.status(500).json({ error: dbRes.data })
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/addBook', (req, res) => {
    try {
        const { spend, purpose } = req.body;
        const addResult = bookDBInst.insertItem({ spend, purpose });
        if (!addResult) return res.status(500).json({ error: addResult.data })
        else return res.status(200).json({ isOK: true });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
 });

router.post('/deleteBook', (req, res) => {
    try {
        const { id } = req.body;
        const deleteResult = bookDBInst.deleteItem(parseInt(id));
        if (!deleteResult) return res.status(500).json({ error: "No item deleted" })
        else return res.status(200).json({ isDeleteOK: true });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/modifyBook', (req, res) => {
    try {
        const { id, spend, purpose } = req.body;
        const modifyResult = bookDBInst.modifyItem({ id, spend, purpose });
        if (!modifyResult) return res.status(500).json({ error: "No item modified" })
        else return res.status(200).json({ isModifyOK: true });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});
module.exports = router;