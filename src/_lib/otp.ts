import { createTransport, SendMailOptions } from "nodemailer";
import { Request, Response, NextFunction } from 'express'
const Mailgen = require('mailgen')

export const generateOtp = (email: string) => {
  try {
    let otp = Math.floor(1000 + Math.random() * 9000).toString();

    let createdAt = Date.now();

    const transporter = createTransport({
      service: "Gmail",
      auth: {
        user: process.env.email,
        pass: process.env.googlePsw,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
      } else {

      }
    });

    const sendOTPemail = (otp: string) => {

      const mailOptions = {
        from: "rafikandathuvayal@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending OTP:", error);
        } else {

        }
      });
    };

    sendOTPemail(otp)

    return { otp, createdAt }
  } catch (error) {
    console.log(error);
  }
};


export const sendVerificationEmail = async (email: string, token: any) => {
  const config = {
    service: 'gmail',
    auth: {
      user: process.env.email,
      pass: process.env.googlePsw
    }
  };
  const transport = createTransport(config);
  const MailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: "hiveHub",
      link: 'https://mailgen.js/'
    }
  });
  const responsePage = {
    body: {
      name: "Email Conformation Success!",
      intro: `Dear User,

        Your security is our utmost concern. To ensure the safety of your account, we kindly request you to verify your email address and reset your password using the following steps:
        Click the below button. 
        You will be directed to a secure page where you can confirm your email address.
        After email verification, you'll be prompted to set a new password for your account.
        
        Please note that the verification link is only valid for the next 10 minutes for security reasons. If you don't complete the process within this time frame, you may need to request another email.`,
      action: {
        button: {
          color: '#22BC66',
          text: 'Change Your Password',
          link: `http://localhost:5173/reset-password?token=${token}`
        }
      },
      outro: "Thank you for choosing us, and we appreciate your trust in our services"
    }
  };
  const mail = MailGenerator.generate(responsePage);
  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Reset Password',
    html: mail
  };


  try {
    await transport.sendMail(message);
    return { status: "ok" };
  } catch (error: any) {
    return { status: "failed", message: error?.message };
  }
}






