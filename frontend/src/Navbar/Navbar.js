import React, { useState, useEffect } from "react";
import {
  Nav,
  Navbar,
  Container,
  NavDropdown,
  NavItem,
  Form,
} from "react-bootstrap";
import LoginBox from "../Componets/Login/LoginBox";
import LoginButton from "../Componets/Login/LoginButton";

import "./Navbar.scss";

const NavbarComponent = () => {
  const [loginStatus, toggleLogin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      toggleLogin(false);
    } else {
      toggleLogin(true);
    }
  }, []);

  const handleLogout = (e) => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const DisplayLogin = (props) => {
    if (!loginStatus) {
      return (
        <Nav
          style={{
            visibility: props.visability === "false" ? "hidden" : "inherited",
          }}
        >
          <LoginBox></LoginBox>
          <LoginButton></LoginButton>
        </Nav>
      );
    }

    return (
      <Nav>
        <Nav.Link href="/" onClick={handleLogout}>
          Logout
        </Nav.Link>
        <Nav.Link href="/profile">My Account</Nav.Link>
        <Nav.Link href="/rooms">Rooms</Nav.Link>
      </Nav>
    );
  };

  return (
    <Navbar className="nav-bar" bg="light" expand="md">
      <Container className="flex-container">
        <DisplayLogin visability="false" />

        <Navbar.Brand id="resize" className="center">
          Technocamps
        </Navbar.Brand>

        <DisplayLogin />
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
