import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Modal from './Modal'; // Import the modal component

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [status, setStatus] = useState('active');
  const [editingRole, setEditingRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const response = await axios.get('http://localhost:5000/roles');
    setRoles(response.data);
  };

  const handleAddOrUpdateRole = async (e) => {
    e.preventDefault();
    if (editingRole) {
      await axios.put(`http://localhost:5000/roles/${editingRole.id}`, {
        role_name: roleName,
        status,
      });
    } else {
      await axios.post('http://localhost:5000/roles', {
        role_name: roleName,
        status,
      });
    }
    setRoleName('');
    setStatus('active');
    setEditingRole(null);
    setIsModalOpen(false); // Close the modal
    fetchRoles();
  };

  const handleEdit = (role) => {
    setRoleName(role.role_name);
    setStatus(role.status);
    setEditingRole(role);
    setIsModalOpen(true); // Open the modal for editing
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/roles/${id}`);
    fetchRoles();
  };

  // Filter roles based on search query
  const filteredRoles = roles.filter(role =>
    role.role_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <h1>Roles</h1>
        <SearchInput
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by role name"
        />
        <AddButton onClick={() => setIsModalOpen(true)}>Add Role</AddButton>
      </Header>

      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Role Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.role_name}</td>
              <td>{role.status}</td>
              <td>
                <Button onClick={() => handleEdit(role)}>Edit</Button>
                <Button onClick={() => handleDelete(role.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{editingRole ? 'Edit Role' : 'Add Role'}</h2>
        <Form onSubmit={handleAddOrUpdateRole}>
          <Input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Role Name"
            required
          />
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
          <Button type="submit">{editingRole ? 'Update Role' : 'Add Role'}</Button>
        </Form>
      </Modal>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  margin-right: 10px;
  padding: 8px;
  width: 200px;
`;

const AddButton = styled.button`
  background-color: green;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;

  &:hover {
    background-color: darkgreen;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 8px;
`;

const Select = styled.select`
  margin-bottom: 10px;
  padding: 8px;
`;

const Button = styled.button`
  padding: 8px;
  background-color: blue;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: darkblue;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: yellow; /* Set header background color to yellow */
    color: black; /* Optional: Set text color for better contrast */
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

export default Roles;