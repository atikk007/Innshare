const nodemailer = require('nodemailer');

async function sendMail({ from, to, subject, text, html }) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  })

  let info = await transporter.sendMail({
    from: 'inshare <atikmansuri619@gmail.com>',
    to, /* == to: to in js if key and value are same then we can just write it once #destructuring */
    subject: subject,
    text: text,
    html: html,

  });


  console.log(info)
}


module.exports = sendMail;