import { ButtonGroup } from "@mui/material";
import "./MyBooking.scss";
import React, { useState, useEffect, useRef } from "react";
import {
  Col,
  Row,
  Container,
  Button,
  Form,
  ButtonToolbar,
  Alert,
} from "react-bootstrap";

import EditEvent from "../Components/Modal/EditEvent";

const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const MyBooking = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [entrieToEdit, setEntrieToEdit] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount) {
      axios.defaults.withCredentials = true;

      axios
        .get(backendApi + "/entries/")
        .then((response) => {
          if (response.status === 200) {
            setData([]);
            let listOfEntries = response.data.data;

            for (let entrie of listOfEntries) {
              setData((data) => [...data, entrie]);
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
    if (completed) {
      const interval = setInterval(() => {
        setCompleted(false);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [completed]);

  useEffect(() => {
    if (deleted) {
      const interval = setInterval(() => {
        setDeleted(false);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [deleted]);

  const onClickEdit = (entrie) => (e) => {
    console.log(entrie);
    setEntrieToEdit(entrie.id);
    setModalShow(true);
  };

  const onCompletedEvent = () => {
    setCompleted(true);
    setModalShow(false);

    setToggle(!toggle);
  };

  const onHideClick = () => {
    setModalShow(false);
    setEntrieToEdit(false);
    setToggle(!toggle);
  };

  const onClickDelete = (entrie) => (e) => {
    setDeleted(true);
    axios
      .delete(backendApi + "/entries/" + entrie.id)
      .then((response) => {
        setToggle(!toggle);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const SuccessMessage = () => {
    if (completed) {
      return (
        <div>
          <Alert variant="success">
            <Alert.Heading>Success</Alert.Heading>
            <p>You have successfully edited a booking</p>
          </Alert>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  const DeletedMessage = () => {
    if (deleted) {
      return (
        <div>
          <Alert variant="danger">
            <Alert.Heading>Success</Alert.Heading>
            <p>You have successfully deleted a booking</p>
          </Alert>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

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
                <div>Course Name : {entrie.name}</div>
                <div>Date : {entrie.bookingDate}</div>
                <div>Time : {entrie.bookingTime}</div>
                <div>Capacity : {entrie.capacity}</div>
                <div>Online : {String(entrie.online)}</div>
                <div>Pending Confirmation : {String(entrie.pending)}</div>
              </Col>
              <Col className="justify-content-center mt-5 ">
                <ButtonToolbar className="mx-2 float-end">
                  <ButtonGroup className="me-2">
                    <Button variant="primary" onClick={onClickDelete(entrie)}>
                      Details (Need to complete)
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup className="me-2">
                    <Button variant="primary" onClick={onClickEdit(entrie)}>
                      Edit
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup className="me-2">
                    <Button variant="danger" onClick={onClickDelete(entrie)}>
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

  return (
    <Container>
      <div>
        <h2 className="h2">A list of your current bookings</h2>
      </div>
      <SuccessMessage></SuccessMessage>
      <DeletedMessage></DeletedMessage>
      {renderEntrie}
      <EditEvent
        event={entrieToEdit}
        show={modalShow}
        onHide={() => onHideClick()}
        onCompleted={() => onCompletedEvent()}
      ></EditEvent>
    </Container>
  );
};

export default MyBooking;
