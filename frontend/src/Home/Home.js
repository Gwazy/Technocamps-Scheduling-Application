import React, { useState } from "react";
import Jumbotron from "../Jumbotron/Jumbotron";

import { Col, Row, Container } from "react-bootstrap";
import Calender from "../Calender/Calender";

const startBookingOffset = 5;

const Home = () => {
  let initialDate =
    addDate().getDay() === 0 || addDate().getDay() === 6
      ? addDate().getDay() === 0
        ? addDate(startBookingOffset + 1)
        : addDate(startBookingOffset + 2)
      : addDate();

  const [date, setDate] = useState(initialDate);

  const DateObject = {
    constantInitialDate: initialDate,
    currentDate: date,
  };

  return (
    <div>
      <Container fluid>
        <Row></Row>
        <Row>
          <Jumbotron sharedDateObj={DateObject} setDate={setDate}></Jumbotron>
        </Row>
        <Row>
          <Col></Col>
          <Col xl={9}>
            <Calender sharedDateObj={DateObject}></Calender>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
};

function addDate(days = startBookingOffset) {
  let newDate = new Date();
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export default Home;
