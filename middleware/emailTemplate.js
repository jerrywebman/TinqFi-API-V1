const nodemailer = require("nodemailer");

var functions = {
  //INITIATE SIGNUP
  signup: function (generatedOTP, lowerCaseEmail) {
    const logoUrl = "https://i.imgur.com/1ioLR1r.png";

    let htmlWelcomeTemplate = `
             <!DOCTYPE html>
        <html>
        <body>
         <img src=${logoUrl} alt="Tinqlab Logo" style="display:block;width:150px;height:100px;margin-left:auto; margin-right:auto">
        <h3 style="margin:0.4em; margin-bottom:2em; text-align:center; color:black">Please confirm your email</h3>
        
        <p style="line-spacing:4px; text-align:left;color:black">Hello ,</p>
        <p style="line-spacing:4px; text-align:left;color:black">Please use this verification code to verify your email address.</p>
        <p style="font-weight:bold; text-align:left;color:black;font-size:1.5em;margin-bottom:2em">${generatedOTP}</p>
        <p style="font-size:3px;line-spacing:4px; text-allign:left;color:black;margin-bottom:3em"><span style="font-weight:bold">Note:</span> If you did not take this action, please contact us immediately at <span><a href="mailto:hello@comiblock.com">hello@tinqlab.com</a></span>.</p>
        <p style="font-size:2px;line-spacing:4px; text-allign:left; margin-top:2em;color:black">Powerful investment strategies that help you invest in crypto confidently, grow and manage your capital expertly, available on <span><a href="">Andriod</a></span>, and coming soon on IOS</p>
        </body>
        </html>
             `;
    //send an email here
    //step 1
    //ALLOW LESS SECURE APPS TO MAKE THIS WORK FOR GMAIL
    let transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      secure: true,
      port: 465,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    //step 2
    let mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: lowerCaseEmail,
      subject: "Please verify your email address",
      html: htmlWelcomeTemplate,
    };

    //step3
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email Sent");
      }
    });
  },

  //COMPLETE SIGNUP
  completeRegistration: function (lowerCaseEmail, nickname) {
    const logoUrl = "https://i.imgur.com/1ioLR1r.png";
    let htmlWelcomeTemplate = `
              <!DOCTYPE html>
              <html>
              <body>
              <img src=${logoUrl} alt="TinqFi Logo" style="display:block;width:150px;height:100px;margin-left:auto; margin-right:auto">
              <h3 style="margin:0.4em; text-align:center; color:black">Welcome to TinqFi</h3>
              
              <p style="line-spacing:4px; text-align:left;color:black">Hello ${nickname},</p>
              <p style="line-spacing:4px; text-align:left;color:black">Thank you for completing your registration today.</p>
              <p style="font-size:2px;line-spacing:4px; text-align:left; margin-top:2em;color:black">Powerful investment strategies that help you invest in crypto confidently, grow and manage your capital expertly, available on <span><a href="">Andriod</a></span>, and coming soon on IOS.</p>
              </body>
              </html>
             `;
    //send an email here
    //step 1
    //ALLOW LESS SECURE APPS TO MAKE THIS WORK FOR GMAIL
    let transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      secure: true,
      port: 465,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    //step 2
    let mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: lowerCaseEmail,
      subject: "Thank you for joining TinqFi",
      html: htmlWelcomeTemplate,
    };

    //step3
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email Sent");
      }
    });
  },

  //RECOVER ACCOUNT
  recover: function (generatedOTP, lowerCaseEmail, nickname) {
    const logoUrl = "https://i.imgur.com/1ioLR1r.png";
    let htmlRecoverTemplate = `
            <!DOCTYPE html>
            <html>
            <body>
            <img src=${logoUrl} alt="ComiBlock Logo" style="display:block;width:150px;height:100px;margin-left:auto; margin-right:auto">
            <h3 style="margin:0.4em; margin-bottom:2em; text-align:center; color:black">Please confirm your email</h3>
            
            <p style="line-spacing:4px; text-align:left;color:black">Hello ${nickname},</p>
            <p style="line-spacing:4px; text-align:left;color:black">Please use this verification code to verify your email address.</p>
            <p style="font-weight:bold; text-align:left;color:black;font-size:1.5em;margin-bottom:2em">${generatedOTP}</p>
            <p style="font-size:3px;line-spacing:4px; text-allign:left;color:black;margin-bottom:3em"><span style="font-weight:bold">Note:</span> If you did not take this action, please contact us immediately at <span><a href="mailto:hello@comiblock.com">hello@comiblock.com</a></span>.</p>
            <p style="font-size:2px;line-spacing:4px; text-allign:left; margin-top:2em;color:black">Powerful investment strategies that help you invest in crypto confidently, grow and manage your capital expertly, available on <span><a href="https://play.google.com/store/apps/details?id=com.sendVillageHQ.comi_block">Andriod</a></span>, and coming soon on IOS</p>
            </body>
            </html>
    `;
    let transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      secure: true,
      port: 465,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    //step 2
    let mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: lowerCaseEmail,
      subject: "OTP Notification - TinqFi",
      html: htmlRecoverTemplate,
    };

    //step3
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("error occurs");
      } else {
        console.log("Email Sent");
      }
    });
  },
};

module.exports = functions;
