import nodemailer, { SendMailOptions, SentMessageInfo } from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendMail = (options: SendMailOptions, cb?: (err: Error | null, info: SentMessageInfo) => void) => {
  if (process.env.NODE_ENV === 'production') {
    // Find better solution
    return cb ? transporter.sendMail(options, cb) : transporter.sendMail(options) 
  }
  console.log('Mail send skipped for not production env with options:', options)
  return;
}

export default transporter;
