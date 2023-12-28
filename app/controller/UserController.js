const UserService = require("../service/UserService");

exports.signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.signUp(email, password);
    res.json(user);
  } catch (error) {
    res.status(500).json({ status: 500, msg: error.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.login(email, password);
    res.json(user);
  } catch (error) {
    res.status(500).json({ status: 500, msg: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({ status: 200, users: users });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};
