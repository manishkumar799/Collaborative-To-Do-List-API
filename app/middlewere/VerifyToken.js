const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ status: 401, error: "Unauthorized" });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 401, error: err.message });
    }
    req.user = decoded;
    next();
  });
};
