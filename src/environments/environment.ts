export const environment = {
  production: false,

  userApiBaseUrl: 'http://localhost:8080/api/v1/users',
  bookApiBaseUrl: 'http://localhost:8080/api/v1/books',
  noteApiBaseUrl: 'http://localhost:8080/api/v1/notes',

  /*
  Usage reCAPTCHA:
  1. Login to your goole account.
  2. Go to google.com/recaptcha/admin/create and configure it, click send, and you will get siteKey. */
  reCaptchaSiteKey: 'YOUR_siteKey',

  /*
  Usage EmailJS:
  1. Register at emailjs.com
  2. Go to Email Services. → Add New Service → and configure it. Now you have YOUR_SERVICE_ID.
  3. Go to Email Templates. → Create New Template → and configure it. Now you have YOUR_TEMPLATE_ID.
  4. Go to Account and get YOUR_PUBLIC_KEY. */
  emailJsPublicKey: 'YOUR_PUBLIC_KEY',
  emailJsServiceId: 'YOUR_SERVICE_ID',
  emailjJsTemplateId: 'YOUR_TEMPLATE_ID',
};
