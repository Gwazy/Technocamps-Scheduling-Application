import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";

const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const EditCourse = (props) => {
  const [event, setEvent] = useState({});
  const [error, setError] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [max, setMax] = useState(20);

  useEffect(() => {
    axios
      .get(backendApi + "/entries/" + props.event)
      .then((response) => {
        if (response.status === 200) {
          let eventData = response.data.data;
          setEvent(eventData);
          console.log(eventData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.show]);

  useEffect(() => {
    setCourseList([]);

    axios
      .get(backendApi + "/courses")
      .then((response) => {
        if (response.status === 200) {
          let listOfCourses = response.data.data;

          for (let course of listOfCourses) {
            if (!course.visability) {
              setCourseList((courseList) => [...courseList, course]);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log(event);
  }, [event]);

  const onKeyDown = async (e) => {
    const re = /^[0-9\b]+$/;

    if (e.key == "Backspace") {
      return;
    }
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = async (e) => {
    const { id, value } = e.target;
    const re = /^[0-9\b]+$/;

    if (id === "capacity") {
      if (re.test(value)) {
        if (value > max) {
          setEvent((data) => ({
            ...data,
            [id]: max,
          }));
        } else {
          setEvent((data) => ({
            ...data,
            [id]: value,
          }));
        }
      }
    } else {
      setEvent((data) => ({
        ...data,
        [id]: !event.online,
      }));
    }
  };

  const handleChangeSelect = (e) => {
    const value = e.label;
    const capacity = e.capacity;
    setMax(capacity);
    setEvent((data) => ({
      ...data,
      name: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .put(backendApi + "/entries", event)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          props.onCompleted();
        }
      })
      .catch((e) => console.log(e));
  };

  const options = courseList.map((item) => {
    return {
      label: item.name,
      value: item.id,
      capacity: item.capacity,
    };
  });

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Course
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="login-form">
          <Form.Group className="pt-3 mb-3">
            <Form.Label>Course </Form.Label>

            <Select
              id="course"
              className="select"
              options={options}
              onChange={handleChangeSelect}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max={max}
              id="capacity"
              onKeyDown={onKeyDown}
              onChange={handleChange}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Online</Form.Label>
            <Form.Check type="checkbox" id="online" onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Submit</Button>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCourse;
