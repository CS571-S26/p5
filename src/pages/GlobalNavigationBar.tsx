import React from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';

const GlobalNavigationBar  : React.FC = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="mb-4">
      <Container fluid >
        <Navbar.Brand href="/">8Word</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/daily-challenge">Today's Challenge</Nav.Link>
          <Nav.Link href="/single-player">Single Player</Nav.Link>
          <Nav.Link href="/multi-player">Multi Player</Nav.Link>
          <Nav.Link href="/rules">Rules</Nav.Link>
        </Nav>
        <Button variant="outline-light">Login</Button>
      </Container>
    </Navbar>  
  );
};

export default GlobalNavigationBar;