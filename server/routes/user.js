const express = require("express");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = express.Router();
const CryptoJs = require("crypto-js");
const nodemailer = require('nodemailer');
const User = require("../models/User");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });
  
  transporter.verify((err, success) => {
    err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
  });
  

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
    const { email, newPassword } = req.body;

    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      // Generate a random encryption key and IV
      const encryptionKey = CryptoJs.lib.WordArray.random(32);
      const iv = CryptoJs.lib.WordArray.random(16);
  
      // Encrypt the new password using AES
      const encryptedPassword = CryptoJs.AES.encrypt(newPassword, encryptionKey, { iv }).toString();
  
      // Decrypt the password (just for demonstration purposes)
      const decryptedPassword = CryptoJs.AES.decrypt(encryptedPassword, encryptionKey, { iv }).toString(CryptoJs.enc.Utf8);
  
      // Update the user's password
      user.password = encryptedPassword;
      await user.save();
  
      // Send email notification
      const mailOptions = {
        from: process.env.EMAIL, // Replace with your Gmail email address
        to: email,
        subject: 'Password Change Notification',
        text: 'Your password has been successfully changed.',
      };
  
      await transporter.sendMail(mailOptions);
  
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server Error' });
    }
}

router.put("/users/update/:id", verifyTokenAndAuthorization, updateUser);
router.delete("/users/delete/:id", verifyTokenAndAuthorization, deleteUser);
router.get("/users/find/:id", verifyTokenAndAuthorization, getUser);
router.get("/users", verifyTokenAndAdmin, getAllUser);
router.get("/users/stats", verifyTokenAndAdmin, getUserStats);
router.post("/users/change-password", verifyToken, changeUserPassword);

module.exports = router