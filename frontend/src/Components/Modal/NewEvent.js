import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./NewEvent.scss";

const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const NewEvent = (props) => {
  const [error, setError] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [data, setData] = useState({
    name: "Example Course 1",
    bookingDate:
      props.date.month + 1 + "/" + props.date.day + "/" + props.date.year,
    bookingTime: props.date.hour,
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
    axios
      .get(backendApi + "/courses")
      .then((response) => {
        if (response.status === 200) {
          setCourseList([]);
          let listOfCourses = response.data.data;

          for (let course of listOfCourses) {
            setCourseList((courseList) => [...courseList, course]);
          }
        }
        console.log(courseList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //  Allows for updating useState constantly
  useEffect(() => {
    console.log(data);
  }, [data]);

  const onKeyDown = async (e) => {
    const re = /^[0-9\b]+$/;
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
          [id]: value,
        }));
      }
    } else {
      setData((data) => ({
        ...data,
        [id]: value,
      }));
    }
    //console.log(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setData({
      name: "Example Course 1",
      bookingDate:
        props.date.month + 1 + "/" + props.date.day + "/" + props.date.year,
      bookingTime: props.date.hour,
      online: false,
      capacity: "5",
      userId: props.user.id,
    });
    axios
      .post(
        backendApi + "/entries",
        {
          name: data.name,
          bookingDate: data.bookingDate,
          bookingTime: data.bookingTime,
          online: data.online,
          userId: props.user.id,
          capacity: data.capacity,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          if (response.data.message != "Authentication Successful") {
            return setError(response.data.message);
          }
        } else {
          console.log(response);
        }
      })
      .catch((e) => console.log(e));
  };

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
              <Form.Select id="course" onChange={handleChange}></Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="20"
                id="capacity"
                onKeyDown={onKeyDown}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Online</Form.Label>
              <Form.Check
                type="checkbox"
                id="online"
                defaultValue={false}
                onChange={handleChange}
              />
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
