import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Lottie from 'lottie-react';
import backgroundAnim from '../../assets/Blocked.json';

function AuthorProfile() {
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      setUserStatus(currentUser.isBlocked);
    }
  }, []);

  return (
    <div className="author-profile">
      {userStatus ? (
        <div className="d-flex flex-column justify-content-center align-items-center text-center mt-5">
          <p className="text-danger fs-3 fw-semibold">Your account is blocked. Please contact the admin.</p>
          <Lottie 
            animationData={backgroundAnim} 
            loop={true} 
            className="border border-light rounded-2 auth-an" 
            style={{ width: "250px", height: "150px" }} 
          />
        </div>
      ) : (
        <>
          <ul className="d-flex justify-content-around list-unstyled fs-3">
            <li className="nav-item">
              <Link to="articles" className="nav-link text-white box">Articles</Link>
            </li>
            <li className="nav-item">
              <Link to="article" className="nav-link text-white box">Add New Articles</Link>
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

export default AuthorProfile;
