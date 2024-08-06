import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Aside from './Aside'

const Layout = () => {
    const [toggle, setToggle] = useState(false)
    const handleToggle = () => {
        setToggle(!toggle)
    }

    return (
        <div className="dashboard-layout relative w-full">
            <nav className="dashboard-header">
                <Header />
            </nav>
            <aside className="dashboard-sidebar h-screen fixed bg-lightPink hidden lg:block ">
                <Sidebar />
            </aside>
            <aside className="dashboard-aside bg-white hidden lg:block ">
                <Aside />
            </aside>
            <main className="dashboard-outlet bg-greyBg ">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
