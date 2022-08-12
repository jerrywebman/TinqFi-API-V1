// const nodemailer = require("nodemailer");
const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;
var apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SEND_IN_BLUE;

const tranEmailApi = new Sib.TransactionalEmailsApi();

var functions = {
  //INITIATE SIGNUP
  signup: function (generatedOTP, lowerCaseEmail) {
    const sender = {
      name: "TinqFi",
      email: "jerrycifeanyi@gmail.com",
    };

    const recievers = [{ email: lowerCaseEmail }];
    const logoUrl = "https://i.imgur.com/pViIJBH.png";
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

    tranEmailApi
      .sendTransacEmail({
        sender,
        to: recievers,
        subject: "Please verify your email address",
        htmlContent: htmlWelcomeTemplate,
      })
      .then(console.log("email sent successfully"))
      .catch((e) => console.log("error occured", e));
  },

  //COMPLETE SIGNUP
  completeRegistration: function (lowerCaseEmail, nickname) {
    const sender = {
      name: "TinqFi",
      email: "jerrycifeanyi@gmail.com",
    };

    const recievers = [{ email: lowerCaseEmail }];

    const logoUrl = "https://i.imgur.com/pViIJBH.png";
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

    tranEmailApi
      .sendTransacEmail({
        sender,
        to: recievers,
        subject: "Thank you for joining TinqFi",
        htmlContent: htmlWelcomeTemplate,
      })
      .then(console.log("email sent successfully"))
      .catch((e) => console.log("error occured", e));
  },

  //RECOVER ACCOUNT
  recover: function (generatedOTP, lowerCaseEmail) {
    const sender = {
      name: "TinqFi",
      email: "jerrycifeanyi@gmail.com",
    };

    const recievers = [{ email: lowerCaseEmail }];
    const logoUrl = "https://i.imgur.com/pViIJBH.png";
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

    tranEmailApi
      .sendTransacEmail({
        sender,
        to: recievers,
        subject: "Please verify your email address",
        htmlContent: htmlWelcomeTemplate,
      })
      .then(console.log("email sent successfully"))
      .catch((e) => console.log("error occured", e));
  },
};

module.exports = functions;
