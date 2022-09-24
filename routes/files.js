const router = require('express').Router();
/* const express = require('express');
const router = express.Router(); 
Both are same */
const multer = require('multer');
const path = require('path');

const File = require('../models/file')
const { v4: uuid4 } = require('uuid');
const file = require('../models/file');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniquename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

        cb(null, uniquename);
    }
})

let upload = multer({
    storage,
    /* same as writing storage : storage, since key and value are same we can write it once only*/
    limit: { fileSize: 1000000 * 100 },
}).single('myfile');

router.post('/', (req, res) => {



    // Store File
    upload(req, res, async (err) => {
        // Validate Request 

        if (!req.file) {

            return res.json({ error: 'All fields are required.' });

        }

        if (err) {
            return res.status(500).send({ error: err.message });
        }

        // Store into Database

        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        })

        const response = await file.save();

        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` })

        // http://localhost:3000/files/2343hjhjfshjah-123343hjhj this is the kind of link upper text will concatenate.
    })

    //Response -> Link
})

router.post('/send', async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;

    if (!uuid || !emailTo || emailFrom) {
        return res.status(422).send({ error: 'All fields are required' });
    }

    // Get data from database 
    const file = await File.findOne({ uuid: uuid });

    if (file.sender) {
        return res.status(422).send({ error: 'Email already sent.' });

    }

    file.sender = emailFrom;
    file.receiver = emailTo;

    const response = await file.save();

    // Send Email 

    const sendMail = require('../services/emailService')

    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'inShare file sharing',
        text: `${emailFrom} shared a file with you.`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
            size: parseInt(file.size / 1000) + ' KB',
            expires: '24 hours'
        })


    });
    return res.send({ success: true });


});
module.exports = router;