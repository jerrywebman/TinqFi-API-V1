const { transactionalEmailApi, brevo } = require("../utils/brevoConfig");

var functions = {
  //Contact Us Email

  contactUsZamafit: async function (name, email) {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    const safeName = String(name || "").trim();
    const safeEmail = String(email || "")
      .trim()
      .toLowerCase();

    // Basic validation
    if (!safeName || !safeEmail) {
      throw new Error("A valid recipient name and email are required.");
    }

    // Escape user-provided text before inserting it into HTML.
    const escapeHtml = (value) =>
      String(value).replace(/[&<>"']/g, (char) => {
        const entities = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };

        return entities[char];
      });

    const recipientName = escapeHtml(safeName);

    sendSmtpEmail.sender = {
      name: "Zamafit Rehab Centre",
      email: "admin@zamafit.co.uk",
    };

    sendSmtpEmail.to = [
      {
        email: safeEmail,
        name: safeName,
      },
    ];

    sendSmtpEmail.replyTo = {
      email: "admin@zamafit.co.uk",
      name: "Zamafit Rehab Centre",
    };

    sendSmtpEmail.subject = "We've received your message | Zamafit";

    sendSmtpEmail.htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Contact Confirmation | Zamafit</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#252525;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f5f7;">
    <tr>
      <td align="center" style="padding:30px 12px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#131313;padding:30px 24px;">
              <img
                src="https://i.imgur.com/Xi5h94x.png"
                alt="Zamafit Rehab Centre"
                width="220"
                style="display:block;width:100%;max-width:220px;height:auto;border:0;"
              />
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding:36px 32px 24px;">

              <p style="margin:0 0 12px;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#777777;">
                Contact confirmation
              </p>

              <h1 style="margin:0 0 22px;font-size:28px;line-height:1.3;color:#131313;">
                Thank you for reaching out!
              </h1>

              <p style="margin:0 0 18px;font-size:16px;line-height:1.8;">
                Hello ${recipientName},
              </p>

              <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#444444;">
                Thank you for contacting <strong>Zamafit Rehab Centre</strong>.
                We've successfully received your message, and we appreciate
                you taking the time to get in touch.
              </p>

              <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#444444;">
                Our team will review your enquiry and get back to you as soon
                as possible, usually within 24 hours.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8f8f8;border-left:4px solid #131313;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0;font-size:14px;line-height:1.8;color:#555555;">
                      <strong>Need to add more information?</strong><br />
                      Simply reply to this email and our team will be happy
                      to assist you.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:15px;line-height:1.8;color:#444444;">
                Thank you for choosing Zamafit. We look forward to helping you
                on your journey to better movement and wellbeing.
              </p>

              <p style="margin:28px 0 0;font-size:15px;line-height:1.8;color:#444444;">
                Warm regards,<br />
                <strong style="color:#131313;">The Zamafit Team</strong><br />
                Zamafit Rehab Centre
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:22px 24px;background-color:#f8f8f8;border-top:1px solid #eeeeee;">
              <p style="margin:0 0 8px;font-size:12px;line-height:1.7;color:#777777;">
                Zamafit Rehab Centre
              </p>

              <p style="margin:0;font-size:12px;line-height:1.7;color:#999999;">
                This is an automated confirmation of your enquiry.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
      const response =
        await transactionalEmailApi.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
      console.error("Brevo error:", error.response?.body || error);
    }
  },

  adminContactUsZamafit: async function (name, email, phone, subject, message) {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    // Escape user input before inserting it into HTML.
    const escapeHtml = (value) =>
      String(value ?? "").replace(/[&<>"']/g, (char) => {
        const entities = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };

        return entities[char];
      });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    sendSmtpEmail.sender = {
      name: "Zamafit Rehab Centre",
      email: "admin@zamafit.co.uk",
    };

    sendSmtpEmail.to = [
      {
        email: "admin@zamafit.co.uk",
        name: "Zamafit Rehab Centre",
      },
    ];

    // Allow the admin to reply directly to the customer.
    sendSmtpEmail.replyTo = {
      email: String(email).trim(),
      name: String(name).trim(),
    };

    sendSmtpEmail.subject = `New Contact Enquiry: ${String(subject).trim()}`;

    sendSmtpEmail.htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>New Contact Enquiry | Zamafit</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#252525;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f5f7;">
    <tr>
      <td align="center" style="padding:30px 12px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#131313;padding:28px 24px;">
              <img
                src="https://i.imgur.com/Xi5h94x.png"
                alt="Zamafit Rehab Centre"
                width="220"
                style="display:block;width:100%;max-width:220px;height:auto;border:0;"
              />
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:32px 30px 12px;">
              <p style="margin:0 0 10px;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#777777;">
                Website contact form
              </p>

              <h1 style="margin:0;font-size:26px;line-height:1.4;color:#131313;">
                New Contact Enquiry
              </h1>

              <p style="margin:12px 0 0;font-size:15px;line-height:1.8;color:#555555;">
                A visitor has submitted a new enquiry through the Zamafit website.
                Please review the details below and follow up as appropriate.
              </p>
            </td>
          </tr>

          <!-- Contact details -->
          <tr>
            <td style="padding:20px 30px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e8e8e8;border-radius:10px;">

                <tr>
                  <td style="padding:16px;border-bottom:1px solid #eeeeee;width:130px;font-size:14px;font-weight:bold;color:#555555;">
                    Full name
                  </td>
                  <td style="padding:16px;border-bottom:1px solid #eeeeee;font-size:14px;line-height:1.7;color:#222222;overflow-wrap:anywhere;">
                    ${safeName}
                  </td>
                </tr>

                <tr>
                  <td style="padding:16px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                    Email address
                  </td>
                  <td style="padding:16px;border-bottom:1px solid #eeeeee;font-size:14px;line-height:1.7;overflow-wrap:anywhere;">
                    <a href="mailto:${safeEmail}" style="color:#1769aa;text-decoration:none;">
                      ${safeEmail}
                    </a>
                  </td>
                </tr>

                <tr>
                  <td style="padding:16px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                    Phone number
                  </td>
                  <td style="padding:16px;border-bottom:1px solid #eeeeee;font-size:14px;line-height:1.7;color:#222222;">
                    ${safePhone}
                  </td>
                </tr>

                <tr>
                  <td style="padding:16px;font-size:14px;font-weight:bold;color:#555555;">
                    Subject
                  </td>
                  <td style="padding:16px;font-size:14px;line-height:1.7;color:#222222;">
                    ${safeSubject}
                  </td>
                </tr>

              </table>

              <!-- Message -->
              <h2 style="margin:28px 0 12px;font-size:18px;line-height:1.5;color:#131313;">
                Customer message
              </h2>

              <div style="padding:20px;background-color:#f8f8f8;border-left:4px solid #131313;border-radius:4px;font-size:14px;line-height:1.9;color:#444444;overflow-wrap:anywhere;white-space:pre-wrap;">${safeMessage}</div>

              <p style="margin:26px 0 0;font-size:14px;line-height:1.8;color:#555555;">
                <strong>Next step:</strong> Please contact the customer using
                the details provided above.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:22px 24px;background-color:#f8f8f8;border-top:1px solid #eeeeee;">
              <p style="margin:0 0 8px;font-size:12px;line-height:1.7;color:#777777;">
                Zamafit Rehab Centre
              </p>

              <p style="margin:0;font-size:12px;line-height:1.7;color:#999999;">
                Automated notification from your website contact form.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

    // Plain-text fallback for email clients that don't render HTML.
    sendSmtpEmail.textContent = [
      "NEW CONTACT ENQUIRY - ZAMAFIT",
      "",
      `Name: ${String(name ?? "")}`,
      `Email: ${String(email ?? "")}`,
      `Phone: ${String(phone ?? "")}`,
      `Subject: ${String(subject ?? "")}`,
      "",
      "MESSAGE:",
      String(message ?? ""),
      "",
      "Please follow up with the customer.",
    ].join("\n");

    try {
      const response =
        await transactionalEmailApi.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
      console.error("Brevo error:", error.response?.body || error);
    }
  },
};

module.exports = functions;
