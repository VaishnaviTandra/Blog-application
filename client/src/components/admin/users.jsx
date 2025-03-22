import { useAuth } from '@clerk/clerk-react';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { userAuthorContextobj } from '../../contexts/userAuthorContext';
import { MdBlock } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";

function Users() {
    const [user, setUser] = useState([]);  // FIX: State should be "user" not "users"
    const [error, setError] = useState('');
    const { getToken } = useAuth();
    const { currentUser } = useContext(userAuthorContextobj);

    async function getUsers() {
        try {
            const token = await getToken();
            const res = await axios.get('http://localhost:3000/admin-api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.message === 'Users retrieved') {
                setUser(res.data.payload);  // FIX: Using "user" state correctly
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        }
    }

    async function blockUsers(email) {
        try {
            const blockRes = await axios.put(`http://localhost:3000/admin-api/block/${email}`);
            if (blockRes.data.message === "User blocked") {
                alert(`${email} has been blocked.`);
                await getUsers();  // Ensure users are refreshed
            } else {
                setError(blockRes.data.message);
            }
        } catch (error) {
            console.error("Error blocking user:", error);
            setError('Failed to block user');
        }
    }

    async function unblockUsers(email) {
        try {
            const unblockRes = await axios.put(`http://localhost:3000/admin-api/unblock/${email}`);
            if (unblockRes.data.message === "User unblocked") {
                alert(`${email} has been unblocked.`);
                await getUsers();  // Ensure users are refreshed
            } else {
                setError(unblockRes.data.message);
            }
        } catch (error) {
            console.error("Error unblocking user:", error);
            setError('Failed to unblock user');
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="mt-4">
            {error && <p className="text-danger">{error}</p>}
            <div className="table-responsive">
                <table className="table table-dark table-striped table-hover">
                    <thead>
                        <tr>
                            <th className="profile-column">Profile</th> {/* Added profile-column */}
                            <th className="role-column">Role</th>
                            <th className="email-column">Email</th>
                            <th className="status-column">Status</th> {/* Added status-column */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.map((userObj) => (  // FIX: Using "user.map()" correctly
                            <tr key={userObj.email}>
                                <td className="profile-column">
                                    <img src={userObj.profileImageUrl} width="40px" className="rounded-circle" alt="Profile" />
                                </td>
                                <td className="role-column">{userObj.role}</td>
                                <td className="email-column">{userObj.email}</td>
                                <td className="status-column">{userObj.status}</td> {/* Added status-column */}
                                <td>
                                    {userObj.isBlocked ? (
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => unblockUsers(userObj.email)}
                                        >
                                            <CgUnblock /> Unblock
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => blockUsers(userObj.email)}
                                        >
                                            <MdBlock /> Block
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Users;
