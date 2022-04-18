const { google } = require("googleapis");

const { Entries } = require("../models");
const entries = require("../controllers/entries.js");

const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
  "1082791465711-ovbo4th4pc4eg02galpvb4ciutccb3p3.apps.googleusercontent.com",
  "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"
);

oAuth2Client.setCredentials({
  refresh_token:
    "1//04LYDPPLOFbvOCgYIARAAGAQSNwF-L9Ir2ZLKb6gRp9pJPWfOFQ5PYL8h1HhJXQ3KSQ-8DGfIUiuXVxd2mpy5he5KUTUmug4y58U",
});

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

async function numberOfEntries(callback) {
  calendar.events
    .list({
      calendarId: "primary",

      singleEvents: true,
      orderBy: "startTime",
    })
    .then((response) => {
      callback(response.data.items.length);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function listEvents(callback) {
  calendar.events.list(
    {
      calendarId: "primary",
      maxResults: 1000,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, result) => {
      if (err) {
        console.log(JSON.stringify({ error: error }));
      } else {
        if (result.data.items.length) {
          callback(result.data.items);
        }
      }
    }
  );
}

module.exports = {
  async synchronise() {
    numberOfEntries((response) => {
      if (response > 0) {
        Entries.sync({ force: true }).then(() => {
          listEvents((response) => {
            for (let element in response) {
              let courseName = response[element].summary;
              let start = response[element].start["dateTime"];
              start = new Date(start);
              let id = response[element].id;
              let description = response[element].description;
              let jsonObj;
              try {
                jsonObj = JSON.parse(description);
              } catch (err) {
                jsonObj = false;
              }

              console.log(id);
              if (jsonObj.user_id && jsonObj.capacity && jsonObj.online) {
                try {
                  entries.newEntrie({
                    body: {
                      name: courseName,
                      bookingDate:
                        start.getMonth() +
                        1 +
                        "/" +
                        start.getDate() +
                        "/" +
                        start.getFullYear(),
                      bookingTime: start.getHours(),
                      online: jsonObj.online,
                      calendarId: id,
                      capacity: jsonObj.capacity,
                      userId: jsonObj.user_id,
                      startUpSync: true,
                    },
                  });
                } catch (err) {
                  console.log(err);
                }
              } else {
                console.log(
                  "Detected non-Calendar generated event " + courseName
                );
                try {
                  entries.newEntrie({
                    body: {
                      name: "Imported Event",
                      bookingDate:
                        start.getMonth() +
                        1 +
                        "/" +
                        start.getDate() +
                        "/" +
                        start.getFullYear(),
                      bookingTime: start.getHours(),
                      online: false,
                      calendarId: id,
                      capacity: "0",
                      userId: "1",
                      startUpSync: true,
                    },
                  });
                } catch (err) {
                  console.log(err);
                }
              }
            }
          });
        });
      } else {
        console.log("No synchronisation is required!");
      }
    });
  },
};
