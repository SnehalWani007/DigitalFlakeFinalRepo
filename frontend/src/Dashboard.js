import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Roles from "./Roles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const Dashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState("home");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    if (activePage === "roles") {
      fetchRoles();
    }
  }, [activePage]);

  const handleNavClick = (page) => {
    setActivePage(page);
  };

  const renderContent = () => {
    switch (activePage) {
      case "home":
        return <Content>Welcome To Digital Flake</Content>;
      case "users":
        return <Content>List of Users</Content>;
      case "roles":
        return (
          <Router>
            <Content>
              <Routes>
                <Route path="/roles" element={<Roles />} />
              </Routes>
            </Content>
          </Router>
        );
      default:
        return null;
    }
  };

  const handleLogoutClick = () => {
    setShowConfirmLogout(true);
  };

  const confirmLogout = () => {
    onLogout();
    setShowConfirmLogout(false);
  };

  const cancelLogout = () => {
    setShowConfirmLogout(false);
  };

  return (
    <Container>
      <Header>
        <Title>Digital Flake</Title>
      </Header>
      <Main>
        <Sidebar>
          <NavItem active={activePage === "home"} onClick={() => handleNavClick("home")}>
            Home ➔
          </NavItem>
          <NavItem active={activePage === "users"} onClick={() => handleNavClick("users")}>
            Users ➔
          </NavItem>
          <NavItem active={activePage === "roles"} onClick={() => handleNavClick("roles")}>
            Roles ➔
          </NavItem>
        </Sidebar>
        <ContentArea>{renderContent()}</ContentArea>
        <LogoutButton onClick={handleLogoutClick}>Logout</LogoutButton>
      </Main>
      {showConfirmLogout && (
        <ConfirmLogoutModal>
          <ModalContent>
            <h2>Are you sure you want to logout?</h2>
            <ButtonContainer>
              <ConfirmButton onClick={confirmLogout}>Confirm</ConfirmButton>
              <CancelButton onClick={cancelLogout}>Cancel</CancelButton>
            </ButtonContainer>
          </ModalContent>
        </ConfirmLogoutModal>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Header = styled.header`
  background-color: purple;
  color: white;
  padding: 10px;
  text-align: left;
`;

const Title = styled.h1`
  margin: 0;
`;

const Main = styled.div`
  display: flex;
  flex: 1;
  position: relative;
`;

const Sidebar = styled.div`
  background: #f4f4f4;
  width: 200px;
  padding: 20px;
  position: sticky;
  top: 0;
  height: 100%;
`;

const NavItem = styled.div`
  margin: 10px 0;
  cursor: pointer;
  padding: 10px;
  background-color: ${(props) => (props.active ? "yellow" : "transparent")}; /* Yellow background if active */
  color: ${(props) => (props.active ? "black" : "black")}; /* Text color */
  border-radius: 5px; /* Rounded corners */
  display: flex;
  align-items: center;

  &:hover {
    background-color: lightgray; /* Change to light gray on hover */
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  background: white;
`;

const Content = styled.div`
  font-size: 24px;
`;

const LogoutButton = styled.button`
  position: absolute;
  right: 20px;
  top: 20px;
  background: red;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
`;

// Confirmation Modal Styles
const ConfirmLogoutModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
`;

const ConfirmButton = styled.button`
  background: green;
  color: white;
  border: none;
  padding: 10px 15px;
  margin-right: 10px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
`;

export default Dashboard; // Ensure this line is present
