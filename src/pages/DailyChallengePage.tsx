import React from 'react';
import { Container } from 'react-bootstrap';
import GlobalNavigationBar from './GlobalNavigationBar';

const DailyChallengePage  : React.FC = () => {
  return (
    <>
      <GlobalNavigationBar /> 
      <Container fluid className="d-flex flex-column align-items-center">
        <h1>Daily Challenge</h1>
        <br />
        <p>The Daily Challenge is yet to be implemented. :3</p>
      </Container>
    </>   
  );
};

export default DailyChallengePage;