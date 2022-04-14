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

const MyBooking = (props) => {
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(true);

  const didMount = useRef(false);
  useEffect(() => {
    console.log(props.user.id);
    if (didMount) {
      axios.defaults.withCredentials = true;

      axios
        .get(backendApi + "/entries/")
        .then((response) => {
          if (response.status === 200) {
            setData([]);
            let listOfEntries = response.data.data;
            console.log(listOfEntries);
            for (let entrie of listOfEntries) {
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

  const renderEntrie = data
    .filter((entrie) => {
      return entrie.userId === props.user.id;
    })
    .map((entrie) => (
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
              <Col className="justify-content-center mt-1 ">
                <ButtonToolbar className="mx-2 float-end">
                  <ButtonGroup className="me-2">
                    <Button variant="primary" onClick={null}>
                      Edit
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup className="me-2">
                    <Button variant="danger" onClick={null}>
                      Delete
                    </Button>
                  </ButtonGroup>
                </ButtonToolbar>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    ));

  return <div>{renderEntrie}</div>;
};

export default MyBooking;
