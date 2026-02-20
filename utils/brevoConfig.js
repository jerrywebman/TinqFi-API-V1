const brevo = require("@getbrevo/brevo");

const transactionalEmailApi = new brevo.TransactionalEmailsApi();

transactionalEmailApi.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO,
);

module.exports = {
  transactionalEmailApi,
  brevo,
};
