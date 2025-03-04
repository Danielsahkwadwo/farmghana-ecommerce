const User = require("./../Models/userModel");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { createToken, hashToken } = require("./../Utils/createToken");
const sendEmail = require("../Utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("./../Utils/cloudinary");
const { uploadUserImage } = require("./../Middlewares/multer");
const Address = require("../Models/addressModel");

const createCookie = (res, token) => {
  res.cookie("token", token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
};

exports.uploadImage = uploadUserImage.single("userPhoto");
exports.uploadAndResizeUserImage = async (req, res, next) => {
  try {
    if (!req.file) return next();

    cloudinary.uploader.upload(
      req.file.path,
      { folder: "uploads/users" },
      (error, result) => {
        if (error) {
          // console.log(error)
          res
            .status(500)
            .json({ message: "An error occured while uploading image" });
          return;
        }
        // res.status(200).json({
        //   data: result,
        // });
        req.file.filename = result.secure_url;
        next();
      }
    );
  } catch (error) {
    res.status(500);
    next(error);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      throw new Error("please fill in all required fields");
    }
    //password validation before save
    if (!password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      throw new Error("password must contain an uppercase letter");
    } else if (!password.match(/([!,%,&,@,&,#,$,^,*,?,_,~,])/)) {
      throw new Error("password must contain a special character");
    } else if (!password.match(/([0-9])/)) {
      throw new Error("password must contain a number");
    }
    if (password.length < 6) {
      throw new Error("password must be up to 6 characters");
    }
    if (password !== confirmPassword) {
      throw new Error("passwords do not match");
    }
    //checking if email already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("email has already been registered");
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    if (user) {
      await Address.create({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
    if (user) {
      const token = createToken(user._id);
      createCookie(res, token);
//create verification token and save
const verificationToken = crypto.randomBytes(32).toString("hex") + user.id;

//hash token and save
const hashedToken = hashToken(verificationToken);

user.verificationToken = hashedToken;
user.tokenExpiresAt = Date.now() + 60 * (60 * 1000);
await user.save();

       //verification url
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    //Send Email
    const subject = "Welcome to DavAK";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = "noreply@gmail.com";
    const template = "verifyEmail";
    const name = user.firstName;
    const link = verificationUrl;

    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );

      res.status(201).json({
        status: "success",
        user,
        token,
      });
    } else {
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.sendVerificationEmail = async (req, res, next) => {
  try {
    const user = await User.findById(res.user.id);
    if (!user) {
      res.status(404);
      throw new Error("user not found");
    }
    if (user.isVerified) {
      res.status(400);
      throw new Error("user already verified");
    }

    if (!user.isVerified) {
      user.verificationToken = undefined;
      user.tokenExpiresAt = undefined;
      await user.save();
    }

    //create verification token and save
    const verificationToken = crypto.randomBytes(32).toString("hex") + user.id;

    //hash token and save
    const hashedToken = hashToken(verificationToken);

    user.verificationToken = hashedToken;
    user.tokenExpiresAt = Date.now() + 60 * (60 * 1000);
    await user.save();

    //verification url
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    //Send Email
    const subject = "Verify Your Account";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = "noreply@gmail.com";
    const template = "verifyEmail";
    const name = user.firstName;
    const link = verificationUrl;

    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({
      message: "verification email sent successfully",
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const hashedToken = hashToken(verificationToken);
    const user = await User.findOne({
      verificationToken: hashedToken,
      tokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error("Invalid or expired token");
    }

    //find user
    if (user.isVerified) {
      res.status(400);
      throw new Error("user is already verified");
    }

    user.isVerified = true;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Account verification successful",
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("please enter correct email or password");
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("user does not exist");
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword)
      throw new Error("please enter a valid email or password");

    if (user && correctPassword) {
      const token = createToken(user._id);
      createCookie(res, token);
      res.status(200).json({
        staus: "success",
        user,
        token,
      });
    } else {
      throw new Error("something went wrong, please try again");
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    await res.clearCookie("token");
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(res.user.id);
    if (!user) {
      throw new Error("user not found");
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;
    const updateBody = {
      firstName,
      lastName,
    };
    if (req.body.email) {
      throw new Error("cannot update user email");
    } else if (req.body.password) {
      throw new Error("cannot change password here");
    }
    if (req.file) {
      updateBody.userPhoto = req.file.filename;
    }
    // console.log(updateBody);
    const user = await User.findByIdAndUpdate(res.user.id, updateBody, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new Error("user not found");
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      throw new Error("user not found");
    }
    res.status(200).json({
      message: "user deleted succesfully",
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort("-createdAt").select("-password");
    const usersAddresses = await User.find()
      .populate("addressId")
      .sort("-createdAt");
    if (!users) {
      throw new Error("something went wrong");
    }
    res.status(200).json({ users, usersAddresses });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

exports.getLoginStatus = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.json(false);
    }

    //verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    if (!verified) {
      return res.json(false);
    }
    return res.json(true);
  } catch (error) {
    // res.status(401);
    next(error);
  }
};

exports.upgradeUser = async (req, res, next) => {
  try {
    const { role, id } = req.body;
    const user = await User.findById(id);

    if (!user) {
      throw new Error("user not found");
    }
    user.role = role;
    await user.save();
    res.status(200).json({
      message: `user role updated to ${role}`,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.sendAutomatedEmails = async (req, res, next) => {
  try {
    const { subject, send_to, reply_to, template, url } = req.body;
    if (!subject || !send_to || !reply_to || !template) {
      res.status(500);
      throw new Error("Missing email parameter");
    }
    //get user
    const user = await User.findOne({ email: send_to });
    if (!user) {
      res.status(404);
      throw new Error("user not found");
    }
    const sent_from = process.env.EMAIL_USER;
    const name = user.name;
    const link = `${process.env.FRONTEND_URL}${url}`;

    //send email
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({
      message: "Email sent successfully",
    });
  } catch (error) {
    res.status(500);
    next(error ? error : new Error("Email.not sent, please try again"));
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("There is no user with this email");
    }

    user.resetToken = undefined;
    await user.save();

    //create reset token and save
    const resetToken = crypto.randomBytes(32).toString("hex") + user._id;

    //hash reset token and save
    const hashedResetToken = hashToken(resetToken);

    user.resetToken = hashedResetToken;
    user.tokenExpiresAt = Date.now() + 60 * (60 * 1000); //1hr
    await user.save();

    //construct reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    //Send Email
    const subject = "Password Reset Request";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = "noreply@gmail.com";
    const template = "forgotPassword";
    const name = user.firstName;
    const link = resetUrl;

   await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    // if (!send) throw new Error("Email not sent, please try again");
    res.status(200).json({
      message: "Password reset email sent",
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password, confirmPassword } = req.body;

    const hashedResetToken = hashToken(resetToken);
    const user = await User.findOne({
      resetToken: hashedResetToken,
      tokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token is invalid or has expired");

    if (!password || !confirmPassword)
      throw new Error("All fields are required");
    if (password !== confirmPassword) throw new Error("passwords do not match");

    user.password = password;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "password reset successfull. please login",
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, password, confirmPassword } = req.body;
    const user = await User.findById(res.user.id).select("+password");
    if (!user) {
      throw new Error("user not found!");
    }

    if (!oldPassword || !password || !confirmPassword) {
      throw new Error("All fields are required");
    }
    if (password !== confirmPassword) {
      throw new Error("passwords do not match");
    }

    const correctPassword = await bcrypt.compare(oldPassword, user.password);
    if (user && !correctPassword) {
      throw new Error("current password is incorrect");
    }
    user.password = password;
    await user.save({ runValidators: true });
    res.status(200).json({
      status: "success",
      message: "password changed successful. please login again",
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
