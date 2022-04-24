const status = require("http-status");
const Sequelize = require("sequelize");
const { User, Entries, Schedule } = require("../models");
const entries = require("../controllers/entries.js");
const userModel = User;
const entriesModel = Entries;
const scheduleModel = Schedule;

async function localNewSchedule(staffId, entryId) {
  const user = await userModel.findOne({ where: { id: staffId } });
  const entrie = await entriesModel.findOne({ where: { id: entryId } });

  await scheduleModel.create({
    userId: user.id,
    entriesId: entrie.id,
  });
}

module.exports = {
  async getAllSchedule(req, res) {
    console.log("Hello");
    let data = await scheduleModel.findAll({ include: [Entries, User] });

    res.json({ status: true, message: "Returning all schedules", data });
  },
  async newSchedule(req, res) {
    if (!req.body.staffId || !req.body.eventId)
      throw {
        code: status.BAD_REQUEST,
        message: "Missing parameters",
      };

    let { staffId, eventId } = req.body;

    const user = await userModel.findOne({ where: { id: staffId } });
    const entrie = await entriesModel.findOne({ where: { id: eventId } });

    await scheduleModel.create({
      userId: user.id,
      entriesId: entrie.id,
    });

    res.json({
      status: true,
      message: "Successfully assigned memeber to event",
    });
  },
  async deleteSchedule(req, res) {
    await scheduleModel.fineOne({ where: { entriesId: id } });
  },
  async autoSchedule(req, res) {
    const AllPendingEntries = await entriesModel.findAll({
      where: { pending: true },
    });
    const allStaff = await userModel.findAll({ where: { isStaff: true } });

    for (var i of AllPendingEntries) {
      for (var j of allStaff) {
        await scheduleModel
          .findAll({
            include: [
              {
                model: Entries,
                where: {
                  bookingDate: i.dataValues.bookingDate,
                  [Sequelize.Op.or]: [
                    { bookingTime: i.dataValues.bookingTime },
                    {
                      bookingTime: String(Number(i.dataValues.bookingTime) + 3),
                    },
                    {
                      bookingTime: String(Number(i.dataValues.bookingTime) + 1),
                    },
                    {
                      bookingTime: String(Number(i.dataValues.bookingTime) + 2),
                    },
                    {
                      bookingTime: String(Number(i.dataValues.bookingTime) - 1),
                    },
                    {
                      bookingTime: String(Number(i.dataValues.bookingTime) - 2),
                    },
                    {
                      bookingTime: String(Number(i.dataValues.bookingTime) - 3),
                    },
                  ],
                },
              },
              { model: User, where: { id: j.dataValues.id } },
            ],
          })
          .then((response) => {
            console.log(response.length);
            if (response.length === 0) {
              // Otherwise is busy
              entries.updateEntrie({
                body: {
                  id: i.dataValues.id,
                  pending: false,
                  confirmation: true,
                  capacity: i.dataValues.capacity,
                  userId: i.dataValues.userId,
                  online: i.dataValues.online,
                },
              });
              localNewSchedule(j.dataValues.id, i.dataValues.id);
            }
          });
      }
    }

    checking = await entriesModel.findAll({
      where: { pending: true },
    });

    for (let i of checking) {
      entries.updateEntrie({
        body: {
          id: i.dataValues.id,
          pending: false,
          confirmation: false,
          capacity: i.dataValues.capacity,
          userId: i.dataValues.userId,
          online: i.dataValues.online,
        },
      });
    }
    res.json({ status: true, message: allStaff });
  },
};
