const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
app.disable('x-powered-by');
const port = 5000;
require("dotenv").config();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

//to parse JSON and urlencoded request bodies
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

//to set Access-Control-Allow-Origin header
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

/**
 * Function to send recovery email containing OTP.
 * 
 * @param {Object} param0 - Object containing recipient email and OTP.
 * @param {string} param0.recipient_email - Email address of the recipient.
 * @param {string} param0.OTP - One-time password for recovery.
 * @returns {Promise} - Promise indicating success or failure of email sending.
 */
function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host:'smtp.gmail.com', //SMTP server host name
      port: 465, // SMTPS port for Gmail
        service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "PASSWORD RECOVERY",
      html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - OTP Email Template</title>
  

</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Password Recovery</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />Koding 101</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    </div>
  </div>
</div>
<!-- partial -->
  
</body>
</html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}

/**
 * Default route for testing purposes.
 */
app.get("/", (req, res) => {
  console.log(process.env.MY_EMAIL);
});

/**
 * Route to send password recovery email.
 */
app.post("/send_recovery_email", (req, res) => {
  sendEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

// Start the server
app.listen(port, () => {
  console.log(`nodemailerProjects is listening at http://localhost:${port}`);
});
