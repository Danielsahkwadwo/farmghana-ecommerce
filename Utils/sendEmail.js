const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
// const path = require("path");

const sendEmail = async (
  subject,
  send_to,
  sent_from,
  reply_to,
  template,
  name,
  link,
  myOrderId,
  total
) => {
  //create transporter
  const transporter = nodemailer.createTransport({
    // service: "gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: "views",
      layoutsDir: "views",
      defaultLayout: null,
    },
    viewPath: "views",
    extName: ".hbs",
  };

  transporter.use("compile", hbs(handlebarOptions));

  //email sending options
  const options = {
    from: {
      name: "DavAK Shopping",
      address: "danielsah118@outlook.com",
    },
    to: send_to,
    replyTo: reply_to,
    subject,
    template,
    context: {
      name,
      link,
      myOrderId,
      total,
    },
  };

  //send Email
  transporter.sendMail(
    options
    //    function async(err, info) {
    //   if (err) {
    //     console.log(err.message);
    //   } else {
    //     // console.log(info);
    //   }
    // }
  );
};

module.exports = sendEmail;
