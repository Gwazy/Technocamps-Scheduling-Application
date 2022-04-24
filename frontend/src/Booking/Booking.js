import { ButtonGroup } from "@mui/material";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Col,
  Row,
  Container,
  Button,
  Form,
  ButtonToolbar,
} from "react-bootstrap";
import Assign from "../Components/Modal/Assigning";
import Information from "../Components/Modal/Information";
import { useNavigate } from "react-router-dom";

const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const Booking = (props) => {
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalShowInformation, setModalShowInformation] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [selected, setSelected] = useState("Pending");
  const [booking, setBooking] = useState("");

  const navigate = useNavigate();

  const didMount = useRef(false);
  useEffect(() => {
    if (didMount) {
      axios
        .get(backendApi + "/entries")
        .then((response) => {
          if (response.status === 200) {
            setData([]);
            let listOfEntries = response.data.data;

            for (let entrie of listOfEntries) {
              console.log(entrie);
              setData((data) => [...data, entrie]);
            }
            console.log(data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      didMount = true;
    }
  }, [toggle]);

  if (props.user === undefined || props.user === null || props.user === false) {
    navigate("/unauthorized");
  }

  const acceptOnClick = (entrie) => (e) => {
    setBooking(entrie);
    setModalShow(true);
  };

  const rejectOnClick = (entrie) => (e) => {
    entrie.pending = false;
    entrie.confirmation = false;

    axios
      .put(backendApi + "/entries", entrie)
      .then((response) => {
        if (response.status === 200) {
          setToggle(!toggle);
        }
      })
      .catch((error) => console.log(error));
  };

  const onHideClick = () => {
    setModalShow(false);
    setModalShowInformation(false);
    setToggle(!toggle);
  };

  const informationOnClick = (entrie) => (e) => {
    setBooking(entrie);
    setModalShowInformation(true);
    setToggle(!toggle);
  };

  const renderEvents = data
    .filter((entrie) => {
      if (selected === "Pending") {
        return entrie.pending === true;
      } else if (selected === "Accepted") {
        return entrie.confirmation === true;
      } else {
        return entrie.confirmation === false;
      }
    })
    .map((entrie) => {
      if (selected === "Pending") {
        return (
          <div className="d-flex border rounded p-4 mb-3">
            <Container>
              <Form>
                <Row className="align-content-center">
                  <Col>
                    <div>{entrie.name}</div>
                    <div>Booker : {entrie.User.username}</div>
                    <div>Date : {entrie.bookingDate}</div>
                    <div>Time : {entrie.bookingTime}</div>
                  </Col>
                  <Col className="justify-content-center mt-4 ">
                    <ButtonToolbar className="mx-2 float-end">
                      <ButtonGroup className="me-2">
                        <Button
                          variant="primary"
                          onClick={acceptOnClick(entrie)}
                        >
                          Accept
                        </Button>
                      </ButtonGroup>
                      <ButtonGroup className="me-2">
                        <Button
                          variant="danger"
                          onClick={rejectOnClick(entrie)}
                        >
                          Reject
                        </Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </Row>
              </Form>
            </Container>
          </div>
        );
      } else if (selected === "Accepted") {
        return (
          <div className="d-flex border rounded p-4 mb-3">
            <Container>
              <Form>
                <Row className="align-content-center">
                  <Col>
                    <div>{entrie.name}</div>
                    <div>Booker : {entrie.User.username}</div>
                    <div>Date : {entrie.bookingDate}</div>
                    <div>Time : {entrie.bookingTime}</div>
                  </Col>
                  <Col className="justify-content-center mt-4 ">
                    {entrie.name === "Imported Event" ? (
                      <div></div>
                    ) : (
                      <ButtonToolbar className="mx-2 float-end">
                        <ButtonGroup className="me-2">
                          <Button
                            variant="primary"
                            onClick={informationOnClick(entrie)}
                          >
                            Information
                          </Button>
                        </ButtonGroup>
                        <ButtonGroup className="me-2">
                          <Button
                            variant="danger"
                            onClick={rejectOnClick(entrie)}
                          >
                            Reject
                          </Button>
                        </ButtonGroup>
                      </ButtonToolbar>
                    )}
                  </Col>
                </Row>
              </Form>
            </Container>
          </div>
        );
      } else {
        return (
          <div className="d-flex border rounded p-4 mb-3">
            <Container>
              <Form>
                <Row className="align-content-center">
                  <Col>
                    <div>{entrie.name}</div>
                    <div>Booker : {entrie.User.username}</div>
                    <div>Date : {entrie.bookingDate}</div>
                    <div>Time : {entrie.bookingTime}</div>
                  </Col>
                  <Col></Col>
                </Row>
              </Form>
            </Container>
          </div>
        );
      }
    });

  const buttonSetting = (setting) => (e) => {
    setSelected(setting);
  };

  return (
    <Container>
      <ButtonToolbar className="justify-content-center mt-5 ">
        <ButtonGroup>
          <Button style={{ width: 100 }} onClick={buttonSetting("Pending")}>
            Pending
          </Button>
          <Button style={{ width: 100 }} onClick={buttonSetting("Accepted")}>
            Accepted
          </Button>
          <Button style={{ width: 100 }} onClick={buttonSetting("Reject")}>
            Reject
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
      <Button className="mt-1 mb-3">Button</Button>

      <div className="mb-5">
        <h2>{selected}</h2>
      </div>

      {renderEvents}

      <Information
        booking={booking}
        show={modalShowInformation}
        onHide={() => onHideClick()}
      ></Information>
      <Assign
        booking={booking}
        show={modalShow}
        onHide={() => onHideClick()}
      ></Assign>
    </Container>
  );
};

export default Booking;
