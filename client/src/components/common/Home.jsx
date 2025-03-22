import React, { useContext, useEffect, useState } from 'react'
import { userAuthorContextobj } from '../../contexts/userAuthorContext'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'
import backgroundAnim from '../../assets/BackgroundImg.json'
import Writing from "../../assets/Writing2.json"
import Admin from "../../assets/Admin.json"
import samplepic from "../../assets/samplepic.json"
import Welcome from '../../assets/Welcome.json'
import { motion } from 'framer-motion'

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextobj)
  const { isSignedIn, user, isLoaded } = useUser()
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const BACKEND_URL= import.meta.env.VITE_BACKEND_URL;
  const [selectedRole, setSelectedRole] = useState("");
  const adminEmail = "pranavimanthena3@gmail.com"

  useEffect(() => {
    if (currentUser?.role && !error) {
      console.log("Triggered navigation:", `/${currentUser.role}-profile/${currentUser.email}`);
      navigate(`/${currentUser.role}-profile/${currentUser.email}`);
    }
  }, [currentUser?.role, error, navigate]);

  async function onSelectRole(e) {
    setError('');
    const role = e.target.value;
    setSelectedRole(role); // Immediate UI update
  
    if (!currentUser) {
      setError("User data is missing. Please refresh and try again.");
      return;
    }
  
    if (role === "admin" && currentUser.email !== adminEmail) {
      setError("Only admin can access");
      return;
    }
  
    try {
      const endpointMap = {
        author: `${BACKEND_URL}/author-api/author`,
        user: `${BACKEND_URL}/user-api/user`,
        admin: `${BACKEND_URL}/admin-api/admin`,
      };
  
      const url = endpointMap[role];
  
      if (!url) {
        setError("Invalid role selection.");
        return;
      }
  
      const res = await axios.post(url, { ...currentUser, role });
  
      if (res?.data?.message === role) {
        const updatedUser = { ...currentUser, role };
        setCurrentUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(res.data.payload));
  
        console.log("Navigating to:", `/${role}-profile/${currentUser.email}`);
        navigate(`/${role}-profile/${currentUser.email}`);
      } else {
        setError(res?.data?.message || "Something went wrong");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  }
  

  useEffect(() => {
    if (isLoaded && user) {
      setCurrentUser(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
        profileImageUrl: user.imageUrl,
        role: prev?.role || ""  // Ensure role is not undefined
      }));
    }
  }, [isLoaded, user]);
  

  useEffect(() => {
    if (currentUser?.role && !error) {
      navigate(`/${currentUser.role}-profile/${currentUser.email}`)
    }
  }, [currentUser?.role, error])

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      className="position-relative d-flex flex-column vh-100 text-white mt-0"
      
    >
      {/* Full-Screen Lottie Background Animation */}
      <Lottie 
        animationData={backgroundAnim} 
        loop={true} 
        className="position-fixed w-100 h-100"
        style={{ top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} // Full-screen background
      />

      {isSignedIn ? (
        <>
          {/* Profile Section (Image + Name in Same Line) */}
          <motion.div className='d-flex align-items-center justify-content-center mt-5 gap-2'>
            {isLoaded && user ? (
              <motion.img 
                src={user.imageUrl || "https://via.placeholder.com/100"} 
                width="50px" 
                height="50px"
                className="rounded-circle border border-light shadow"
                alt="User"
                whileHover={{ scale: 1.1, rotate: 5 }}
              />
            ) : (
              <p>Loading...</p>
            )}
            <motion.p 
              className="fs-4 fw-bold"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {user?.firstName || "User"}
            </motion.p>
          </motion.div>

          {/* Role Selection Box */}
          <motion.div 
            className="mt-3 p-4 bg-dark bg-opacity-75 rounded shadow text-center"
            style={{ width: "100%" }} // Increased width
          >
            <motion.p className="lead fw-bold mb-3">Select your role</motion.p>

            {error && (
              <motion.p 
                className='text-danger fs-5 text-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5 }}
              >
                {error}
              </motion.p>
            )}

            <motion.div className='d-flex justify-content-center py-2' initial="hidden" animate="visible">
              {["author", "user", "admin"].map((role) => (
                <motion.div 
                  key={role}
                  className="form-check me-4 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <input 
  type="radio" 
  name="role" 
  id={role} 
  className="form-check-input" 
  value={role} 
  checked={selectedRole === role} // Ensure the selected radio remains checked
  onChange={onSelectRole} 
/>

                  <Lottie 
                    animationData={role === "author" ? Writing : role === "user" ? samplepic : Admin} 
                    loop={true} 
                    className="mt-3"
                    style={{ width: "300px", height: "100px" }} 
                  />
                  <label htmlFor={role} className="form-check-label fs-5">{role.charAt(0).toUpperCase() + role.slice(1)}</label>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </>
      ) : (
        <div className="container mt-5">
          <div className="row align-items-center">
            {/* Welcome to the Dashboard Section */}
            <div className="col-12 text-center mb-4">
              <motion.h2
                className="display-5 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ fontFamily: "Arial, sans-serif", color: "#4A90E2" }} // Font and color change for header
              >
                Welcome to the Dashboard
              </motion.h2>
            </div>
        
            {/* Left Side (Welcome Animation) */}
            <div className="col-lg-6 text-center text-lg-start welcome-animation">
              <Lottie
                animationData={Welcome} // Lottie animation
                loop={true}
                className="border border-light rounded-2 "
                style={{ width: "400px", height: "300px" }} // Enlarged size for the animation
              />
            </div>
        
            {/* Right Side Content */}
            <div className="col-lg-6 text-center text-lg-start mt-3 blog-container">
              {/* What is a Blog Section */}
              <motion.h2
                className="display-5 mb-3 blog-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ fontFamily: "Arial, sans-serif", color: "#4A90E2" }} // Font and color change for header
              >
                What is a Blog?
              </motion.h2>
        
              <motion.p
                className="lead mb-3 blog-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ fontFamily: "Georgia, serif", color: "#FFFFFF" }} // White color for contrast with black
              >
                A blog is an online platform where individuals or businesses share articles, insights, and updates.
              </motion.p>
        
              {/* Image of the blog */}
              <img
                src="https://www.americanexecutivecenters.com/wp-content/uploads/2016/06/Blog.jpg"
                alt="Blog Image"
                className="img-fluid rounded-3 mt-4 blogimg"
                
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default Home;
