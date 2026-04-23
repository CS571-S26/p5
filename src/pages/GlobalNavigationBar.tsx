import React from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const GlobalNavigationBar  : React.FC = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="mb-4">
      <Container fluid >
        <Navbar.Brand href="/">8Word</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/daily-challenge">Today's Challenge</Nav.Link>
          <Nav.Link as={NavLink} to="/single-player">Single Player</Nav.Link>
          <Nav.Link as={NavLink} to="/stats">Stats</Nav.Link>
          <Nav.Link as={NavLink} to="/rules">Rules</Nav.Link>
          <Nav.Link as={NavLink} to="/settings">Settings</Nav.Link>
        </Nav>
        <Button variant="outline-light">Login</Button>
      </Container>
    </Navbar>  
  );
};

export default GlobalNavigationBar;