import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnim from '../../assets/Loading.json'; // Ensure the file exists in assets

function AdminProfile() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (e.g., fetching user data)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust delay as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="admin-profile">
      {isLoading ? (
        <div className="d-flex flex-column justify-content-center align-items-center text-center mt-5">
          <Lottie 
            animationData={loadingAnim} 
            loop={true} 
            className="border border-light rounded-2" 
            style={{ width: "180px", height: "180px" }} 
          />
          <p className="text-secondary fs-4 mt-3">Loading Admin Panel...</p>
        </div>
      ) : (
        <>
          <ul className="d-flex justify-content-around list-unstyled fs-3">
            <li className="nav-item">
              <Link to="users" className="nav-link text-white mt-3 box">Admin Dashboard</Link>
            </li>
          </ul>
          <div className="mt-5">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}

export default AdminProfile;
