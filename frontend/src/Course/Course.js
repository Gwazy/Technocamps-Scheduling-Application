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
import NewCourse from "../Components/Modal/NewCourse";
import EditCourse from "../Components/Modal/EditCourse";

const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const Course = () => {
  const [modalShow, setModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(true);

  const didMount = useRef(false);

  useEffect(() => {
    if (didMount) {
      axios
        .get(backendApi + "/courses")
        .then((response) => {
          if (response.status === 200) {
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

  const visabilityToggle = (course) => (e) => {
    course.visability = !course.visability;
    setToggle(!toggle);

    axios
      .put(backendApi + "/courses", course)
      .then((response) => {
        if (response.status === 200) {
          setData([]);

          console.log(course.name + " is " + course.visability);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
                      onClick={visabilityToggle(course)}
                    >
                      Show Course
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={visabilityToggle(course)}
                    >
                      Hide Course
                    </Button>
                  )}
                </ButtonGroup>
                <ButtonGroup className="me-2">
                  <Button
                    variant="primary"
                    onClick={() => setEditModalShow(true)}
                  >
                    Edit
                  </Button>
                </ButtonGroup>
                <ButtonGroup className="me-2">
                  <Button variant="danger">Delete</Button>
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
      {renderCourses}
      <NewCourse show={modalShow} onHide={() => setModalShow(false)} />
      <EditCourse show={editModalShow} onHide={() => setEditModalShow(false)} />
    </Container>
  );
};

export default Course;
