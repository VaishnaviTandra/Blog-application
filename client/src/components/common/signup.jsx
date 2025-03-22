import React from 'react'
import { SignUp } from '@clerk/clerk-react'
import Lottie from 'lottie-react'
import backgroundAnim from '../../assets/Signin.json'

function Signin() {
  return (
    <div className='d-flex align-items-center justify-content-center' style={{ minHeight: '80vh' }}>
      {/* Lottie Animation */}
      <div className="me-5 signin-animation">
        <Lottie animationData={backgroundAnim} loop={true} 
          style={{ width: "400px", height: "300px" }} 
        />
      </div>

      {/* Clerk SignIn Component */}
      <div style={{ width: "400px" }} className='signin-form'>
        <SignUp />
      </div>
    </div>
  )
}

export default Signin
