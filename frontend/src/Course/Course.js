import { ButtonGroup } from "@mui/material";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Col,
  Row,
  Container,
  Button,
  Form,
  ButtonToolbar,
  Alert,
} from "react-bootstrap";
import NewCourse from "../Components/Modal/NewCourse";
import EditCourse from "../Components/Modal/EditCourse";

const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const Course = () => {
  const [modalShow, setModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [courseToEdit, setCourseToEdit] = useState(1);
  const [completed, setCompleted] = useState(false);
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount) {
      axios
        .get(backendApi + "/courses")
        .then((response) => {
          if (response.status === 200) {
            setData([]);
            let listOfCourses = response.data.data;

            for (let course of listOfCourses) {
              setData((data) => [...data, course]);
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

  const visabilityOnClick = (course) => (e) => {
    course.visability = !course.visability;
    axios
      .put(backendApi + "/courses", course)
      .then((response) => {
        if (response.status === 200) {
          setToggle(!toggle);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteOnClick = (course) => (e) => {
    axios
      .delete(backendApi + "/courses/" + course.id)
      .then((response) => {
        setToggle(!toggle);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onCompletedEvent = () => {
    setCompleted(true);
    setModalShow(false);
    setEditModalShow(false);
    setToggle(!toggle);
  };

  const onHideClick = () => {
    setModalShow(false);
    setEditModalShow(false);
    setToggle(!toggle);
  };

  const onEditClick = (course) => (e) => {
    setCourseToEdit(course.id);
    setEditModalShow(true);
  };

  const SuccessMessage = () => {
    if (completed) {
      return (
        <div>
          <Alert variant="success">
            <Alert.Heading>Success</Alert.Heading>
            <p>You have successfully edited a Course</p>
          </Alert>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  const renderCourses = data.map((course) => (
    <div className="d-flex border rounded p-4 mb-3">
      <Container>
        <Form>
          <Row className="align-content-center">
            <Col>
              <div>{course.name}</div>
              Capacity : {course.capacity}
            </Col>
            <Col className="justify-content-center mt-1 ">
              <ButtonToolbar className="mx-2 float-end">
                <ButtonGroup className="me-2">
                  {course.visability ? (
                    <Button
                      variant="secondary"
                      onClick={visabilityOnClick(course)}
                    >
                      Show Course
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={visabilityOnClick(course)}
                    >
                      Hide Course
                    </Button>
                  )}
                </ButtonGroup>
                <ButtonGroup className="me-2">
                  <Button variant="primary" onClick={onEditClick(course)}>
                    Edit
                  </Button>
                </ButtonGroup>
                <ButtonGroup className="me-2">
                  <Button variant="danger" onClick={deleteOnClick(course)}>
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
      <Button
        variant="primary"
        size="lg"
        className="mb-3 mt-3"
        onClick={() => setModalShow(true)}
      >
        New Course
      </Button>
      <SuccessMessage />
      {renderCourses}
      <NewCourse show={modalShow} onHide={() => onHideClick()} />
      <EditCourse
        course={courseToEdit}
        show={editModalShow}
        onHide={() => onHideClick()}
        onCompleted={() => onCompletedEvent()}
      />
    </Container>
  );
};

export default Course;
