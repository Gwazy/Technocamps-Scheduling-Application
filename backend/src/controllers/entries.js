const status = require("http-status");
const { google } = require("googleapis");

const { Entries, User } = require("../models");
const entriesModel = Entries;
const has = require("has-keys");

const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
  "1082791465711-ovbo4th4pc4eg02galpvb4ciutccb3p3.apps.googleusercontent.com",
  "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"
);

oAuth2Client.setCredentials({
  refresh_token:
    "1//041L_LnW4rR6_CgYIARAAGAQSNwF-L9IrJ0FYKuPy81QF5v48tyFdg41zj6zivIcll0nyAVCMQRGTpfbjih0cbFSSiJ6qavsJMNo",
});

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

async function insertEvent(
  postid,
  name,
  bookingDate,
  bookingTime,
  online,
  capacity,
  user_id,
  pending,
  confirmation
) {
  let startDateTime = new Date(bookingDate);
  startDateTime.setHours(bookingTime);
  let endDateTime = new Date(bookingDate);
  endDateTime.setHours(bookingTime + 1);

  const event = {
    summary: name,
    colorId: 1,
    description:
      '{"user_id" : "' +
      user_id +
      '","capacity":"' +
      capacity +
      '","online":"' +
      online +
      '","pending":"' +
      pending +
      '","confirmation":"' +
      confirmation +
      '"}',
    start: { dateTime: startDateTime, timeZone: "Europe/London" },
    end: { dateTime: endDateTime, timeZone: "Europe/London" },
  };

  calendar.freebusy.query(
    {
      resource: {
        timeMin: startDateTime,
        timeMax: endDateTime,
        timeZone: "Europe/London",

        items: [{ id: "primary" }],
      },
    },
    (err, res) => {
      //  CHNAGE THIS FUNCTION
      if (err) return console.error("Free Busy Query Error: ", err);

      const eventArr = res.data.calendars.primary.busy;

      // Check if event array is empty which means we are not busy
      if (eventArr.length === 0)
        return calendar.events.insert(
          { calendarId: "primary", resource: event },
          (err, result) => {
            if (err) {
              return console.error("Error Creating Calender Event:", err);
            }

            console.log(result.data.id);
            appendCalendarId(result.data.id, postid);
            return console.log("Calendar event successfully created.");
          }
        );

      // If event array is not empty log that we are busy.
      return console.log(`Sorry I'm busy...`);
    }
  );
}

async function appendCalendarId(calendarId, id) {
  entriesModel.update({ calendarId }, { where: { id } });
}

module.exports = {
  async getEntrieById(req, res) {
    if (!has(req.params, "id"))
      throw { code: status.BAD_REQUEST, message: "You must specify the id" };

    let { id } = req.params;

    let data = await entriesModel.findOne({ where: { id } });

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
    try {
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

      let {
        name,
        bookingDate,
        bookingTime,
        online,
        userId,
        capacity,
        calendarId,
        pending,
        confirmation,
      } = req.body;

      // bookingDateMoment = moment(bookingDate, "MM-DD-YYYY");

      try {
        const user = await User.findOne({ where: { id: userId } });

        await entriesModel
          .create({
            name,
            bookingDate,
            bookingTime,
            online,
            capacity,
            calendarId,
            userId: user.id,
            pending,
            confirmation,
          })
          .then((response) => {
            if (!response.dataValues.calendarId) {
              insertEvent(
                response.dataValues.id,
                name,
                bookingDate,
                bookingTime,
                online,
                capacity,
                userId,
                response.pending,
                response.confirmation
              );
            }
          });
      } catch (error) {
        throw {
          code: status.BAD_REQUEST,
          message: error,
        };
      }
      res.json({ status: true, message: "Successfully created entry" });
    } catch (err) {
      console.log(err);
    }
  },

  async updateEntrie(req, res) {
    if (!req.body.id)
      throw {
        code: status.BAD_REQUEST,
        message: "You must specify the id",
      };
    let { id, name, capacity, pending, confirmation, online, userId } =
      req.body;

    await entriesModel.update(
      { name, capacity, pending, confirmation, online },
      { where: { id } }
    );

    let data = await entriesModel.findOne({ where: { id } });

    var event = calendar.events.get({
      calendarId: "primary",
      eventId: data.dataValues.calendarId,
    });

    event.description =
      '{"user_id" : "' +
      userId +
      '","capacity":"' +
      capacity +
      '","online":"' +
      online +
      '","pending":"' +
      pending +
      '","confirmation":"' +
      confirmation +
      '"}';

    calendar.events.patch({
      calendarId: "primary",
      eventId: data.dataValues.calendarId,
      resource: event,
    });

    res.json({ status: true, message: "Entrie updated" });
  },

  async deleteEntrie(req, res) {
    if (!has(req.params, "id"))
      throw { code: status.BAD_REQUEST, message: "You must specify the id" };

    let { id } = req.params;
    let data = await entriesModel.findOne({ where: { id } });

    calendar.events.delete({
      calendarId: "primary",
      eventId: data.dataValues.calendarId,
    });

    await entriesModel.destroy({ where: { id } });
    res.json({ status: true, message: "Entrie deleted" });
  },

  async destroy() {
    Entries.destroy({
      where: {},
      truncate: true,
    });
  },
};
