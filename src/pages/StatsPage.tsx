import React from 'react';
import { Container } from 'react-bootstrap';
import GlobalNavigationBar from './GlobalNavigationBar';

const StatsPage  : React.FC = () => {
  return (
    <>
      <GlobalNavigationBar /> 
      <Container fluid className="d-flex flex-column align-items-center">
        <h1>Stats</h1>
        <br />
        <p>The stats page is yet to be implemented. :3</p>
      </Container>
    </>     
  );
};

export default StatsPage;