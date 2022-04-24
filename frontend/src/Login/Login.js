import React from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const Login = (props) => {
  const [error, setError] = useState(false);
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  if (props.user) {
    navigate("/");
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        backendApi + "/login",
        {
          username: data.username,
          password: data.password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        // console.log(response);

        if (response.status === 200) {
          if (response.data.message != "Authentication Successful") {
            return setError(true);
          }
          setError("");
          navigate("/");
          window.location.reload();
        }
      })
      .catch((e) => {
        setError(true);
        console.log(e);
      });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((data) => ({
      ...data,
      [id]: value,
    }));
    console.log(data);
  };

  const ShowError = () => {
    if (error) {
      return (
        <div>
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>You have entered a incorrect username/password</p>
          </Alert>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  return (
    <Container className="mt-5">
      <ShowError />
      <Form className="login-form">
        <Form.Group className="pt-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="email"
            placeholder="Username"
            id="username"
            defaultValue={data.username}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="pt-5">
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
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
