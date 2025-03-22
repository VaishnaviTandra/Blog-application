import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'
import { useContext } from 'react'
import { useState } from 'react'
import { userAuthorContextobj } from '../../contexts/userAuthorContext'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import animationData from '../../assets/BackgroundImg.json' // Ensure correct path
import { FaBars, FaTimes } from 'react-icons/fa'; 

function Header() {
  const { signOut } = useClerk()
  const { currentUser, setCurrentUser } = useContext(userAuthorContextobj)
  const navigate = useNavigate()
  const { isSignedIn, user } = useUser()
  const [menuOpen, setMenuOpen] = useState(false);
  async function handleSignOut() {
    await signOut()
    setCurrentUser(null)
    navigate('')
  }

  return (
    <motion.div 
      className="container-fluid p-0 position-relative"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Background Animation */}
      <Lottie 
        animationData={animationData}
        loop
        autoplay
        className="lottie-bg"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />

      {/* Header */}
      <motion.nav
        className='d-flex justify-content-between align-items-center px-4 py-2'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'transparent',
          backdropFilter: 'blur(10px)', // Ensures readability
          padding: '15px 30px',
          width: '100%'
        }}
      >
        {/* Left - Logo */}
        <motion.div
          className='d-flex align-items-center'
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link to='/' style={{ textDecoration: 'none' }}>
            <motion.img
              src="https://tse3.mm.bing.net/th?id=OIP.stNFz0VrFhwKC2oktVlzdwHaHf&pid=Api&P=0&h=180"
              className='rounded-circle shadow'
              alt="Logo"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
              style={{ width: '50px', height: '50px' }}
            />
          </Link>
        </motion.div>

        {/* Right - Navigation / User Info */}
        <motion.div
          className='d-flex align-items-center'
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!isSignedIn ? (
            <>
            <motion.ul className='d-flex justify-content-end list-unstyled mb-0'>
              <motion.li className='me-4' whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                <Link to='' style={{ textDecoration: 'none', color: '#ffffff' }}>Home</Link>
              </motion.li>
              <motion.li className='me-4' whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                <motion.div 
                  whileHover={{ backgroundColor: "#007bff", color: "#fff" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '20px', 
                    cursor: 'pointer',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff'
                  }}
                >
                  <Link to='signin' style={{ textDecoration: 'none', color: 'inherit' }}>
                    Sign In
                  </Link>
                </motion.div>
              </motion.li>
              <motion.li className='me-4'>
                <motion.div 
                  whileHover={{ backgroundColor: "#28a745", color: "#fff" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '20px', 
                    cursor: 'pointer',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff'
                  }}
                >
                  <Link to='signup' style={{ textDecoration: 'none', color: 'inherit' }}>
                    Sign Up
                  </Link>
                </motion.div>
              </motion.li>
            </motion.ul>
             <div className="mobile-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
             {menuOpen ? <FaTimes size={30} color="white" /> : <FaBars size={30} color="white" />}
           </div>

           {/* Mobile Dropdown Menu */}
           {menuOpen && (
             <motion.ul className=" text-white list-unstyled mobile-nav">
               <li><Link to='' className="nav-link" style={{ textDecoration: 'none' }}>Home</Link></li>
               <li><Link to='signin' className="nav-link" style={{ textDecoration: 'none' }}>Sign In</Link></li>
               <li><Link to='signup' className="nav-link" style={{ textDecoration: 'none' }}>Sign Up</Link></li>
             </motion.ul>
           )}
           </>
          ) : (
            <motion.div className='d-flex align-items-center pc' initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, type: 'spring' }}>
              <motion.div style={{ position: 'relative' }} whileHover={{ scale: 1.05 }} className="me-3 cuser">
                <motion.img
                  src={user.imageUrl}
                  width='40px'
                  height='40px'
                  className='rounded-circle'
                  alt={`${user.firstName}'s profile`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.p className='mb-0 mt-1 text-center' initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ fontSize: '0.8rem', color: '#ffffff' }}>
                  {user.firstName}
                </motion.p>
              </motion.div>
              
              <motion.div className='me-4' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  style={{ 
                    backgroundColor: currentUser.role === 'admin' ? '#6c757d' : '#17a2b8',
                    color: 'white',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.8rem'
                  }}
                >
                  {currentUser.role}
                </motion.span>
              </motion.div>
              
              <motion.button
                className="btn btn-danger"
                onClick={handleSignOut}
                whileHover={{ scale: 1.05, backgroundColor: "#dc3545" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ borderRadius: '20px', padding: '6px 15px' }}
              >
                Sign Out
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.nav>
    </motion.div>
  )
}

export default Header
