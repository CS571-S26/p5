import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Card } from 'react-bootstrap';
import GlobalNavigationBar from './GlobalNavigationBar';

const Home: React.FC = () => {
  return (
    <>
      <GlobalNavigationBar />

      <Container className="d-flex justify-content-center">
        <div className="text-center">
          <h1>Welcome to the home page!</h1>
          <Card className="p-4 mx-auto" style={{ width: '100%', maxWidth: '400px' }}>
            <div className='d-grid gap-2'>
              <Link to="/daily-challenge">
                <Button variant="primary" size="lg" className="w-100">Today's Challenge!</Button>
              </Link>
              <Link to="/single-player">
                <Button variant="secondary" size="lg" className="w-100">Single Player</Button>
              </Link>
              <Link to="/multi-player">
                <Button variant="secondary" size="lg" className="w-100">Multi Player</Button>
              </Link>
              <Link to="/rules">
                <Button variant="dark" size="lg" className="w-100">Rules</Button>
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default Home;