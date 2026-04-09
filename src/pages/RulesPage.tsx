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
        <p>Guess as many words as you can in the word sequence. You win once all words have been guessed.</p>
        <ul>
          <li>The first letter of the first word is revealed.</li>
          <li>Subsequent words' first letters are the same as the previous word's last letter.</li>
          <li>Each word must be guessed letter by letter, in order.</li>
        </ul>
      </Container>
    </>   
  );
};

export default RulesPage;