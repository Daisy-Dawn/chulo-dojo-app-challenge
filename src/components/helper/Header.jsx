import React, { useEffect, useState } from 'react'
import { logo } from '../../assets/index'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiMiniBars3BottomRight } from 'react-icons/hi2'
import { RxCross2 } from 'react-icons/rx'

const Header = () => {
    const navigate = useNavigate()
    const [revealNav, setRevealNav] = useState(false)
    const location = useLocation()
    const [stickyEffect, setStickyEffect] = useState(false)
    const [vw, setVw] = useState(null)

    // hide mobile nav bar when Home link is clicked
    useEffect(() => {
        if (vw <= 680) {
            setRevealNav(false)
            setVw(null)
        }
    }, [vw])

    // navbar background sticky scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setStickyEffect(true)
            } else {
                setStickyEffect(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const isActive = (path) => {
        return location.pathname === path ? 'text-coral' : 'text-blackBerry'
    }

    return (
        <nav className="h-[100px] flex justify-between px-[1rem] lg:px-[4rem] py-[2rem] w-full bg-greyBg sticky top-0 shadow-sm z-50 transition-all duration-300">
            <div className="flex items-center gap-[0.5rem]">
                <img className="w-[30px] lg:w-[40px]" src={logo} alt="logo" />
                <p className="text-[1.5rem] md:text-[1.7rem] header-text font-bold font-greatVibes">
                    The Dojo
                </p>
            </div>

            <div
                onClick={() => setRevealNav(true)}
                className="cursor-pointer md:hidden"
            >
                <HiMiniBars3BottomRight className="w-7 h-7 text-blackberry" />
            </div>
            {/* mobile */}
            <div
                className={`${
                    revealNav ? 'right-0' : 'hidden'
                } flex flex-col items-center justify-center absolute top-0 z-50 w-[65%] h-dvh bg-lightPink bg-secondary shadow-lg transition-all duration-300 gap-8 md:hidden`}
            >
                <div
                    onClick={() => setRevealNav(false)}
                    className="cursor-pointer absolute top-5 left-5"
                >
                    <RxCross2 className="w-7 h-7 text-blackberry text-opacity-70" />
                </div>
                <ul className="flex flex-col md:flex-row items-center gap-4">
                    <li onClick={() => navigate('/signup')}>
                        <span
                            className={`text-[1rem] hover:text-accent transition-colors duration-300 text-blackberry font-roboto font-normal ${isActive(
                                '/signup'
                            )}`}
                        >
                            Sign Up
                        </span>
                    </li>
                    <li onClick={() => navigate('/login')}>
                        <span
                            className={`text-[1rem] hover:text-accent transition-colors duration-300 font-roboto font-normal ${isActive(
                                '/login'
                            )}`}
                        >
                            Login
                        </span>
                    </li>
                </ul>
            </div>

            {/* desktop */}

            <div className="hidden md:flex gap-[1.5rem]">
                <Link
                    className={`font-roboto hover:text-coral transition-all duration-300 text-[1.2rem] ${isActive(
                        '/login'
                    )}`}
                    to="/login"
                >
                    Login
                </Link>
                <Link
                    className={`font-roboto hover:text-coral transition-all duration-300 text-[1.2rem] ${isActive(
                        '/signup'
                    )}`}
                    to="/signup"
                >
                    Sign Up
                </Link>
            </div>
        </nav>
    )
}

export default Header
