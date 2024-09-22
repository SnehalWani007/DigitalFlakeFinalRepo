import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Dashboard from './Dashboard'; // Import the Dashboard component

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  const Message = styled.p`
    color: #e74c3c;
    text-align: center;
    margin-top: 10px;
  `;

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      setMessage(response.data);
      setIsLoggedIn(true); // Set logged in state to true on successful login
    } catch (error) {
      setMessage(error.response.data);
    }
  };

  // Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup", {
        email,
        password,
      });
      setMessage(response.data);
    } catch (error) {
      setMessage(error.response.data);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setIsLoggedIn(false); // Set logged out state
    setEmail(""); // Clear email field
    setPassword(""); // Clear password field
    setMessage(""); // Clear message
  };

  return (
    <Container>
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} /> // Pass logout handler to Dashboard
      ) : (
        <Content>
          <InstagramLogo
            style={{
              backgroundImage:
                "url(https://static.cdninstagram.com/rsrc.php/v3/yS/r/ajlEU-wEDyo.png)",
              backgroundPosition: "0px -52px",
              backgroundSize: "auto",
              width: "175px",
              height: "51px",
              backgroundRepeat: "no-repeat",
              display: "inline-block",
            }}
            aria-label="Instagram"
          ></InstagramLogo>

          <Title>Digital Flake</Title>
          <div style={{ marginTop: '10px' }}>
            Welcome to Digital Flake Admin
          </div>
          <Form onSubmit={isSignup ? handleSignup : handleLogin}>
            <Inputs>
              <Label>
                <Input
                  required
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Span>Email</Span>
              </Label>
              <Label>
                <Input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Span>Password</Span>
              </Label>
            </Inputs>
            <LoginButton type="submit">
              {isSignup ? "Sign Up" : "Log In"}
            </LoginButton>
          </Form>

          <OrText>
            <span></span>
            <span>OR</span>
            <span></span>
          </OrText>

          <ForgotButtons>
            <ToggleSignupButton onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Already have an account? Log In" : "Sign Up Instead"}
            </ToggleSignupButton>
          </ForgotButtons>

          <Message>{message}</Message>
        </Content>
      )}
    </Container>
  );
}

export default App;

const Container = styled.div`
  border-radius: 1px;
  padding: 50px 40px 20px 40px;
  box-sizing: border-box;
  font-family: sans-serif;
  color: #737373;
  border: 1px solid rgb(219, 219, 219);
  text-align: center;
  background: white;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InstagramLogo = styled.i`
  margin-bottom: 41px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 14px;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const Label = styled.label`
  border: 1px solid rgb(219, 219, 219);
  display: flex;
  align-items: center;
  position: relative;
  min-width: 268px;
  height: 38px;
  background: rgb(250, 250, 250);
  border-radius: 3px;
`;

const Input = styled.input`
  width: 100%;
  background: inherit;
  border: 0;
  outline: none;
  padding: 9px 8px 7px 8px;
  text-overflow: ellipsis;
  font-size: 16px;
  vertical-align: middle;

  &:valid + span {
    transform: scale(calc(10 / 12)) translateY(-10px);
  }

  &:valid {
    padding: 14px 0 2px 8px;
    font-size: 12px;
  }
`;

const Span = styled.span`
  position: absolute;
  text-overflow: ellipsis;
  transform-origin: left;
  font-size: 12px;
  left: 8px;
  pointer-events: none;
  transition: transform ease-out 0.1s;
`;

const LoginButton = styled.button`
  background: rgb(0, 149, 246);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  padding: 7px 16px;
  cursor: pointer;

  &:hover {
    background: rgb(24, 119, 242);
  }

  &:active:not(:hover) {
    background: rgb(0, 149, 246);
    opacity: 0.7;
  }
`;

const OrText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
  font-size: 13px;
  column-gap: 18px;
  margin-top: 18px;

  span:nth-child(3),
  span:nth-child(1) {
    display: block;
    width: 100%;
    height: 1px;
    background-color: rgb(219, 219, 219);
  }
`;

const ForgotButtons = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 28px;
  row-gap: 21px;
`;

const ToggleSignupButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #385185;
  font-size: 14px;
  font-weight: 600;
`;

const Title = styled.div`
  font-weight: bold;
  color: blue;
  margin-bottom: 10px; /* Adjust as needed */
`;