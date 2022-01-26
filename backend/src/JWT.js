const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign(
    { username: user.username, id: user.id, isAdmin: user.isAdmin },
    process.env.SECRET
  );

  return accessToken;
};

//  Middleware
const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res.status(400).json({ error: "Authentication failure" });

  try {
    verify(accessToken, process.env.SECRET, (err, decoded) => {
      if (err) {
        return err;
      }
      req.username = decoded.username;
      req.id = decoded.id;
      req.authenticated = true;
      req.isAdmin = decoded.isAdmin;
      return next();
    });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

module.exports = { createTokens, validateToken };
