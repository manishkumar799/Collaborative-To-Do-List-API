const User = require("./../model/User");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (email, password) => {
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  try {
    if (!isEmail(email)) {
      return { status: 400, msg: "Invalid email" };
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return { status: 400, msg: "User already exists" };
    }
    const user = new User({
      email,
      password,
    });
    await user.save();
    return {
      status: 200,
      userId: user._id,
      msg: "User registered successfully",
    };
  } catch (error) {
    return { status: 500, msg: error.message };
  }
};

exports.login = async (email, password) => {
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return { status: 400, msg: "User not exists" };
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return { status: 400, msg: "Incorrect password" };
    }
    const token = jwt.sign({ userId: existingUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    existingUser.token = token;
    await existingUser.save();
    return {
      status: 200,
      msg: "Login successful",
      userId: existingUser._id,
      token: existingUser.token,
    };
  } catch (error) {
    return { status: 500, msg: error.message };
  }
};

exports.getAllUsers = async function () {
  try {
    const users = await User.find({}, "email");
    return users;
  } catch (error) {
    return error;
  }
};
