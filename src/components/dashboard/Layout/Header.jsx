import React, { useEffect, useState } from 'react'
import { logo } from '../../../assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiMiniBars3BottomRight } from 'react-icons/hi2'
import { RxCross2 } from 'react-icons/rx'
import Sidebar from './Sidebar'
import { Button } from '@material-tailwind/react'
import { IoMdLogOut } from 'react-icons/io'
import { getAuth, signOut } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { rtdb } from '../../firebase/firebaseConfig'

const Header = () => {
    const navigate = useNavigate()
    const auth = getAuth()
    const [revealNav, setRevealNav] = useState(false)
    const location = useLocation()
    const [stickyEffect, setStickyEffect] = useState(false)
    const [vw, setVw] = useState(null)
    const [loading, setLoading] = useState(false)

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

    const handleSignOut = async () => {
        setLoading(true)
        console.log('signing out a user....')

        // Set the user's status to offline in the Realtime Database
        const userStatusRef = ref(rtdb, `/status/${auth.currentUser.uid}`)
        await set(userStatusRef, { online: false })

        signOut(auth)
            .then(() => {
                console.log('user signed out successfully...')
                setTimeout(() => {
                    navigate('/login')
                    // Sign-out successful.
                    setLoading(false)
                }, 2000)
            })
            .catch((error) => {
                setLoading(false)
                console.log('error: ' + error.message)
                // An error happened.
            })
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
                className="cursor-pointer lg:hidden"
            >
                <HiMiniBars3BottomRight className="w-7 h-7 text-blackberry" />
            </div>
            {/* mobile */}
            <div
                className={`${
                    revealNav ? 'right-0' : 'hidden'
                } flex flex-col items-center justify-center absolute top-0 z-50 w-[65%] md:w-[45%] h-dvh bg-lightPink bg-secondary shadow-lg transition-all duration-300 gap-8 lg:hidden`}
            >
                <div
                    onClick={() => setRevealNav(false)}
                    className="cursor-pointer absolute top-5 left-5"
                >
                    <RxCross2 className="w-7 h-7 text-blackberry text-opacity-70" />
                </div>
                <Sidebar />
            </div>

            {/* desktop */}

            <div className="hidden lg:flex gap-[1.5rem]">
                <Button
                    loading={loading}
                    onClick={handleSignOut}
                    className="flex bg-coral items-center gap-3"
                    variant="gradient"
                    color="pink"
                >
                    {' '}
                    {!loading && <IoMdLogOut size={20} />}
                    Log Out
                </Button>
            </div>
        </nav>
    )
}

export default Header
