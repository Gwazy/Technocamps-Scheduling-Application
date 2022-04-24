const { google } = require("googleapis");

const { Entries } = require("../models");
entriesModel = Entries;
const entries = require("../controllers/entries.js");

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
      maxResults: 10000,
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
        {
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

              entriesModel
                .findOne({ where: { calendarId: id } })
                .then((response) => {
                  if (!response) {
                    console.log("Creating entry");
                    if (
                      jsonObj.user_id &&
                      jsonObj.capacity &&
                      jsonObj.online &&
                      jsonObj.pending &&
                      jsonObj.confirmation
                    ) {
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
                            pending: jsonObj.pending,
                            confirmation: jsonObj.confirmation,
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
                            pending: false,
                            confirmation: true,
                          },
                        });
                      } catch (err) {
                        console.log(err);
                      }
                    }
                  }
                });
              console.log("Entry already exists!");
            }
          });
        }
      } else {
        console.log("No synchronisation is required!");
      }
    });
  },
};
