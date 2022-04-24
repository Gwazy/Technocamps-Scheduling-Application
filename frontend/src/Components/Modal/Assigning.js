import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";

const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const Assigning = (props) => {
  const [staff, setStaff] = useState([]);
  const [data, setData] = useState({
    staffId: "",
    eventId: props.booking.id,
  });

  useEffect(() => {
    setStaff([]);
    axios
      .get(backendApi + "/users")
      .then((response) => {
        if (response.status === 200) {
          let userData = response.data.data;

          for (let user of userData) {
            if (user.isStaff === true) {
              setStaff((staff) => [...staff, user]);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.show]);

  const handleChangeSelect = (e) => {
    const value = e.value;
    setData((data) => ({
      ...data,
      staffId: value,
    }));
  };

  const options = staff.map((item) => {
    return {
      label: item.username,
      value: item.id,
    };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .post(
        backendApi + "/schedules",
        {
          staffId: data.staffId,
          eventId: props.booking.id,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          props.booking.pending = false;
          props.booking.confirmation = true;

          axios
            .put(backendApi + "/entries", props.booking)
            .then((response) => {
              if (response.status === 200) {
                props.onHide();
              }
            })
            .catch((error) => console.log(error));
        }
      });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Assigning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="pt-3 mb-3">
            <Form.Label>Assign staff to task</Form.Label>
            <Select
              id="staff"
              className="select"
              options={options}
              onChange={handleChangeSelect}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Assign</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Assigning;
