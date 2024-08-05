import { useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
    getDatabase,
    ref,
    onDisconnect,
    onValue,
    set,
    serverTimestamp,
} from 'firebase/database'

const UserPresence = () => {
    useEffect(() => {
        const auth = getAuth()
        const db = getDatabase()

        const handleUserState = (user) => {
            if (user) {
                const userStatusDatabaseRef = ref(db, `/status/${user.uid}`)

                const isOfflineForDatabase = {
                    state: 'offline',
                    last_changed: serverTimestamp(),
                }

                const isOnlineForDatabase = {
                    state: 'online',
                    last_changed: serverTimestamp(),
                }

                onValue(ref(db, '.info/connected'), (snapshot) => {
                    if (snapshot.val() === false) {
                        return
                    }

                    onDisconnect(userStatusDatabaseRef)
                        .set(isOfflineForDatabase)
                        .then(() => {
                            set(userStatusDatabaseRef, isOnlineForDatabase)
                        })
                })
            }
        }

        const unsubscribe = onAuthStateChanged(auth, handleUserState)

        return () => {
            unsubscribe()
        }
    }, [])
}

export default UserPresence
