const status = require("http-status");

const { User } = require("../models");
const userModel = User;
const { createTokens } = require("../JWT");

const bcrypt = require("bcrypt");

module.exports = {
  async register(req, res) {
    if (
      !req.body.username ||
      !req.body.emailaddress ||
      !req.body.firstname ||
      !req.body.surname ||
      !req.body.address ||
      !req.body.postcode ||
      !req.body.phonenumber ||
      !req.body.password
    ) {
      throw { code: status.BAD_REQUEST, message: "" };
    }

    const error = [];
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

    // Validation

    try {
      let doesUsernameExist = await userModel.findOne({
        where: { username: username },
      });

      if (doesUsernameExist) {
        error.push("Username already exists!");
      }
    } catch (err) {
      error.push("Username already exists!");
    }

    try {
      let doesEmailaddressExist = await userModel.findOne({
        where: { emailaddress: emailaddress },
      });
      if (doesEmailaddressExist) {
        error.push("This emailaddress is already used!");
      }
    } catch (err) {
      error.push("This emailaddress is already used!");
    }

    try {
      let re = /^[0-9\b]+$/;
      if (!re.test(phonenumber)) {
        error.push("Please enter a valid phone number!");
      }
    } catch (err) {
      error.push("Please enter a valid phone number!");
    }

    try {
      let re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      if (!re.test(emailaddress)) {
        error.push("Please enter a valid email address!");
      }
    } catch (err) {
      error.push("Please enter a valid email address!");
    }

    if (error.length != 0) {
      console.log(error.length);
      // throw { code: status.BAD_REQUEST, message: error };
      res.status(400).json({ status: 400, message: error });
    }

    if (error.length === 0) {
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
        res.json({ status: true, message: "Successfully created user" });
      } catch (error) {
        throw { code: status.BAD_REQUEST, message: "error" };
      }
    }
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
        maxAge: 2592000000,
        httpOnly: true,
      });

      return res.json({
        status: true,
        message: "Authentication Successful",
        accesstoken: accessToken,
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
