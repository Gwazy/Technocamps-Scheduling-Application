import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const Details = (props) => {
  const [event, setEvent] = useState("");

  useEffect(() => {
    axios
      .get(backendApi + "/courses")
      .then((response) => {
        if (response.status === 200) {
          let eventData = response.data.data;
          eventData.filter((entrie) => {
            if (entrie.name === props.event) {
              setEvent(entrie.description);
            }
          });
          if (event === "") {
            setEvent("Description is lost! Contact Technocamps!");
          }
          console.log(event);
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
          Entry Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2>You will need</h2>
        <p>{event}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Details;
