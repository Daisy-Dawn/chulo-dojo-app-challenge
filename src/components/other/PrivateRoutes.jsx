import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { auth } from '../firebase/firebaseConfig'

const PrivateRoutes = () => {
    const user = auth.currentUser

    if (user) {
        console.log(' user:', user)
    }

    return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes
