import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [registerUser, setRegisterUser] = useState({ name: '', email: '' });
  const [editUser, setEditUser] = useState();
  const [searchUsers, setSearchUsers] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/users')
      .then(response => {
        setUsers(response.data);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/users', registerUser)
      .then(response => {
        setUsers([...users, response.data]);
        setRegisterUser({ name: '', email: '' });
      });
  };

  const handleInputChange = (event) => {
    setRegisterUser({ ...registerUser, [event.target.name]: event.target.value });
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setRegisterUser(user);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    axios.put(`http://localhost:3000/users/${editUser.id}`, registerUser)
      .then(response => {
        setUsers(users.map(user => user.id === editUser.id ? response.data : user));
        setEditUser();
        setRegisterUser({ name: '', email: '' });
      });
  };

  const handleDeleteUser = (user) => {
    axios.delete(`http://localhost:3000/users/${user.id}`)
      .then(response => {
        setUsers(users.filter(u => u.id !== user.id));
      });
  };

  const handleSearchChange = (event) => {
    setSearchUsers(event.target.value);
  };

  const filterUsers = users.filter(user => {
    return user.name.toLowerCase().includes(searchUsers.toLowerCase());
  });

  return (
    <div>
      <input type="text" value={searchUsers} onChange={handleSearchChange} placeholder="Buscar usuario" />
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filterUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {editUser && editUser.id === user.id ? (
                  <form onSubmit={handleUpdate}>
                    <label>
                      Nombre:
                      <input type="text" name="name" value={registerUser.name} onChange={handleInputChange} />
                    </label>
                    <br />
                    <label>
                      Correo:
                      <input type="text" name="email" value={registerUser.email} onChange={handleInputChange} />
                    </label>
                    <br />
                    <button type="submit">Confirmar</button>
                    <button type="button" onClick={() => setEditUser()}>Cancelar</button>
                  </form>
                ) : (
                  <div>
                    <button type="button" onClick={() => handleEdit(user)}>Editar</button>
                    <button type="button" onClick={() => handleDeleteUser(user)}>Eliminar</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" name="name" value={registerUser.name} onChange={handleInputChange} />
        </label>
        <label>
          Correo:
          <input type="text" name="email" value={registerUser.email} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Agregar usuario</button>
      </form>
    </div>
  );
}

export default UserList;