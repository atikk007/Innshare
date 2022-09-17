const router = require('express').Router();
/* const express = require('express');
const router = express.Router(); 
Both are same */
const multer = require('multer');
const path = require('path');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploads),
    filename: (req, file, cb) => {
        const uniquename = `${Date.now()}-${Math.round(Math.random() * 1E5)}${path.extname(file.originalname)}`;

        cb(null, uniquename);
    }
})

let upload = multer({
    storage,
    /* same as writing storage : storage, since key and value are same we can write it once only*/
    limit: { fileSize: 1000000 * 100 },
}).single('myfile');

router.post('/', (req, res) => {
    // Validate Request 

    if (!req.file) {

        return res.json({ error: 'All fields are required.' });

    }

    // Store File
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).send("error: ", err.message);
        }

        // Store into Database


    })


    //Response -> Link
})

module.exports = router;