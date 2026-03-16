import React from 'react';
import { Container } from 'react-bootstrap';
import GlobalNavigationBar from './GlobalNavigationBar';

const MultiPlayerPage  : React.FC = () => {
  return (
    <>
      <GlobalNavigationBar /> 
      <Container fluid className="d-flex flex-column align-items-center">
        <h1>Multi Player</h1>
        <br />
        <p>The Multi Player mode is yet to be implemented. :3</p>
      </Container>
    </>     
  );
};

export default MultiPlayerPage;