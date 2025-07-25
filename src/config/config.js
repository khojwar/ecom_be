require("dotenv").config();

const AppConfig = {
  CloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  CloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  CloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

  frontendUrl: process.env.FRONTEND_URL,

  jwtSecret: process.env.JWT_SECRET,
};

const SMTPConfig = {
  provider: process.env.SMTP_PROVIDER,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  from: process.env.SMTP_FROM,
}

const DBConfig = {
  mongoDBUrl: process.env.MONGODB_URI,
  mongoDBName: process.env.MONGODB_NAME,
}

const PaymentConfig = {
  khalti: {
    url: process.env.KHALTI_PAYMENT_URL,
    secretKey: process.env.KHALTI_SECRET_KEY,
  }
}

module.exports = {
  AppConfig,
  SMTPConfig,
  DBConfig,
  PaymentConfig
};
