import React from "react";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { Container } from "react-bootstrap";

const Register = () => {
  const [data, setData] = useState({
    forename: "",
    surname: "",
    email: "",
    dob: "",
    password: "",
  });
  const [registered, setRegistered] = useState(false);

  const [error, setError] = useState("");

  return (
    <Container>
      <Form className="login-form mt-5">
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Username"
            id="username"
            defaultValue={data.username}
            onChange={null}
          ></Form.Control>

          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Email"
            id="emailaddress"
            defaultValue={data.emailadress}
            onChange={null}
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
            onChange={null}
          />
          <Form.Label>Surname</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Surname"
            id="surname"
            defaultValue={data.surname}
            onChange={null}
          />
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Address"
            id="address"
            defaultValue={data.address}
            onChange={null}
          />
          <Form.Label>Postcode</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Postcode"
            id="postcode"
            defaultValue={data.postcode}
            onChange={null}
          />
          <Form.Label>Phonenumber</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter phonenumber"
            id="phonenumber"
            defaultValue={data.phonenumber}
            onChange={null}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            id="password"
            defaultValue={data.password}
            onChange={null}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="button"
          className="mt-3"
          onClick={null}
          disabled={data.hasRegistered}
        >
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
