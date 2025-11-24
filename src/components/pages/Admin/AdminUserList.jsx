import React, { useEffect, useState } from "react";
import { GetAllUsers } from "../../../services/userServices";
import "../../../styles/adminUserList.scss";
import AdminAddUserForm from "../../forms/admin/AdminAddUserForm";
import { Button } from "@mui/material";

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [errorMsg, setErrorMsg] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [openAddModal, setOpenAddModal] = useState(false);

    const handleOpenModal = () => setOpenAddModal(true);
    const handleCloseModal = () => {
        loadUsers();
        setOpenAddModal(false);
    }

    function showErrorMsg(message) {
        setErrorMsg(message)
        setTimeout(() => {
            setErrorMsg("")
        }, 2000);
    }

    function showSuccessMsg(message) {
        setSuccessMsg(message)
        setTimeout(() => {
            setSuccessMsg("")
        }, 2000);
    }


    async function loadUsers() {
        try {
            const data = await GetAllUsers();
            setUsers(data);
            console.log(data)
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
        <>
            <div className="successMsg">{successMsg}</div>
            <div className="users-list-header">
                <h1>Users List</h1>
                <Button variant="contained" onClick={handleOpenModal}>
                    Add User
                </Button>
            </div>

            <div className="users-table">

                <table>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td data-label="Full Name">{`${user.name} ${user.surname}`}</td>
                                <td data-label="Username">{user.userName}</td>
                                <td data-label="Email">{user.email}</td>
                                <td data-label="Role">{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <AdminAddUserForm open={openAddModal} handleClose={handleCloseModal} errorMsg={showErrorMsg} successMsg={showSuccessMsg} />
            </div>
        </>

    )
}

export default AdminUserList;