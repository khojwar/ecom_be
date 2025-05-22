const e = require("express");
const { Status } = require("../../config/constant");
const cloudinarySvc = require("../../services/cloudinary.service");
const { randomStringGenerator } = require("../../utilities/helper");
const bcryptjs = require("bcryptjs");
const { AppConfig } = require("../../config/config");
const emailSvc = require("../../services/email.service");

class AuthService {
    async transformUserCreate(req) {
        try {
            const data = req.body;    // file data is not coming in req.body

            // const file = req.file;   // single file data is coming in req.file        // {path: '', filename: '', mimetype: '', size: '', ....}

            // const files = req.files;   // muliple file data is coming in req.files  

            // ///////////////////////////////
            // -----if file is compulsory -------
            // //////////////////////////////

            // if (!req.file) {
            //     throw {
            //         code: 400,
            //         detail: {image: "Image is required"},
            //         message: "Validation Failed",
            //         status: "VALIDATION_FAILED",
            //     }
            // }
            
            // data.image = await cloudinarySvc.fileUpload(req.file.path, '/user/');


            // ///////////////////////////////
            // -----if file is optional -------
            // //////////////////////////////

            if (req.file) {
                data.image = await cloudinarySvc.fileUpload(req.file.path, '/user/');
            }

            // hash password
            data.password = bcryptjs.hashSync(data.password, 12);

            // user Story --> register to login hudaa sammako process or user kasari activate huncha
            // eg. As a user, I should be able to register account in the application. For the activation, i will received the email where a link will be sent and by clicking the link i will be activated the link in the application.

            data.status = Status.INACTIVE;
            data.activationToken = randomStringGenerator(100)


            const {confirmPassword, ...mappedData} = data;

            return mappedData;
        } catch (exception) {
            console.log("TransformUserCreate: ", exception);
            throw exception;
        }

    }

    async sendActivationNotification(user) {
        try {

            const emailTemplate = `
<div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 32px 0;">
  <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 24px rgba(44,62,80,0.08); padding: 40px 32px; font-family: 'Segoe UI', Arial, sans-serif;">
    <div style="text-align: center;">
      <h1 style="color: #2d8cf0; margin-bottom: 8px; font-size: 2.2em;">Welcome, ${user.name}!</h1>
      <p style="color: #ff7e5f; font-size: 1.1em; margin-bottom: 24px;">We're thrilled to have you join <span style="color: #43cea2;">our E-Commerce Community</span>!</p>
    </div>
    <div style="background: linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%); border-radius: 10px; padding: 24px; margin-bottom: 28px;">
      <p style="color: #333; font-size: 1.08em; margin: 0 0 12px 0;">
        To get started, please activate your account by clicking the colorful button below:
      </p>
      <div style="text-align: center; margin: 18px 0;">
        <a href="${AppConfig.frontendUrl}/activate/${user.activationToken}" 
           style="background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%); color: #fff; text-decoration: none; padding: 14px 38px; border-radius: 30px; font-size: 1.15em; font-weight: bold; letter-spacing: 1px; box-shadow: 0 4px 16px rgba(67,206,162,0.15); display: inline-block;">
          Activate My Account
        </a>
      </div>
      <p style="color: #ff7e5f; font-size: 0.98em; margin: 0;">
        If the button doesn't work, simply copy and paste this link into your browser:<br>
        <span style="color: #2d8cf0;">${AppConfig.frontendUrl}/activate/${user.activationToken}</span>
      </p>
    </div>
    <div style="margin-bottom: 18px;">
      <p style="color: #333; font-size: 1em;">
        <span style="color: #43cea2; font-weight: bold;">Why activate?</span><br>
        Unlock exclusive deals, track your orders, and enjoy a seamless shopping experience!
      </p>
    </div>
    <div style="border-top: 1px solid #e0e0e0; padding-top: 18px; text-align: center;">
      <p style="color: #888; font-size: 0.95em;">
        With warm regards,<br>
        <span style="color: #2d8cf0; font-weight: bold;">The E-Commerce Team</span><br>
        <span style="font-size: 0.9em;">Please do not reply to this email. For help, contact our support team.</span>
      </p>
    </div>
  </div>
</div>
                `

            await emailSvc.sendEmail({
                to: user.email,
                sub: "🌟 Welcome to Our E-Commerce Family! Activate Your Account 🌟",
                msg: emailTemplate
            })
            
 
        } catch (exception) {
            throw exception;
        }
    }
}

const authServ = new AuthService();
module.exports = authServ;