const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');


const User = require('../models/User')

const createUser = async (req, res) => {
    await bcrypt
    .hash(req.body.password, 10).then((hashedPassword) => {
     
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      user.save()
      .then((result) => {
          res.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    .catch((e) => {
      res.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
      console.log(e)
    });
}

router.post("/register", createUser)

module.exports = router

// const express = require("express");
// const router = express.Router();
// const bcrypt = require('bcrypt');

// const UserModel = require("../models/User.js");

// const createUserAccount = (req, res) => {
//   // const role = new RegExp('@bsi.co.id', 'gi').test(req.body.email) ? 'Admin' : 'User';
  
//      bcrypt
//       .hash(req.body.password, 10)
//       .then((hashedPassword) => {
//         // create a new user instance and collect the data
//         const user = new UserModel({
//           username : req.body.username,
//           email: req.body.email,
//           password: hashedPassword
//         });
//         // save the new user
//         user
//           .save()
//           // return success if the new user is added to the database successfully
//           .then((result) => {
//             res.status(201).send({
//               message: "User Created Successfully",
//               result,
//             });
//           })
//           // catch error if the new user wasn't added successfully to the database
//           .catch((error) => {
//             res.status(500).send({
//               message: "Error creating user",
//               error,
//             });
//             console.log(error)
//           });
//       })
//       // catch error if the password hash isn't successful
//       .catch((e) => {
//         res.status(500).send({
//           message: "Password was not hashed successfully",
//           e,
//         });
//         console.log(e)
//       })
//       .catch((err) => {
//         res.status(400).send({
//           message : "Duplicate Email",
//           err
//         })
//       })
// }

// router.post("/register", createUserAccount);

// module.exports = router