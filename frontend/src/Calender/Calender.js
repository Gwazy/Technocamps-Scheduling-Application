import { useState } from "react";
import { Button } from "@mui/material";
import { Scheduler } from "@aldabil/react-scheduler";
import { EVENTS } from "./events";
import NewEvent from "../Components/Modal/NewEvent";
const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const Calender = (props) => {
  const currentDate = new Date();

  const [date, setDate] = useState([
    { day: "", month: "", year: "", hour: "" },
  ]);
  const [modalShow, setModalShow] = useState(false);
  const [events, setEvents] = useState({
    id: "id",
    title: "title",
    start: new Date(),
    end: new Date(),
  });

  const fetchData = () => {
    axios.defaults.withCredentials = true;

    axios
      .get(backendApi + "/entries")
      .then((response) => {
        if (response.status === 400) {
          console.log("User not logged in");
        }
        if (response.status === 200) {
          console.log("User logged in");
          let eventList = response.data.data;
          console.log(eventList);
          for (let event of eventList) {
            // console.log(event.id);
            // console.log(event.name);
            // console.log(event.bookingDate);
            // console.log(event.bookingTime);
            setEvents((events) => [...events]);
            console.log(events);
          }
          console.log(events);
          return events;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return events;
  };

  return (
    <div className="mt-4 mb-4">
      <Scheduler
        selectedDate={currentDate}
        view="week"
        month={null}
        // remoteEvents={fetchData}
        events={EVENTS}
        day={null}
        // day={{
        //   startHour: 8,
        //   endHour: 16,
        //   step: 60,
        //   cellRenderer: ({ day, start }) => {
        //     // Fake some condition up
        //     const block = day.getDay();
        //     const noClick = day.getDay() === 2 && start.getHours === 10;
        //     const disabled = block === 1;
        //     return (
        //       <Button
        //         style={{
        //           height: "100%",
        //           background: disabled ? "#fff" : "transparent",
        //         }}
        //         onClick={() => {
        //           if (!disabled) {
        //             setDate({
        //               day: day.getDate(),
        //               month: day.getMonth(),
        //               year: day.getFullYear(),
        //               hour: start.getHours(),
        //             });
        //           }
        //           if (noClick) {
        //             console.log("No Click");
        //             return null;
        //           }
        //           console.log(date);
        //         }}
        //         disableRipple={disabled}
        //         // disabled={disabled}
        //       ></Button>
        //     );
        //   },
        // }}
        week={{
          weekDays: [0, 1, 2, 3, 4],
          weekStartOn: 1,
          startHour: 8,
          endHour: 16,
          step: 60,
          cellRenderer: ({ day, start }) => {
            // Fake some condition up
            const block = day.getDay();
            const days = day.getDate();
            const noClick = day.getDay() === 2 && start.getHours === 10;
            const disabled = block === 1;

            return (
              <Button
                style={{
                  height: "100%",
                  background: disabled ? "#fff" : "transparent",
                }}
                onClick={() => {
                  if (!disabled) {
                    setDate({
                      day: day.getDate(),
                      month: day.getMonth(),
                      year: day.getFullYear(),
                      hour: start.getHours(),
                    });
                    setModalShow(true);
                  }
                  console.log(start.getHours());
                }}
                disableRipple={disabled}
                // disabled={disabled}
              ></Button>
            );
          },
        }}
      />

      <NewEvent
        date={date}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default Calender;
