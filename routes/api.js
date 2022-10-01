const router = require('express').Router();
const path = require('path');
const File = require('../models/file');


router.post('/send', async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;
    if (!uuid || !emailTo) {
        return res.status(422).send({ error: 'All fields are required except expiry.' });
    }
    // Get data from db 
    try {
        const file = await File.findOne({ uuid: uuid });
        if (file.sender) {
            return res.status(422).send({ error: 'Email already sent once.' });
        }
        file.sender = emailFrom;
        file.receiver = emailTo;
        const response = await file.save();
        // send mail
        const sendMail = require('../services/mailService');
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
        }).then(() => {
            return res.json({ success: "Your email has been sent!!!!" });
        }).catch(err => {
            return res.status(500).json({ error: 'Error in email sending.' });
        });

    } catch (err) {
        return res.status(500).send({ error: 'Something went wrong.' });
    }

});

module.exports = router;
