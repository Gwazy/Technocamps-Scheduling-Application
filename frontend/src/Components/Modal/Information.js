import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const Information = (props) => {
  const [data, setData] = useState("");

  useEffect(() => {
    setData("");
    axios
      .get(backendApi + "/schedules")
      .then((response) => {
        if (response.status === 200) {
          let scheduleData = response.data.data;
          for (let ele of scheduleData) {
            if (ele.Entry.id === props.booking.id) {
              let tempString =
                ele.User.firstname +
                " " +
                ele.User.surname +
                " employee number " +
                ele.User.id;
              setData(tempString);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.show]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Assigned Employee
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>This course has been assigned to {data} </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Information;
