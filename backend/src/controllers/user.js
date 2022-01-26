const status = require("http-status");

const { User } = require("../models");
const userModel = User;
const has = require("has-keys");

module.exports = {
  async getUserById(req, res) {
    if (!has(req.params, "id"))
      throw { code: status.BAD_REQUEST, message: "You must specify the id" };

    let { id } = req.params;

    let data = await userModel.findOne({ where: { id }, include: "entries" });

    if (!data) throw { code: status.BAD_REQUEST, message: "User not found" };

    res.json({ status: true, message: "Returning User", data });
  },
  async getUsers(req, res) {
    let data = await userModel.findAll();

    res.json({ status: true, message: "Returning users", data });
  },
  async newUser(req, res) {
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
    } catch (err) {
      throw { code: status.BAD_REQUEST, message: err };
    }

    res.json({ status: true, message: "Successfully created user" });
  },
  async updateUser(req, res) {
    if (!req.body.id || !req.body.name || !req.body.capacity)
      throw {
        code: status.BAD_REQUEST,
        message: "You must specify the id, name and capacity",
      };
    let { id, name, capacity } = req.body;

    await userModel.updateUser({ name, capacity }, { where: { id } });
    res.json({ status: true, message: "User updated" });
  },
  async deleteUser(req, res) {
    if (!has(req.params, "id"))
      throw { code: status.BAD_REQUEST, message: "You must specify the id" };

    let { id } = req.params;

    await userModel.destory({ where: { id } });

    res.json({ status: true, message: "User deleted" });
  },
};
