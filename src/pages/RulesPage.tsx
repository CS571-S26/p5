import React from 'react';
import { Container } from 'react-bootstrap';
import GlobalNavigationBar from './GlobalNavigationBar';

const RulesPage  : React.FC = () => {
  return (
    <>
      <GlobalNavigationBar /> 
      <Container fluid className="d-flex flex-column align-items-center">
        <h1>Rules</h1>
        <br />
        <p>The rules are yet to be written. :3</p>
      </Container>
    </>   
  );
};

export default RulesPage;