const emailjs= require("@emailjs/nodejs");

const sendEMail = async (templateParams ) => {
    await emailjs
       .send(process.env.EMAILJS_SERVICE_ID, process.env.EMAILJS_TEMPLATE_ID, templateParams, {
         publicKey: process.env.EMAILJS_PUBLIC_KEY,
         privateKey: process.env.EMAILJS_PRIVATE_KEY, 
       }) ;
};

module.exports = sendEMail;