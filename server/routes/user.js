const express = require("express");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = express.Router();
const CryptoJs = require("crypto-js");
const nodemailer = require('nodemailer');
const User = require("../models/User");
const { v4: uuidv4 } = require('uuid');

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: process.env.EMAIL,
//       clientId: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       refreshToken: process.env.REFRESH_TOKEN
//     }
//   });
  
//   transporter.verify((err, success) => {
//     err
//     ? console.log(err)
//     : console.log(`=== Server is ready to take messages: ${success} ===`);
//   });
  

const updateUser = async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, 
            {
                $set: req.body
            }, 
            { new: true}
        );
        res.status(200).json(updatedUser);
    } catch(err) {
        res.status(500).json(err);
    }
}

const deleteUser = async (req, res) => {

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted..");
    } catch(err) {
        res.status(500).json(err)
    }
}

const getUser = async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        
        const { password, ...others } = user._doc;

        res.status(200).json(others);
    } catch(err) {
        res.status(500).json(err)
    }
}

const getAllUser = async (req, res) => {

    const query = req.query.new

    try {
        const users = query ? await User.find().sort({_id: -1}).limit(5) : await User.find({});
        
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json(err)
    }
}

const getUserStats = async (req, res) => {

    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {

        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month : "$createdAt" },
                },
            },
            {
                $group:{
                    _id: "$month",
                    total: { $sum: 1 },
                }
            }
        ]);

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json(err);
    }
}

const changeUserPassword = async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;

  try {
    // Find the user by their username
    const user = await User.findOne({ username });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Decrypt the stored password and compare it with the current password
    const decryptedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    ).toString(CryptoJs.enc.Utf8);

    if (decryptedPassword !== currentPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (newPassword === currentPassword) {
      return res.status(401).json({ message: "Your new password is the same as current password, please change it" });
    }

    // Encrypt the new password
    const encryptedPassword = CryptoJs.AES.encrypt(
      newPassword,
      process.env.PASS_SEC
    ).toString();

    // Update the user's password
    user.password = encryptedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

const generateResetToken = () => {
    // Generate a random token using a library like 'crypto' or 'uuid'
    // For example, using the 'uuid' library:
    const resetToken = uuidv4();
  
    return resetToken;
};

const initiatePasswordReset = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Check if the user with the given email exists
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate a reset token and store it in the user document
      const resetToken = generateResetToken();
      user.resetToken = resetToken;
      user.resetTokenExpires = Date.now() + 3600000; // Token expiration time: 1 hour
      await user.save();
  
      // Create the reset password URL in your frontend website
      const resetPasswordUrl = `${process.env.FRONTEND_URL}/forgot-password/${resetToken}`;
  
      // Send a password reset email to the user
      // const mailOptions = {
      //   from: 'your-email@gmail.com',
      //   to: email,
      //   subject: 'Password Reset',
      //   html: `<p>Click the following link to reset your password:</p><a href="${resetPasswordUrl}">${resetPasswordUrl}</a>`
      // };
  
      // transporter.sendMail(mailOptions, (error) => {
      //   if (error) {
      //     console.log(error);
      //     return res.status(500).json({ message: 'Failed to send password reset email' });
      //   }
      // });
  
      res.status(200).json(`${resetPasswordUrl}`);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;
  
    try {
      // Find the user by reset token and check if it has expired
      const user = await User.findOne({
        resetToken,
        resetTokenExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }
  
      // Update the user's password
      const encryptedPassword = CryptoJs.AES.encrypt(newPassword, process.env.PASS_SEC).toString();
      user.password = encryptedPassword;
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  

router.put("/users/update/:id", verifyTokenAndAuthorization, updateUser);
router.delete("/users/delete/:id", verifyTokenAndAuthorization, deleteUser);
router.get("/users/find/:id", verifyTokenAndAuthorization, getUser);
router.get("/users", verifyTokenAndAdmin, getAllUser);
router.get("/users/stats", verifyTokenAndAdmin, getUserStats);
router.post("/change-password", changeUserPassword);
router.post('/initiate-password-reset', initiatePasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router