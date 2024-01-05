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
      email: "info@tinqfi.com",
    };

    const recievers = [{ email: lowerCaseEmail }];
    let htmlWelcomeTemplate = `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
    <title></title>
    <style type="text/css">
      @media only screen and (min-width: 620px) {
        .u-row {
          width: 600px !important;
        }
        .u-row .u-col {
          vertical-align: top;
        }
        .u-row .u-col-100 {
          width: 600px !important;
        }
      }

      @media (max-width: 620px) {
        .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
        .u-row .u-col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
        }
        .u-row {
          width: 100% !important;
        }
        .u-col {
          width: 100% !important;
        }
        .u-col > div {
          margin: 0 auto;
        }
      }

      body {
        margin: 0;
        padding: 0;
      }

      table,
      tr,
      td {
        vertical-align: top;
        border-collapse: collapse;
      }

      p {
        margin: 0;
      }

      .ie-container table,
      .mso-container table {
        table-layout: fixed;
      }

      * {
        line-height: inherit;
      }

      a[x-apple-data-detectors="true"] {
        color: inherit !important;
        text-decoration: none !important;
      }

      table,
      td {
        color: #000000;
      }

      @media (max-width: 480px) {
        #u_content_text_6 .v-line-height {
          line-height: 100% !important;
        }
        #u_content_image_3 .v-container-padding-padding {
          padding: 0px !important;
        }
        #u_content_image_3 .v-src-width {
          width: auto !important;
        }
        #u_content_image_3 .v-src-max-width {
          max-width: 42% !important;
        }
        #u_content_text_7 .v-container-padding-padding {
          padding: 19px !important;
        }
        #u_content_text_7 .v-line-height {
          line-height: 130% !important;
        }
        #u_content_button_1 .v-container-padding-padding {
          padding: 9px !important;
        }
        #u_content_button_1 .v-button-colors {
          color: #ffffff !important;
          background-color: #00a200 !important;
        }
        #u_content_button_1 .v-button-colors:hover {
          color: #ffffff !important;
          background-color: #3aaee0 !important;
        }
        #u_content_button_1 .v-size-width {
          width: 71% !important;
        }
        #u_content_button_1 .v-font-size {
          font-size: 13px !important;
        }
        #u_content_button_1 .v-text-align {
          text-align: right !important;
        }
        #u_content_button_1 .v-line-height {
          line-height: 100% !important;
        }
      }
    </style>

    <link
      href="https://fonts.googleapis.com/css?family=Cabin:400,700"
      rel="stylesheet"
      type="text/css"
    />
  </head>

  <body
    class="clean-body"
    style="
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      background-color: #f9f9f9;
      color: #000000;
    "
  >
    <table
      id=""
      style="
        border-collapse: collapse;
        table-layout: fixed;
        border-spacing: 0;
        vertical-align: top;
        min-width: 320px;
        margin: 0 auto;
        background-color: #f9f9f9;
        width: 100%;
      "
      cellpadding="0"
      cellspacing="0"
    >
      <tbody>
        <tr style="vertical-align: top">
          <td
            style="
              word-break: break-word;
              border-collapse: collapse !important;
              vertical-align: top;
            "
          >
            <div
              class="u-row-container"
              style="padding: 0px; background-color: transparent"
            >
              <div
                class="u-row"
                style="
                  margin: 0 auto;
                  min-width: 320px;
                  max-width: 600px;
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                  word-break: break-word;
                  background-color: #ffffff;
                "
              >
                <div
                  style="
                    border-collapse: collapse;
                    display: table;
                    width: 100%;
                    height: 100%;
                    background-color: transparent;
                  "
                >
                  <div
                    class="u-col u-col-100"
                    style="
                      max-width: 320px;
                      min-width: 600px;
                      display: table-cell;
                      vertical-align: top;
                    "
                  >
                    <div style="height: 100%; width: 100% !important">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="
                          box-sizing: border-box;
                          height: 100%;
                          padding: 0px;
                          border-top: 0px solid transparent;
                          border-left: 0px solid transparent;
                          border-right: 0px solid transparent;
                          border-bottom: 0px solid transparent;
                        "
                      >
                        <!--<![endif]-->

                        <table
                          id="u_content_text_6"
                          role="presentation"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                                style="
                                  overflow-wrap: break-word;
                                  word-break: break-word;
                                  padding: 33px 55px;
                                "
                                align="left"
                              >
                                <div
                                  class="v-text-align v-line-height v-font-size"
                                  style="
                                    line-height: 160%;
                                    text-align: center;
                                    word-wrap: break-word;
                                  "
                                >
                                  <p style="font-size: 14px; line-height: 100%">
                                    <span
                                      style="font-size: 20px; line-height: 20px"
                                      ><strong
                                        ><span style="line-height: 20px"
                                          >Welcome to TinqFi</span
                                        ></strong
                                      >
                                    </span>
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div style="padding-left: 10rem; padding-right: 10rem">
                          <img
                            align="center"
                            border="0"
                            src="https://www.tinqfi.com/images/logo-01.png"
                            alt=""
                            title=""
                            style="
                              outline: none;
                              text-decoration: none;
                              -ms-interpolation-mode: bicubic;
                              clear: both;
                              display: inline-block !important;
                              border: none;
                              height: auto;
                              float: none;
                              width: 100%;
                              max-width: 580px;
                            "
                            width="580"
                            class="v-src-width v-src-max-width"
                          />
                        </div>

                        <table
                          id="u_content_text_7"
                          role="presentation"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                                style="
                                  overflow-wrap: break-word;
                                  word-break: break-word;
                                  padding: 33px 55px 60px;
                                "
                              >
                                <div
                                  class="v-text-align v-line-height v-font-size"
                                  style="
                                    line-height: 160%;
                                    text-align: center;
                                    word-wrap: break-word;
                                  "
                                >
                                  <p
                                    style="line-height: 130%; text-align: left"
                                  >

                                  </p>

                                  <p
                                    style="line-height: 130%; text-align: left"
                                  >
                                    <span
                                      style="
                                          sans-serif;
                                        line-height: 18.2px;
                                      "
                                      >Thank you for joining Us. Please verify
                                      your email using this 4 digit code. </span
                                    ><br />
                                  </p>
                                  <p
                                    style="
                                      line-height: 130%;
                                      text-align: center;
                                      margin-bottom: 1.5rem;
                                      font-weight: bolder;
                                      font-size: 1.5rem;
                                    "
                                  >
                                    ${generatedOTP}
                                  </p>
                                  <p
                                    style="
                                      line-height: 130%;
                                      text-align: left;
                                      margin-top: 2rem;
                                    "
                                  >
                                    <span
                                      style="
                                          sans-serif;
                                        line-height: 18.2px;
                                      "
                                      >xxxxxxxxxxxx have any questions or
                                      comments, please do not hesitate to reach
                                      out to us. Our team is always ready to
                                      help.</span
                                    >
                                  </p>
                                  <p
                                    style="line-height: 130%; text-align: left"
                                  >
                                     
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
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
      email: "info@tinqfi.com",
    };

    const recievers = [{ email: lowerCaseEmail }];

    const logoUrl = "https://i.imgur.com/pViIJBH.png";
    let htmlWelcomeTemplate = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300&family=Mulish:wght@300&display=swap"
      rel="stylesheet"
    />
    <title></title>
    <style type="text/css">
      @media only screen and (min-width: 620px) {
        .u-row {
          width: 600px !important;
        }
        .u-row .u-col {
          vertical-align: top;
        }
        .u-row .u-col-100 {
          width: 600px !important;
        }
      }

      @media (max-width: 620px) {
        .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
        .u-row .u-col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
        }
        .u-row {
          width: 100% !important;
        }
        .u-col {
          width: 100% !important;
        }
        .u-col > div {
          margin: 0 auto;
        }
      }

      body {
        font-family: Mulish;
        margin: 0;
        padding: 0;
      }

      table,
      tr,
      td {
        vertical-align: top;
        border-collapse: collapse;
      }

      p {
        margin: 0;
      }

      .ie-container table,
      .mso-container table {
        table-layout: fixed;
      }

      * {
        line-height: inherit;
      }

      a[x-apple-data-detectors="true"] {
        color: inherit !important;
        text-decoration: none !important;
      }

      table,
      td {
        color: #000000;
      }

      @media (max-width: 480px) {
        #u_content_text_6 .v-line-height {
          line-height: 100% !important;
        }
        #u_content_image_3 .v-container-padding-padding {
          padding: 0px !important;
        }
        #u_content_image_3 .v-src-width {
          width: auto !important;
        }
        #u_content_image_3 .v-src-max-width {
          max-width: 42% !important;
        }
        #u_content_text_7 .v-container-padding-padding {
          padding: 19px !important;
        }
        #u_content_text_7 .v-line-height {
          line-height: 130% !important;
        }
        #u_content_button_1 .v-container-padding-padding {
          padding: 9px !important;
        }
        #u_content_button_1 .v-button-colors {
          color: #ffffff !important;
          background-color: #00a200 !important;
        }
        #u_content_button_1 .v-button-colors:hover {
          color: #ffffff !important;
          background-color: #3aaee0 !important;
        }
        #u_content_button_1 .v-size-width {
          width: 71% !important;
        }
        #u_content_button_1 .v-font-size {
          font-size: 13px !important;
        }
        #u_content_button_1 .v-text-align {
          text-align: right !important;
        }
        #u_content_button_1 .v-line-height {
          line-height: 100% !important;
        }
      }
      .footer-1 {
        background-color: #fff7ea;
        width: 100%;
        border-radius: 10px;
        margin-top: 20px;
        padding: 20px;
        color: #888888 !important;
        font-size: 14px !important;
      }
      .footer-1 strong {
        color: #237bf1;
        font-weight: 700;
      }

      .image {
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
        clear: both;
        display: inline-block !important;
        border: none;
        height: auto;
        float: none;
        width: 100%;
        padding: 1rem !important;
        max-width: 580px;
      }

      .header {
        margin-top: 2rem;
        margin-bottom: 2rem;
        font-size: 30px;
        text-align: center !important;
      }

      .footer {
        height: 100px;
        width: 50%;
        background-color: #fff7ea;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        justify-content: space-between;
        border-radius: 8px;
      }

      .footer-text {
        font-weight: 20px;
        font-weight: bolder;
        color: #b4adad;
        margin-bottom: 1rem;
      }
      .footer-copyright {
        font-weight: 10px;
        color: #b4adad;
      }
      .footer-connected {
        color: rgba(252, 173, 42, 1);
        font-weight: bolder;
      }

      .footer img {
        height: 100%;
        width: 200px;
        object-fit: cover;
      }
      .footer h3 {
        width: 400px;
        font-weight: 700;
        font-size: 30px;
      }

      .footer-holder {
        width: 100%;
        text-align: center;
        justify-content: center;
        align-items: center;
        text-transform: capitalize;
      }
      .footer-holder h3 {
        font-size: 15px;
      }

      .icon-holder {
        justify-content: center;
        align-items: center;
        width: 200px;
      }
      .icon-holder div {
        height: 30px;
        width: 30px;
        background-color: #ececec;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
    <link
      href="https://fonts.googleapis.com/css?family=Cabin:400,700"
      rel="stylesheet"
      type="text/css"
    />
  </head>

  <body
    class="clean-body"
    style="
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      background-color: #f9f9f9;
      color: #000000;
    "
  >
    <table
      id=""
      style="
        border-collapse: collapse;
        table-layout: fixed;
        border-spacing: 0;
        vertical-align: top;
        min-width: 320px;
        margin: 0 auto;
        background-color: #f9f9f9;
        width: 100%;
      "
      cellpadding="0"
      cellspacing="0"
    >
      <tbody>
        <tr style="vertical-align: top">
          <td
            style="
              word-break: break-word;
              border-collapse: collapse !important;
              vertical-align: top;
            "
          >
            <div
              class="u-row-container"
              style="padding: 0px; background-color: transparent"
            >
              <div
                class="u-row"
                style="
                  margin: 0 auto;
                  min-width: 320px;
                  max-width: 600px;
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                  word-break: break-word;
                  background-color: #ffffff;
                "
              >
                <div
                  style="
                    border-collapse: collapse;
                    display: table;
                    width: 100%;
                    height: 100%;
                    background-color: transparent;
                  "
                >
                  <div
                    class="u-col u-col-100"
                    style="
                      max-width: 320px;
                      min-width: 600px;
                      display: table-cell;
                      vertical-align: top;
                    "
                  >
                    <div style="height: 100%; width: 100% !important">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="
                          box-sizing: border-box;
                          height: 100%;
                          padding: 0px;
                          border-top: 0px solid transparent;
                          border-left: 0px solid transparent;
                          border-right: 0px solid transparent;
                          border-bottom: 0px solid transparent;
                        "
                      >
                        <!--<![endif]-->

                        <table
                          id="u_content_text_6"
                          role="presentation"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                                style="
                                  overflow-wrap: break-word;
                                  word-break: break-word;
                                  padding: 33px 55px;
                                "
                                align="left"
                              >
                                <div
                                  class="v-text-align v-line-height v-font-size"
                                  style="
                                    line-height: 160%;
                                    text-align: center;
                                    word-wrap: break-word;
                                  "
                                >
                                  <p
                                    style="
                                      font-size: 14px;
                                      line-height: 100%;
                                      margin-bottom: 1rem;
                                    "
                                  >
                                    <span
                                      style="font-size: 20px; line-height: 20px"
                                      ><strong
                                        ><span style="line-height: 20px"
                                          >Hi ${nickname}</span
                                        ></strong
                                      >
                                    </span>
                                  </p>
                                  <p style="font-size: 14px; line-height: 100%">
                                    <span style="line-height: 20px"
                                      ><span style="line-height: 20px"
                                        >Welcome to the super crypto app by
                                        TinqFi.</span
                                      >
                                    </span>
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div>
                          <img
                            align="center"
                            border="0"
                            src="https://i.imgur.com/95GaF16.png"
                            alt="Tinqfi landing Image"
                            class="v-src-width v-src-max-width image"
                          />
                        </div>

                        <table
                          id="u_content_text_7"
                          role="presentation"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                                style="
                                  overflow-wrap: break-word;
                                  word-break: break-word;
                                  padding: 33px 55px 60px;
                                "
                              >
                                <div
                                  class="v-text-align v-line-height v-font-size"
                                  style="
                                    line-height: 160%;
                                    text-align: center;
                                    word-wrap: break-word;
                                  "
                                >
                                  <p class="header">Welcome to TinqFi</p>
                                  <p
                                    style="
                                      line-height: 130%;
                                      text-align: left;
                                      margin-top: 1rem;
                                    "
                                  >
                                    The best place to supercharge your crypto.
                                    Over the next few days we'll send you a
                                    short series of emails to help you get
                                    started. We are excited to share this
                                    journey with you
                                  </p>
                                  <a
                                    href="https://tinqfi.com"
                                    target="_blank"
                                    class="v-button v-size-width v-button-colors v-font-size"
                                    style="
                                      box-sizing: border-box;
                                      display: inline-block;
                                      text-decoration: none;
                                      -webkit-text-size-adjust: none;
                                      text-align: center;
                                      color: black !important;
                                      background-color: #fcad2a;
                                      border-radius: 5px;
                                      -webkit-border-radius: 4px;
                                      -moz-border-radius: 4px;
                                      width: auto;
                                      max-width: 100%;
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      word-wrap: break-word;
                                      font-size: 14px;
                                      margin-top: 1rem;
                                    "
                                  >
                                    <span
                                      class="v-line-height"
                                      style="
                                        display: block;
                                        padding: 14px 44px 13px;
                                        line-height: 120%;
                                      "
                                      ><span style="line-height: 14px"
                                        ><strong
                                          ><span style="line-height: 14px"
                                            >Get Started</span
                                          ></strong
                                        >
                                      </span>
                                    </span>
                                  </a>
                                  <div class="footer-1">
                                    <h3>
                                      Download the latest version of the TinqFi
                                      App for the best experience
                                    </h3>
                                    <div>
                                      <!-- <a href="#" target="_blank" rel="noreferrer"><img src="./Image/Aivalable.png" /></a> -->
                                      <a
                                        href="#"
                                        target="_blank"
                                        rel="noreferrer"
                                        ><img
                                          src="https://imgur.com/nZdDDaH.png"
                                      /></a>
                                    </div>
                                    <h3>
                                      If you have any questions or suggestions,
                                      please contact us by email at <br />
                                      <strong
                                        ><a href="mailto:Support@tinqfi.com"
                                          >support@tinqfi.com</a
                                        ></strong
                                      >
                                    </h3>
                                  </div>
                                </div>
                                <hr />
                                <footer class="footer-holder">
                                  <h3 class="footer-connected">
                                    stay connected
                                  </h3>
                                  <div class="icon-holder">
                                    <a
                                      href="https://facebook.com/tinqfi"
                                      target="_blank"
                                      rel="noreferrer"
                                      ><img src="https://imgur.com/PpIWFcI.png"
                                    /></a>
                                    <a
                                      href="https://twitter.com/tinqfi"
                                      target="_blank"
                                      rel="noreferrer"
                                      ><img src="https://imgur.com/tRqCHwQ.png"
                                    /></a>
                                    <a
                                      href="https://instagram.com/tinqfi"
                                      target="_blank"
                                      rel="noreferrer"
                                      ><img src="https://imgur.com/hurHRR2.png"
                                    /></a>
                                    <a
                                      href="https://linkedin.com/company/tinqfi"
                                      target="_blank"
                                      rel="noreferrer"
                                      ><img src="https://imgur.com/fptQhZM.png"
                                    /></a>
                                    <a
                                      href="https://t.me/Tinqfi"
                                      target="_blank"
                                      rel="noreferrer"
                                      ><img src="https://imgur.com/Sa6K9dTpng"
                                    /></a>
                                  </div>
                                  <p class="footer-text">Crypto on Steroids</p>
                                  <p class="footer-copyright">
                                    Copyright © 2023 TinqFi
                                  </p>
                                </footer>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
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
      email: "info@tinqfi.com",
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

  //CONFIRM WITHDRAWAL
  verifyWithdrawal: function (generatedOTP, lowerCaseEmail) {
    const sender = {
      name: "TinqFi",
      email: "info@tinqfi.com",
    };

    const recievers = [{ email: lowerCaseEmail }];
    const logoUrl = "https://i.imgur.com/pViIJBH.png";
    let htmlWelcomeTemplate = `
             <!DOCTYPE html>
        <html>
        <body>
         <img src=${logoUrl} alt="Tinqlab Logo" style="display:block;width:150px;height:100px;margin-left:auto; margin-right:auto">
        <h3 style="margin:0.4em; margin-bottom:2em; text-align:center; color:black">Please confirm your Withdrawal</h3>
        
        <p style="line-spacing:4px; text-align:left;color:black">Hello ,</p>
        <p style="line-spacing:4px; text-align:left;color:black">Please use this verification code to confirm your withdrawal request.</p>
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
