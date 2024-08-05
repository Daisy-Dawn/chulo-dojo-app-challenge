// firebaseConfig.js
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
    browserSessionPersistence,
    getAuth,
    setPersistence,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getDatabase } from 'firebase/database'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyCCcApM_LkM0aCeVdFEWUh9WVJ3faVpd54',
    authDomain: 'dojo-app-860ab.firebaseapp.com',
    projectId: 'dojo-app-860ab',
    storageBucket: 'dojo-app-860ab.appspot.com',
    messagingSenderId: '728040148966',
    appId: '1:728040148966:web:dbea259a83db9abead1027',
    measurementId: 'G-HKR4RZVDF7',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// Initialize Firebase Authentication and set persistence
const auth = getAuth(app)
setPersistence(auth, browserSessionPersistence)
    .then(() => {
        // Auth state persists across page reloads
    })
    .catch((error) => {
        console.error('Error setting persistence:', error)
    })

// Initialize Firestore, Storage, and Realtime Database
const db = getFirestore(app)
const storage = getStorage(app)
const rtdb = getDatabase(app)

export { app, auth, db, storage, rtdb, analytics }
