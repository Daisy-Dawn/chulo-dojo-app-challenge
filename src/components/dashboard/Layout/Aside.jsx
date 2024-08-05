import { useEffect, useState } from 'react'
import { db } from '../../firebase/firebaseConfig'
import { Avatar, Badge } from '@material-tailwind/react'
import { collection, getDocs } from 'firebase/firestore'
// import { ref, onValue } from 'firebase/database'
import { ref, onValue, getDatabase } from 'firebase/database'
import UserPresence from '../UserPresence'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const Aside = () => {
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState([])
    const [onlineStatus, setOnlineStatus] = useState({})
    const auth = getAuth()
    const rtdb = getDatabase()
    UserPresence()
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser)
            } else {
                setUser(null)
            }
        })
        return () => {
            unsubscribe()
        }
    }, [auth])
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'))
                const usersList = []
                querySnapshot.forEach((doc) => {
                    usersList.push({ id: doc.id, ...doc.data() })
                })
                setUsers(usersList)
            } catch (error) {
                console.error('Error fetching users: ', error)
            }
        }
        fetchUsers()
    }, [])
    useEffect(() => {
        users.forEach((user) => {
            const userStatusRef = ref(rtdb, `/status/${user.id}`)
            onValue(userStatusRef, (snapshot) => {
                setOnlineStatus((prevState) => ({
                    ...prevState,
                    [user.id]:
                        snapshot.val() && snapshot.val().state === 'online',
                }))
            })
        })
    }, [users, rtdb])
    return (
        <div className=" w-full min-h-screen  py-[3rem]">
            <div className="flex gap-[1rem] px-[1.5rem] items-start flex-col">
                <p className="text-coral text-start w-full font-roboto font-medium text-[1.3rem]">
                    All Users
                </p>
                <ul className="flex flex-col items-start gap-[1rem]">
                    {users.map((user) => (
                        <li className="flex items-center gap-2" key={user.id}>
                            <Badge
                                placement="top-end"
                                overlap="circular"
                                color={onlineStatus[user.id] ? 'green' : 'gray'}
                                withBorder
                                // className="mx-[3rem] "
                            >
                                <Avatar
                                    src={user.photoURL}
                                    alt={user.displayName}
                                    size="sm"
                                    className="p-0.5"
                                />
                            </Badge>
                            <p className="text-blackberry font-medium">
                                {user.displayName}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Aside
