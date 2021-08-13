const nodemailer = require("nodemailer");

module.exports = {
  sendmail: async (para, asunto, mensaje = "", mensaje_html = "") => {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER, // generated ethereal user
        pass: process.env.MAIL_PASSWORD, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `RESPALDO DE BASE DATOS AUTOMATICO <${process.env.MAIL_USER}>`, // sender address
      //  to: "bar@example.com, baz@example.com", // list of receivers
      to: para, // list of receivers

      subject: asunto, // Subject line
      text: mensaje, // plain text body
      html: mensaje_html, // html body
    });

    return info;
  },
};
