const status = require("http-status");

const { Entries, User } = require("../models");
const entriesModel = Entries;
const has = require("has-keys");

module.exports = {
  async getEntrieById(req, res) {
    if (!has(req.params, "id"))
      throw { code: status.BAD_REQUEST, message: "You must specify the id" };

    let { id } = req.params;

    let data = await entriesModel.findOne({ where: { userId: id } });

    if (!data) throw { code: status.BAD_REQUEST, message: "Entries not found" };

    res.json({ status: true, message: "Returning course", data });
  },

  async getEntries(req, res) {
    let data = await entriesModel.findAll({ include: [User] });

    res.json({ status: true, message: "Returning entries", data });
  },

  async getEntriesByUserID(req, res) {
    let data = await entriesModel.findAll({ include: [User] });

    res.json({ status: true, message: "Returning entries", data });
  },
  async newEntrie(req, res) {
    console.log(req.body.online);
    if (
      !req.body.name ||
      !req.body.bookingDate ||
      !req.body.bookingTime ||
      !req.body.userId ||
      !req.body.capacity
    )
      throw {
        code: status.BAD_REQUEST,
        message: "Missing parameters",
      };

    let { name, bookingDate, bookingTime, online, userId, capacity } = req.body;

    try {
      const user = await User.findOne({ where: { id: userId } });

      await entriesModel.create({
        name,
        bookingDate,
        bookingTime,
        online,
        capacity,
        userId: user.id,
      });
    } catch (error) {
      throw {
        code: status.BAD_REQUEST,
        message: error,
      };
    }

    res.json({ status: true, message: "Successfully created entry" });
  },

  async updateEntrie(req, res) {
    if (!req.body.id)
      throw {
        code: status.BAD_REQUEST,
        message: "You must specify the id",
      };
    let { id, pending, confirmation } = req.body;

    await entriesModel.update({ pending, confirmation }, { where: { id } });
    res.json({ status: true, message: "Entrie updated" });
  },

  async deleteEntrie(req, res) {
    if (!has(req.params, "id"))
      throw { code: status.BAD_REQUEST, message: "You must specify the id" };

    let { id } = req.params;
    await entriesModel.destroy({ where: { id } });
    res.json({ status: true, message: "Entrie deleted" });
  },
};
