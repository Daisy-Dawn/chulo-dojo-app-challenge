import { Avatar, Badge } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BiSolidDashboard } from 'react-icons/bi'
import { PiPlusBold } from 'react-icons/pi'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
    getDatabase,
    ref,
    onValue,
    serverTimestamp,
    set,
    onDisconnect,
} from 'firebase/database'
import { db } from '../../firebase/firebaseConfig'
import Aside from './Aside'

const Sidebar = () => {
    const location = useLocation()
    const [user, setUser] = useState(null)
    const [isOnline, setIsOnline] = useState(false)
    const auth = getAuth()
    const rtdb = getDatabase()

    const isActive = (path) => {
        return location.pathname === path
            ? 'text-coral bg-white'
            : 'text-blackBerry'
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser)

                const userStatusDatabaseRef = ref(
                    rtdb,
                    `/status/${currentUser.uid}`
                )
                const isOfflineForDatabase = {
                    state: 'offline',
                    last_changed: serverTimestamp(),
                }

                const isOnlineForDatabase = {
                    state: 'online',
                    last_changed: serverTimestamp(),
                }

                onValue(ref(rtdb, '.info/connected'), (snapshot) => {
                    if (snapshot.val() === false) {
                        set(userStatusDatabaseRef, isOfflineForDatabase)
                        setIsOnline(false)
                    } else {
                        onDisconnect(userStatusDatabaseRef)
                            .set(isOfflineForDatabase)
                            .then(() => {
                                set(userStatusDatabaseRef, isOnlineForDatabase)
                                setIsOnline(true)
                            })
                    }
                })
            } else {
                setUser(null)
                setIsOnline(false)
            }
        })

        return () => {
            unsubscribe()
        }
    }, [auth, rtdb])

    return (
        <div className="w-full min-h-[100vh] py-[3rem]">
            <div className="flex sticky flex-col items-center gap-[0.5rem] justify-center">
                {user && (
                    <>
                        <Badge
                            placement="top-end"
                            overlap="circular"
                            color={isOnline ? 'green' : 'gray'}
                            withBorder
                        >
                            <Avatar
                                src={user.photoURL}
                                alt={user.displayName}
                                size="xl"
                                className="p-0.5"
                            />
                        </Badge>

                        <p className="capitalize text-redRose text-[1rem] lg:text-[1.5rem] font-lobster">
                            Hey {user.displayName}
                        </p>
                    </>
                )}
            </div>

            {/* NAVLINKS */}
            <div className="mt-[4rem] flex gap-[1rem] flex-col">
                <Link to="/dashboard">
                    <div
                        className={`flex cursor-pointer mb-1 hover:bg-white ml-[1.5rem] dashboard-navlink hover:text-textDark px-[1rem] py-[0.5rem] items-center justify-start gap-4 ${isActive(
                            '/dashboard'
                        )}`}
                    >
                        <span>
                            <BiSolidDashboard className="size-[1rem] lg:size-[1.25rem]" />
                        </span>
                        <h2 className="text-[1.1rem] mt-0 font-normal">
                            Dashboard
                        </h2>
                    </div>
                </Link>

                <Link to="/newproject">
                    <div
                        className={`flex cursor-pointer mb-1 hover:bg-white ml-[1.5rem] dashboard-navlink hover:text-textDark px-[1rem] py-[0.5rem] items-center justify-start gap-4 ${isActive(
                            '/newproject'
                        )}`}
                    >
                        <span>
                            <PiPlusBold className="size-[1rem] lg:size-[1.25rem]" />
                        </span>
                        <h2 className="text-[1.1rem] mt-0 font-normal">
                            New Project
                        </h2>
                    </div>
                </Link>

                <div className="lg:hidden">
                    <Aside />
                </div>

                {/* <Link to="/newproject">
                    <div
                        className={`flex cursor-pointer mb-1 hover:bg-white ml-[1.5rem] dashboard-navlink hover:text-textDark px-[1rem] py-[0.5rem] items-center justify-start gap-4 ${isActive(
                            '/newproject'
                        )}`}
                    >
                        <span>
                            <PiPlusBold className="size-[1rem] lg:size-[1.25rem]" />
                        </span>
                        <h2 className="text-[1.1rem] mt-0 font-normal">
                            New Project
                        </h2>
                    </div>
                </Link> */}
            </div>
        </div>
    )
}

export default Sidebar
