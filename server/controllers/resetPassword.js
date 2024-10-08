const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

// reset password token -> link generate and send mail 
exports.resetPasswordToken = async (req, res) => {
  // steps :
  try {
    // get email for req body
    const email = req.body.email  // input me email given hoga
    // check user fro this email. email verification 
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      })
    }

    // generate token
    const token = crypto.randomBytes(20).toString("hex")
    
    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    )
    console.log("DETAILS", updatedDetails)
    // create url
  // send mail containing the url
    const url = `http://localhost:3000/update-password/${token}`
    // const url = `https://studynotion-edtech-project.vercel.app/update-password/${token}`
// 
    await mailSender(
      email,
      "Password Reset",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    )

    return res.status(200).json({
      success: true,
      message:
        "Email Sent Successfully, Please Check Your Email to Continue Further",
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset Message`,
    })
  }
}



// reset password -> click on UI and reset password
exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body
    
    // validation
    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      })
    }
    // get userdetails from db using token
    const userDetails = await User.findOne({ token: token })
    // if no entry - invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      })
    }
    // token time expires or not
    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      })
    }
    // hast password and update password in db
    const encryptedPassword = await bcrypt.hash(password, 10)
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true }
    )
    // return response  
    return res.status(200).json({
      success: true,
      message: `Password Reset Successful`,
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    })
  }
}
