import React, { useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import NewCourse from "../Components/Modal/NewCourse";
const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const Course = () => {
  const [modalShow, setModalShow] = useState(false);

  const data = [{ name: "test1" }, { name: "test2" }];
  const listItems = data.map((d) => <li key={d.name}>{d.name} Hello</li>);

  return (
    <Container>
      <div>Create new Course</div>
      {listItems}
    </Container>
  );
};

export default Course;
