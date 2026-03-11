const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
}
});
function sendEmail(to,subject,text){
    transporter.sendMail({
        to,
        subject,
        text
    });
}
module.exports = sendEmail;