import { useState, useEffect } from "react";
import { Col, Row, Modal, Button, Form } from "react-bootstrap";
import "./Course.scss";
const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const NewCourse = (props) => {
  const [data, setData] = useState({
    name: "",
    capacity: "",
    description: "",
  });

  const [error, setError] = useState(false);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const onKeyDownNumerical = async (e) => {
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
    axios
      .post(
        backendApi + "/courses",
        {
          name: data.name,
          capacity: data.capacity,
          description: data.description,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          props.onHide();
        }
      })
      .catch((err) => console.log(err));
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
        <Row>
          <Col>
            <Form className="left">
              <Form.Group className="pt-3 mb-3">
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Name"
                  id="name"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Capacity</Form.Label>
                <Form.Control
                  type="capacity"
                  placeholder="30"
                  id="capacity"
                  onKeyDown={onKeyDownNumerical}
                  defaultValue={data.capacity}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Col>
          <Col>
            <Form className="left">
              <Form.Group className="pt-3 mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  className="description"
                  placeholder="Prerequisites?"
                  id="description"
                  as="textarea"
                  rows={3}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Submit</Button>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewCourse;
