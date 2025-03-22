import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Lottie from 'lottie-react';
import backgroundAnim from '../../assets/Blocked.json';

function UserProfile() {
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(currentUser);
    if (currentUser) {
      setUserStatus(currentUser.isBlocked);
    }
  }, []);

  return (
    <div>
      {userStatus ? (
        <div className="d-flex flex-column justify-content-center align-items-center text-center mt-5">
          <p className="text-danger fs-3 fw-semibold">Your account is blocked. Please contact the admin.</p>
          <Lottie 
            animationData={backgroundAnim} 
            loop={true} 
            className="border border-light rounded-2 mt-3" 
            style={{ width: "250px", height: "150px" }} 
          />
        </div>
      ) : (
        <>
          <ul className="d-flex justify-content-around list-unstyled fs-3">
            <li className="nav-item text-white mt-3">
              <Link className="nav-link ar" to="articles">Articles</Link>
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

export default UserProfile;
