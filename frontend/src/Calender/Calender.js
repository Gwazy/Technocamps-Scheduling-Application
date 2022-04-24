import { useEffect, useState, useRef } from "react";
import { Button } from "@mui/material";
import { Scheduler } from "@aldabil/react-scheduler";

import NewEvent from "../Components/Modal/NewEvent";
import { Alert, Container } from "react-bootstrap";
const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const Calender = (props) => {
  const initialDate = props.sharedDateObj.constantInitialDate;
  const currentDate = props.sharedDateObj.currentDate;
  const [toggle, setToggle] = useState(true);
  const didMount = useRef(false);

  const [date, setDate] = useState([
    { day: "", month: "", year: "", hour: "" },
  ]);
  const [entriesData, setEntriesData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [successfulBooking, setSuccessfulBooking] = useState(false);

  useEffect(() => {
    if (didMount) {
      setEntriesData([]);
      axios.defaults.withCredentials = true;

      axios
        .get(backendApi + "/entries/")
        .then((response) => {
          if (response.status === 200) {
            let listOfEntries = response.data.data;

            for (let entrie of listOfEntries) {
              setEntriesData((entriesData) => [...entriesData, entrie]);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      didMount = true;
    }
  }, [toggle]);

  useEffect(() => {
    if (successfulBooking) {
      const interval = setInterval(() => {
        setSuccessfulBooking(false);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [successfulBooking]);

  const isDisabled = (day, start, elements) => {
    var bookingDate = new Date(
      day.getMonth() + 1 + " " + day.getDate() + " " + day.getFullYear()
    );

    bookingDate.setHours(0, 0, 0, 0);
    if (initialDate > bookingDate) {
      return true;
    } else {
      for (let ele in entriesData) {
        let tempDate = new Date(entriesData.at(ele).bookingDate);
        tempDate.setHours(0, 0, 0, 0);
        if (tempDate.toString() === bookingDate.toString()) {
          let tempTime = entriesData.at(ele).bookingTime;
          if (
            Number(tempTime) === Number(start.getHours()) &&
            !elements.includes(tempTime)
          ) {
            elements.push(tempTime);
            return true;
          }
        }
      }
      return false;
    }
  };

  const onHideClick = () => {
    setModalShow(false);
  };

  const onSuccessfulBooking = () => {
    setSuccessfulBooking(true);
    setModalShow(false);
    setToggle(!toggle);
  };

  const SuccessMessage = () => {
    if (successfulBooking) {
      return (
        <div>
          <Alert variant="success">
            <Alert.Heading>Success</Alert.Heading>
            <p>You have successfully created a booking!</p>
          </Alert>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  return (
    <Container>
      <SuccessMessage></SuccessMessage>

      <div className="mt-4 mb-4">
        <Scheduler
          selectedDate={currentDate}
          view="week"
          month={null}
          day={null}
          week={{
            weekDays: [0, 1, 2, 3, 4],
            weekStartOn: 1,
            startHour: 8,
            endHour: 16,
            step: 60,
            cellRenderer: ({ day, start }) => {
              // Fake some condition up
              const elements = [];
              const disabled = isDisabled(day, start, elements);

              return (
                <Button
                  style={{
                    height: "100%",

                    background: disabled ? "#E5E5E5" : "transparent",
                  }}
                  onClick={() => {
                    if (!disabled && props.user.isAdmin === false) {
                      setDate({
                        day: day.getDate(),
                        month: day.getMonth(),
                        year: day.getFullYear(),
                        hour: start.getHours(),
                      });
                      setModalShow(true);
                    } else {
                      setDate({
                        day: 10,
                        month: 1,
                        year: 2000,
                        hour: start.getHours(),
                      });
                      setModalShow(true);
                    }
                  }}
                  // disabled={disabled}
                ></Button>
              );
            },
          }}
        />

        <NewEvent
          date={date}
          user={props.user}
          initialdate={initialDate}
          show={modalShow}
          onHide={() => onHideClick()}
          onCompleted={() => onSuccessfulBooking()}
        />
      </div>
    </Container>
  );
};

export default Calender;
