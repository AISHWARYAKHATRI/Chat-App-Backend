const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const {
  generateToken,
  generateVerifyEmailToken,
} = require("../config/jwtFunctions");
const jwt = require("jsonwebtoken");

// Send email
const sendVerifyMail = async (name, email, id) => {
  // Generate SMTP service account from ethereal.email
  const testAccount = await nodemailer.createTestAccount();
  // connect with the smtp server
  let transport = await nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "jameson.nikolaus14@ethereal.email",
      pass: "9B9Eam2JtmpPSdE2Ub",
    },
  });
  const token = generateVerifyEmailToken(id);
  const mailOptions = {
    from: "jameson.nikolaus14@ethereal.email",
    to: email,
    subject: "Ssup Registration Verification",
    html:
      "<p>Thanks " +
      name +
      " for registering with ssup. Please verify your email by clicking the below link.</p><a href='http://127.0.0.1:3000/verify?token=" +
      token +
      "'>Verify your mail</a>",
  };
  transport.sendMail(mailOptions, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Result", result);
    }
  });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  } else {
    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      sendVerifyMail(req.body.name, req.body.email, user._id);
      res.status(201).json({
        message: "User registered successfully",
        token: generateToken(user._id),
      });
    } else {
      res.send(400);
      throw new Error("User registration failed");
    }
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && !user.isVerified) {
    res.status(403);
    throw new Error("Please verify you email");
  } else if (user && user.isVerified && (await user.matchPassword(password))) {
    res.json({
      message: "Login successful",
      userDetails: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password;");
  }
});

const verifyUser = asyncHandler(async (req, res) => {
  const { token } = req.params;
  jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
    if (err) {
      res.status(401);
      throw new Error(
        "Email verification failed, possibly the link is invalid or expired"
      );
    } else {
      try {
        const userId = decoded.id;
        await User.findByIdAndUpdate(userId, { isVerified: true });
        res.json({ message: "Email verifified successfully" });
      } catch (error) {
        res
          .status(500)
          .json({ error: "Failed to verify email", details: error.message });
      }
    }
  });
});

module.exports = { registerUser, authUser, verifyUser };
