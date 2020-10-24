const express = require("express");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const nodemailer = require("nodemailer");
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get("/", (req, res) => {
  res.json([{
    name: "index",
    directory: "https://nodemailer-serverless.netlify.app/.netlify/functions/api/"
  },
  {
    name: "nodemailer API",
    directory: "https://`nodemailer-serverless.netlify.app/.netlify/functions/api/mail"
  }
]);
});

const emailAddress = process.env.EMAIL;
const password = process.env.PASSWORD;

router.post("/mail", async (req, res) => {
  console.log("req.body", req.body);
  if (req.method === "POST") {
    // Process a POST request
    const { name, phone } = req.body;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailAddress,
        pass: password
      },
    });

    const message = {
      from: '"SenaraiCerita Form Submission" <febrilian.kr@gmail.com>', // sender address
      to: `febrilian.kr@gmail.com`, // list of receivers
      subject: name, // Subject line
      text: `New order from ${name}, contact through ${phone}. Click this link https://wa.me/62${phone} to automatically be redirected to whatsapp app.`, // plain text body
      html: `New order from ${name}, contact through ${phone}. Click this link https://wa.me/62${phone} to automatically be redirected to whatsapp app.`, // html body
    };

    // send mail with defined transport object
    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    res.send({
      success: true,
      message: `Terima kasih, ${name}! Kami akan segera menghubungi melalui WhatsApp Anda di ${phone}`
    });
  }
});

module.exports.handler = serverless(app);

app.use("/.netlify/functions/api", router);
