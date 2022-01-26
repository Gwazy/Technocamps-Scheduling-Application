const status = require("http-status");

const { User } = require("../models");
const userModel = User;
const { createTokens } = require("../JWT");

const bcrypt = require("bcrypt");

module.exports = {
  async register(req, res) {
    if (!req.body.username) {
      throw { code: status.BAD_REQUEST, message: "Missing parameters" };
    }

    let {
      username,
      emailaddress,
      firstname,
      surname,
      address,
      postcode,
      phonenumber,
      password,
      isAdmin,
    } = req.body;

    try {
      password = bcrypt.hashSync(password, 10); //hashSync required
      await userModel.create({
        username,
        emailaddress,
        firstname,
        surname,
        address,
        postcode,
        phonenumber,
        password,
        isAdmin,
      });
    } catch (error) {
      throw { code: status.BAD_REQUEST, message: error };
    }

    res.json({ status: true, message: "Successfully created user" });
  },

  async login(req, res) {
    if (!req.body.username) {
      throw { code: status.BAD_REQUEST, message: "Missing parameters" };
    }

    let { username, password } = req.body;

    try {
      const user = await userModel.findOne({ where: { username } });

      if (!user) {
        throw { code: status.BAD_REQUEST, message: "User not found" };
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw {
          code: status.BAD_REQUEST,
          message: "Invalid name or password",
        };
      }

      const accessToken = createTokens(user);

      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      });

      return res.json({
        status: true,
        message: "Authentication Successful",
        accesstoken: accessToken,
        userid: user.id,
      });
    } catch (error) {
      throw {
        code: status.BAD_REQUEST,
        message: error,
      };
    }
  },

  async authCheck(req, res) {
    res.json({
      status: true,
      message: "Authenticated",
      username: req.username,
      id: req.id,
      isAdmin: req.isAdmin,
    });
  },

  //  Rewrites the JWT to expire immediately
  async logout(req, res) {
    const accessToken = req.cookies["access-token"];
    res.cookie("access-token", accessToken, { maxAge: 1 });
    res.json({
      accessToken: accessToken,
    });
  },
};
