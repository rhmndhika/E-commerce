const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");



const Register = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if the username or email already exists in the database
      const existingUser = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
  
      if (existingUser) {
        // Either username or email is already taken
        return res.status(400).json({ message: 'Username or email is already taken.' });
      }
  
      // Create a new user
      const newUser = new User({
        username: username,
        email: email,
        password: CryptoJs.AES.encrypt(password, process.env.PASS_SEC).toString(),
      });
  
      // Save the new user to the database
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  };
  

const Login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).json({ message: "Wrong Username!" });
        }

        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
        
        if (originalPassword !== req.body.password) {
            return res.status(401).json({ message: "Please input the correct password!" });
        }

        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc; 
       
        return res.status(200).json({ ...others, accessToken });
          
    } catch(err) {
        console.log(err);
        // Handle the error appropriately (e.g., send an error response)
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const LoginAdmin = async (req, res) => {
  try {
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
          return res.status(401).json({ message: "Wrong Username!" });
      }

      const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);
      const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
      
      if (originalPassword !== req.body.password) {
          return res.status(401).json({ message: "Please input the correct password!" });
      }

      if (user.isAdmin !== true) {
        return res.status(401).json({ message: "User is not an admin!" });
      }

      const accessToken = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SEC,
          { expiresIn: "3d" }
      );

      const { password, ...others } = user._doc; 
     
      return res.status(200).json({ ...others, accessToken });
        
  } catch(err) {
      console.log(err);
      // Handle the error appropriately (e.g., send an error response)
      return res.status(500).json({ message: "Internal Server Error" });
  }
};


// const Login = async (req, res) => {
    
//     try {

//         const user = await User.findOne({ username: req.body.username });

//         !user && res.status(401).json({ message: "Wrong Username!"});

//         const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);

//         const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
        
//         OriginalPassword !== req.body.password && 
//             res.status(401).json({ message: "Please input the correct password!"});

//             const accessToken = jwt.sign({
//                 id: user._id, 
//                 isAdmin: user.isAdmin
//             }, process.env.JWT_SEC, 
//             { expiresIn: "3d"}
//             );

//             const { password, ...others } = user._doc; 
       
//             res.status(200).json({ ...others, accessToken });
          
//     } catch(err) {
//         console.log(err);
//     }
// }



router.post("/register", Register);
router.post("/login", Login);
router.post("/login/for/admin", LoginAdmin);


module.exports = router