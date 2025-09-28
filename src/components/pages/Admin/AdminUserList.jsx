import React, { useEffect, useState } from "react";
import { GetAllUsers } from "../../../services/userServices";
import "../../../styles/adminUserList.scss";

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [errorMsg, setErrorMsg] = useState("")

    function showErrorMsg(message) {
        setErrorMsg(message)
        setTimeout(() => {
            setErrorMsg("")
        }, 2000);
    }

    async function loadUsers() {
        try {
            const data = await GetAllUsers();
            setUsers(data);
        }
        catch (error) {
            if (error.status && error.status === 500) {
                showErrorMsg("We're experiencing technical difficulties. Please try again shortly.")
            } else if (error.request) {
                showErrorMsg("The server seems to be taking too long to respond. Please try again in a moment.");
            } else {
                showErrorMsg("Something went wrong. Please try again.");
            }
            console.log("An error occurred while fetching Users:", error);
        }
    }

    useEffect(() => {
        loadUsers();
    }, [])

    if (errorMsg) {
        return (
            <div className="errorMsg">{errorMsg}</div>
        )
    }

    return (
        <div className="users-table">
            <h1>Users list</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td data-label="ID">{user.id}</td>
                            <td data-label="Full Name">{`${user.name} ${user.surname}`}</td>
                            <td data-label="Username">{user.username}</td>
                            <td data-label="Email">{user.email}</td>
                            <td data-label="Role">{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminUserList;