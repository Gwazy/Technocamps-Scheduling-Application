import React from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Register.scss";
const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const Register = () => {
  const [data, setData] = useState({
    username: "",
    emailaddress: "",
    firstname: "",
    surname: "",
    address: "",
    postcode: "",
    phonenumber: "",
    password: "",
    isAdmin: "false",
  });

  const navigate = useNavigate();
  const [error, setError] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError([]);
    validateInputFields();

    axios
      .post(
        backendApi + "/register",
        {
          username: data.username,
          emailaddress: data.emailaddress,
          firstname: data.firstname,
          surname: data.surname,
          address: data.address,
          postcode: data.postcode,
          phonenumber: data.phonenumber,
          password: data.password,
          isAdmin: "false",
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.status);

        if (response.status === 200) {
          navigate("/");
        }
      })
      .catch((err) => {
        for (let e of err.response.data.message) {
          setError((err) => [...err, e]);
        }
        console.log(error);
      });
  };

  const validateInputFields = () => {
    if (data.username === "") {
      setError((err) => [...err, "No input for Username field"]);
    }
    if (data.emailaddress === "") {
      setError((err) => [...err, "No input for Email Address field"]);
    }
    if (data.firstname === "") {
      setError((err) => [...err, "No input for Forename field"]);
    }
    if (data.surname === "") {
      setError((err) => [...err, "No input for Surname field"]);
    }
    if (data.address === "") {
      setError((err) => [...err, "No input for Address field"]);
    }
    if (data.emailaddress === "") {
      setError((err) => [...err, "No input for Phone Number"]);
    }
    if (data.password === "") {
      setError((err) => [...err, "No input for Password field"]);
    }
  };

  const onKeyDownNumerical = async (e) => {
    const re = /^[0-9\b]+$/;
    console.log(re.test(e.key));
    console.log(e.key);
    if (e.key == "Backspace") {
      return;
    }
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  };

  const renderError = error.map((err) => <div>{err}</div>);

  const ShowError = () => {
    if (error != "") {
      return (
        <div>
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            {renderError}
          </Alert>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  const handleChange = async (e) => {
    const { id, value } = e.target;
    const re = /^[0-9\b]+$/;

    if (id === "phonenumber") {
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
  };

  return (
    <Container className="control">
      <ShowError></ShowError>
      <Form className="mt-5 mb-5">
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Username"
            id="username"
            defaultValue={data.username}
            onChange={handleChange}
          ></Form.Control>

          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Email"
            id="emailaddress"
            defaultValue={data.emailadress}
            onChange={handleChange}
          ></Form.Control>

          <Form.Text className="text-muted ">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label className="mt-2">Forename</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Forename"
            id="firstname"
            defaultValue={data.firstname}
            onChange={handleChange}
          />
          <Form.Label>Surname</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Surname"
            id="surname"
            defaultValue={data.surname}
            onChange={handleChange}
          />
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Address"
            id="address"
            defaultValue={data.address}
            onChange={handleChange}
          />
          <Form.Label>Postcode</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Postcode"
            id="postcode"
            defaultValue={data.postcode}
            onChange={handleChange}
          />
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            onKeyDown={onKeyDownNumerical}
            placeholder="Enter phone number"
            id="phonenumber"
            defaultValue={data.phonenumber}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            id="password"
            defaultValue={data.password}
            onChange={handleChange}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="button"
          className="mt-3"
          onClick={handleSubmit}
        >
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
