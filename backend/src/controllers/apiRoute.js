const status = require("http-status");

const { User } = require("../models");
const userModel = User;
const jwt = require("jsonwebtoken");
const has = require("has-keys");
const auth = require("../middleware/jwt");
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

      const accesstoken = jwt.sign(
        {
          name: user.name,
          isAdmin: "false",
        },
        process.env.SECRET,
        {
          expiresIn: "24h",
        }
      );

      const refreshToken = jwt.sign(
        {
          name: user.name,
          isAdmin: "false",
        },
        process.env.SECRET,
        {
          expiresIn: "24h",
        }
      );

      return res.json({
        status: true,
        message: "Authentication Successful",
        accesstoken: accesstoken,
        refreshToken: refreshToken,
        userid: user.id,
      });
    } catch (error) {
      throw {
        code: status.BAD_REQUEST,
        message: error,
      };
    }
  },
};
