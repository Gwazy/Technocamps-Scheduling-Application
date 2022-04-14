import React, { useState } from "react";
import Jumbotron from "../Jumbotron/Jumbotron";

import { Col, Row, Container } from "react-bootstrap";
import Calender from "../Calender/Calender";
import "./Home.scss";
const startBookingOffset = 5;

const Home = (props) => {
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

  if (!props.user) {
    return (
      <div>
        <Container fluid>
          <Row className="image">
            <img src="//www.technocamps.com/wp-content/uploads/2020/10/Image20201023153656.png" />
          </Row>
          <Row>
            <div className="bg-colour">
              <h1 className="text">Please Login to use</h1>
            </div>
          </Row>
          <Row>
            <Col></Col>
            <Col xl={9}></Col>
            <Col></Col>
          </Row>
        </Container>
      </div>
    );
  } else {
    return (
      <div>
        <Container fluid>
          <Row></Row>
          <Row>
            <Jumbotron
              user={props.user}
              sharedDateObj={DateObject}
              setDate={setDate}
            ></Jumbotron>
          </Row>
          <Row>
            <Col></Col>
            <Col xl={9}>
              <Calender sharedDateObj={DateObject} user={props.user}></Calender>
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </div>
    );
  }
};

function addDate(days = startBookingOffset) {
  let newDate = new Date();
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export default Home;
