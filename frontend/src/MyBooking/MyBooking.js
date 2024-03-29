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
import { useNavigate } from "react-router-dom";
import EditEvent from "../Components/Modal/EditEvent";
import Details from "../Components/Modal/Details";

const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const MyBooking = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const [modalShowDetails, setModalShowDetails] = useState(false);
  const [entrieName, setEntrieName] = useState("");
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [entrieToEdit, setEntrieToEdit] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const didMount = useRef(false);
  const navigate = useNavigate();

  if (props.user === undefined || props.user === null || props.user === false) {
    navigate("/unauthorized");
  }

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
    setEntrieToEdit(entrie.id);
    setModalShow(true);
  };
  const onClickDetails = (entrie) => (e) => {
    setEntrieName(entrie.name);
    setModalShowDetails(true);
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

  const onHideClick = () => {
    setModalShow(false);
    setEntrieToEdit(false);
    setModalShowDetails(false);
    setToggle(!toggle);
  };

  const onCompletedEvent = () => {
    setCompleted(true);
    setModalShow(false);

    setToggle(!toggle);
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
      console.log(props.user.id);
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
                {entrie.pending ? (
                  <div>Pending : Pending confirmation</div>
                ) : (
                  <div>
                    {entrie.confirmation ? (
                      <div>Confirmation : Confirmed</div>
                    ) : (
                      <div>
                        Confirmation : Rejected, please reschedule for different
                        date
                      </div>
                    )}
                  </div>
                )}
              </Col>
              {entrie.confirmation ? (
                <Col className="justify-content-center mt-5 ">
                  <ButtonToolbar className="mx-2 float-end">
                    <ButtonGroup className="me-2">
                      <Button
                        variant="primary"
                        onClick={onClickDetails(entrie)}
                      >
                        Details
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
              ) : (
                <Col></Col>
              )}
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

      <Details
        event={entrieName}
        show={modalShowDetails}
        onHide={() => onHideClick()}
      ></Details>
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
