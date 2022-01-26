import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const NewCourse = (props) => {
  const [data, setData] = useState({});

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
        <Modal.Title id="contained-modal-title-vcenter">
          Create Course
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4></h4>
        <Form className="login-form">
          <Form.Group className="pt-3 mb-3">
            <Form.Label>Course Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Name"
              id="name"
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={null}>Submit</Button>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewCourse;
