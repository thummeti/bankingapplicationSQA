import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { getAllUsers, enableUser, disableUser } from "../../context/Database";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers()
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => console.error("Error fetching users:", error));
    }, []);

    console.log(users)
    const handleEnable = (userId) => {
        enableUser(userId).then(() => {
            setUsers(users.map(user => user._id === userId ? { ...user, status: 'active' } : user));
        });
    };

    const handleDisable = (userId) => {
        disableUser(userId).then(() => {
            setUsers(users.map(user => user._id === userId ? { ...user, status: 'inactive' } : user));
        });
    };

    return (
        <Container>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.status}</td>
                        <td>
                            {user.status === 'active' ? (
                                <Button variant="danger" onClick={() => handleDisable(user._id)}>Disable</Button>
                            ) : (
                                <Button variant="success" onClick={() => handleEnable(user._id)}>Enable</Button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}
