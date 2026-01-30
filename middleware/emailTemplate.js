// const nodemailer = require("nodemailer");
const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;
var apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SEND_IN_BLUE;

const tranEmailApi = new Sib.TransactionalEmailsApi();

var functions = {
  //Contact Us Email
  contactUs: function (name, email) {
    const sender = {
      name: "Tinqlab Technologies contact form",
      email: "info@tinqlab.com",
    };

    const recievers = [{ email: email }];
    let htmlWelcomeTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Contact Confirmation | Tinqlab</title>

    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      table {
        border-collapse: collapse;
      }
      p {
        margin: 0;
      }
      * {
        line-height: inherit;
      }
    </style>

    <link
      href="https://fonts.googleapis.com/css?family=Cabin:400,700"
      rel="stylesheet"
      type="text/css"
    />
  </head>

  <body class="clean-body">
    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f9f9f9">
      <tr>
        <td align="center">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            bgcolor="#ffffff"
            style="margin: 0 auto"
          >
            <!-- Header -->
            <tr>
              <td style="padding: 35px 55px; text-align: center">
                <p style="font-size: 22px; font-family: Cabin, sans-serif;">
                  <strong>Thanks for contacting Tinqlab</strong>
                </p>
              </td>
            </tr>

            <!-- Logo -->
            <tr>
              <td align="center" style="padding: 0 55px 20px">
                <img
                  src="https://www.tinqfi.com/images/logo-01.png"
                  alt="Tinqlab Logo"
                  style="width: 100%; max-width: 260px; height: auto"
                />
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding: 25px 55px 60px; font-family: Cabin, sans-serif">
                <p style="font-size: 15px; line-height: 160%; text-align: left">
                  Hello ${name},
                </p>

                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 15px;
                    text-align: left;
                  "
                >
                  We’ve received your message and appreciate you reaching out
                  to <strong>Tinqlab</strong>.
                </p>

                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 15px;
                    text-align: left;
                  "
                >
                  Our support team is currently reviewing your inquiry and will
                  get back to you as soon as possible—usually within
                  <strong>24 hours</strong>.
                </p>

                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 25px;
                    text-align: left;
                  "
                >
                  If your request is urgent, you can reply directly to this
                  email, and it will be routed to the appropriate team member.
                </p>

                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 35px;
                    text-align: left;
                  "
                >
                  Thank you for choosing Tinqlab. We look forward to assisting
                  you.
                </p>

                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 30px;
                    text-align: left;
                  "
                >
                  Warm regards,<br />
                  <strong>The Tinqlab Support Team</strong>
                </p>
              </td>
            </tr>
          </table>

          <!-- Footer spacing -->
          <table width="600" cellpadding="0" cellspacing="0">
            <tr>
              <td style="height: 30px"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

    tranEmailApi
      .sendTransacEmail({
        sender,
        to: recievers,
        subject: "Thank you for reaching out - Tinqlab Technologies",
        htmlContent: htmlWelcomeTemplate,
      })
      .then(console.log("email sent successfully"))
      .catch((e) => console.log("error occured", e));
  },

  adminContactUs: function (
    name,
    email,
    phoneNumber,
    industry,
    budget,
    message,
  ) {
    const sender = {
      name: "Tinqlab Technologies",
      email: "info@tinqlab.com",
    };

    const recievers = [{ email: "info@tinqlab.com" }];
    let htmlWelcomeTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Contact Confirmation | Tinqlab</title>

    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      table {
        border-collapse: collapse;
      }
      p {
        margin: 0;
      }
      * {
        line-height: inherit;
      }
    </style>

    <link
      href="https://fonts.googleapis.com/css?family=Cabin:400,700"
      rel="stylesheet"
      type="text/css"
    />
  </head>

  <body class="clean-body">
    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f9f9f9">
      <tr>
        <td align="center">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            bgcolor="#ffffff"
            style="margin: 0 auto"
          >
            <!-- Header -->
            <tr>
              <td style="padding: 35px 55px; text-align: center">
                <p style="font-size: 22px; font-family: Cabin, sans-serif;">
                  <strong>Thanks for contacting Tinqlab</strong>
                </p>
              </td>
            </tr>

            <!-- Logo -->
            <tr>
              <td align="center" style="padding: 0 55px 20px">
                <img
                  src="https://www.tinqfi.com/images/logo-01.png"
                  alt="Tinqlab Logo"
                  style="width: 100%; max-width: 260px; height: auto"
                />
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding: 25px 55px 60px; font-family: Cabin, sans-serif">
                <p style="font-size: 15px; line-height: 160%; text-align: left">
                  Hello Admin,
                </p>

                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 15px;
                    text-align: left;
                  "
                >
                  We’ve received a message from a client. Please see the details below <strong>Tinqlab</strong>.
                </p>

                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 15px;
                    text-align: left;
                  "
                >
                  Name: ${name}
                </p>
                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 15px;
                    text-align: left;
                  "
                >
                  Email: ${email}
                </p>
                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 15px;
                    text-align: left;
                  "
                >
                  Phone Number: ${phoneNumber}
                </p>
                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 15px;
                    text-align: left;
                  "
                >
                  Industry: ${industry}
                </p>
                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 15px;
                    text-align: left;
                  "
                >
                  Budget: ${budget}
                </p>
                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 15px;
                    text-align: left;
                  "
                >
                  Message: ${message}
                </p>

                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 25px;
                    text-align: left;
                  "
                >
                  Please reachout to this client as soon as possible
                </p>

                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 35px;
                    text-align: left;
                  "
                >
                  Thank you for choosing Tinqlab. We look forward to assisting
                  you.
                </p>

                <p
                  style="
                    font-size: 15px;
                    line-height: 160%;
                    margin-top: 30px;
                    text-align: left;
                  "
                >
                  Warm regards,<br />
                  <strong>The Tinqlab Support Team</strong>
                </p>
              </td>
            </tr>
          </table>

          <!-- Footer spacing -->
          <table width="600" cellpadding="0" cellspacing="0">
            <tr>
              <td style="height: 30px"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

    tranEmailApi
      .sendTransacEmail({
        sender,
        to: recievers,
        subject: "We have a lead - Tinqlab Technologies",
        htmlContent: htmlWelcomeTemplate,
      })
      .then(console.log("email sent successfully"))
      .catch((e) => console.log("error occured", e));
  },
};

module.exports = functions;
