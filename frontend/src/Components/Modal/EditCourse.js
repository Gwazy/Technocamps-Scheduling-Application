import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const EditCourse = (props) => {
  const [data, setData] = useState([]);
  const [course, setCourse] = useState({});

  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(backendApi + "/courses/" + props.course).then((response) => {
      if (response.status === 200) {
        let courseData = response.data.data;

        setCourse(courseData);
      }
    });
  }, [props.show]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const onKeyDownNumerical = async (e) => {
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
        setCourse((course) => ({
          ...course,
          [id]: value,
        }));
      }
    } else {
      setCourse((course) => ({
        ...course,
        [id]: value,
      }));
    }
    //console.log(data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .put(backendApi + "/courses", course)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          props.onCompleted();
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
          Edit Course
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
                  value={course.name}
                  id="name"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Capacity</Form.Label>
                <Form.Control
                  type="capacity"
                  value={course.capacity}
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
                  value={course.description}
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

export default EditCourse;
