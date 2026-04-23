import React from 'react';
import { Container, Button, ButtonGroup } from 'react-bootstrap';
import GlobalNavigationBar from './GlobalNavigationBar';

type Props = {
  theme: string;
  setTheme: (theme: string) => void;
};

const SettingsPage: React.FC<Props> = ({ theme, setTheme }) => {
  return (
    <>
      <GlobalNavigationBar />
      <Container fluid className="d-flex flex-column align-items-center mt-4">
        <h1>Settings</h1>
        <br />

        <p>Current Theme: <strong>{theme}</strong></p>

        <ButtonGroup>
          <Button
            variant={theme === "light" ? "primary" : "outline-primary"}
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "primary" : "outline-primary"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
          <Button
            variant={theme === "green" ? "primary" : "outline-primary"}
            onClick={() => setTheme("green")}
          >
            Green
          </Button>
          <Button
            variant={theme === "plum" ? "primary" : "outline-primary"}
            onClick={() => setTheme("plum")}
          >
            Plum
          </Button>
        </ButtonGroup>

        <br />

      </Container>
    </>
  );
};

export default SettingsPage;