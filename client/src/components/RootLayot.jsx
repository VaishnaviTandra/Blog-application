import React from 'react'
import Header from './common/Header'
import Footer from './common/Footer'
import { Outlet } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import Lottie from 'lottie-react'
import backgroundAnim from '../assets/BackgroundImg.json'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function RootLayot() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <div className="position-relative">
        
        {/* Background Animation (Global) */}
        <div className="position-fixed w-100 h-100" style={{ top: 0, left: 0, zIndex: -1 }}>
          <Lottie animationData={backgroundAnim} loop={true} />
        </div>

        {/* Header */}
        <Header />

        {/* Page Content */}
        <div style={{ minHeight: "90vh" }}>
          <Outlet />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </ClerkProvider>
  )
}

export default RootLayot
