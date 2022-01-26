import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const NewEvent = (props) => {
  const [data, setData] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        backendApi + "/course",
        {
          username: data.username,
          password: data.password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          if (response.data.message != "Authentication Successful") {
            return setError(response.data.message);
          }
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
            <Form.Control
              type="course"
              placeholder="Course"
              id="course"
              defaultValue={data.course}
              onChange={null}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="capacity"
              placeholder="30"
              id="capacity"
              defaultValue={data.capacity}
              onChange={null}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Online</Form.Label>
            <Form.Check
              type="checkbox"
              id="online"
              defaultValue={data.online}
              onChange={null}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={null}>Submit</Button>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewEvent;
