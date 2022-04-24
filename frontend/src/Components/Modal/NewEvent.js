import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import "./NewEvent.scss";

const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const NewEvent = (props) => {
  const [error, setError] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [max, setMax] = useState(20);
  const [data, setData] = useState({
    online: false,
    capacity: "5",
    userId: props.user.id,
  });

  if (props.date.hour < 12) {
    props.date.time = "AM";
    props.date.time2 = "AM";
    if (props.date.hour === 11) {
      props.date.time2 = "PM";
    }
  } else {
    props.date.time = "PM";
    props.date.time2 = "PM";
  }

  let bookingDate = new Date(
    props.date.month + 1 + " " + props.date.day + " " + props.date.year
  );

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

  //  Allows for updating useState constantly
  useEffect(() => {
    console.log("data");
  }, [data]);

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
        setData((data) => ({
          ...data,
          capacity: value,
        }));
      }
    } else {
      setData((data) => ({
        ...data,
        [id]: !data.online,
      }));
    }
    console.log(data);
  };

  const handleChangeSelect = (e) => {
    const value = e.label;
    const capacity = e.capacity;
    setMax(capacity);
    setData((data) => ({
      ...data,
      name: value,
    }));

    console.log(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Number(data.capacity) > max) {
      data.capacity = max;
      console.log(data.capacity);
    }

    axios
      .post(
        backendApi + "/entries",
        {
          name: data.name,
          bookingDate:
            props.date.month + 1 + "/" + props.date.day + "/" + props.date.year,
          bookingTime: props.date.hour,
          online: data.online,
          userId: props.user.id,
          capacity: data.capacity,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(props.user.id);
        props.onCompleted();
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
        <Modal.Title id="contained-modal-title-vcenter">Book Event</Modal.Title>
      </Modal.Header>
      {props.initialdate > bookingDate ? (
        <Modal.Body>
          <h4>Unable to book this date. Please Select another Date</h4>
        </Modal.Body>
      ) : (
        <Modal.Body>
          <h4>
            {props.date.day}/{props.date.month + 1}/{props.date.year} <br></br>
            {props.date.hour}
            {props.date.time} - {props.date.hour + 1}
            {props.date.time2}
          </h4>

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
      )}
      {props.initialdate > bookingDate ? (
        <Modal.Footer>
          <Button onClick={props.onHide}>Cancel</Button>
        </Modal.Footer>
      ) : (
        <Modal.Footer>
          <Button onClick={handleSubmit}>Submit</Button>
          <Button onClick={props.onHide}>Cancel</Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default NewEvent;
