import { Avatar } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Nav, Navbar, Container, Button, Form } from "react-bootstrap";

import "./Navbar.scss";
const axios = require("axios");
const backendApi = "http://localhost:8000/api";

const NavbarComponent = (props) => {
  const handleLogout = () => {
    axios
      .post(backendApi + "/logout")
      .then((response) => {
        if (response.status === 200) {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const LoginStatus = () => {
    if (props.user ? 1 : 0) {
      return (
        <Form inline>
          <Nav.Link>{props.user.username}</Nav.Link>
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
        </Form>
      );
    } else {
      return (
        <Form inline>
          <Button variant="primary" href="/login">
            Login
          </Button>
          <Button variant="primary" href="/register">
            Register
          </Button>
        </Form>
      );
    }
  };

  const LoginRoles = () => {
    if (props.user.isAdmin) {
      return (
        <div>
          <Form inline>
            <Button variant="primary" href="/course">
              Course
            </Button>
          </Form>
        </div>
      );
    }
    if (!props.user.isAdmin) {
      return <Nav>My Bookings</Nav>;
    } else {
      return <div></div>;
    }
  };

  return (
    <Navbar bg="light" className="nav-bar" expand="lg">
      <Container>
        <Navbar.Brand href="/">Technocamps</Navbar.Brand>
        <LoginRoles />
        <LoginStatus />
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
