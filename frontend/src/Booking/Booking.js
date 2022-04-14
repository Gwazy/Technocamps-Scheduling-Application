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

const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const Booking = () => {
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [selected, setSelected] = useState("Pending");
  const [condition, setcondition] = useState("");

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

  //   const visabilityOnClick = (course) => (e) => {
  //     course.visability = !course.visability;
  //     axios
  //       .put(backendApi + "/courses", course)
  //       .then((response) => {
  //         if (response.status === 200) {
  //           setToggle(!toggle);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  const acceptOnClick = (entrie) => (e) => {
    entrie.pending = false;
    entrie.confirmation = true;
    axios
      .put(backendApi + "/entries", entrie)
      .then((response) => {
        if (response.status === 200) {
          setToggle(!toggle);
        }
      })
      .catch((error) => console.log(error));
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

  const informationOnClick = (entrie) => (e) => {};

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
                  <Col>
                    <ButtonGroup className="float-end me-2 mt-4">
                      <Button
                        variant="primary"
                        onClick={informationOnClick(entrie)}
                      >
                        Information
                      </Button>
                    </ButtonGroup>
                  </Col>
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
      <ButtonToolbar className="justify-content-center mt-3 mb-5">
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

      <div className="mb-5">
        <h2>{selected}</h2>
      </div>

      {renderEvents}
    </Container>
  );
};

export default Booking;
