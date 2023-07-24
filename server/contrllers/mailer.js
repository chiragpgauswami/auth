import nodemailer from "nodemailer";
import ENV from "../config.js";
import Mailgen from "mailgen";

let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: ENV.EMAIL,
    pass: ENV.EMAIL_PASSWORD,
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

export const registerMail = (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  var email = {
    body: {
      name: username,
      intro:
        text || "Welcome to Mailgen! We're very excited to have you on board.",
      action: {
        instructions: "Click the button below to validate your email address",
        button: {
          color: "#33b5e5",
          text: "Validate Email",
          link: "http://localhost:3000/verifyUser",
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  var emailBody = MailGenerator.generate(email);

  let message = {
    from: ENV.EMAIL,
    to: userEmail,
    subject: subject || "Welcome to Mailgen!",
    html: emailBody,
  };

  transporter
    .sendMail(message)
    .then(() => {
      res.status(201).send({ msg: "Email Sent Successfully!" });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
};
