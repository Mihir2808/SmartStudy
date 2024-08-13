const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', 
      port:587, 
      auth: {
        user: 'mihirkathpal123@gmail.com',  // who sends the mail
        pass: 'mgluwswfleujxayr',  // app password of mihirkathpal2000   
      },
      secure: false,
    })

    let info = await transporter.sendMail({
      from: `"SmartStudy | Mihir"' mihirkathpal123@gmail.com'`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // html body
    })
    console.log(info.response)
    return info
  } catch (error) {
    console.log(error.message)
    return error.message
  }
}

module.exports = mailSender
