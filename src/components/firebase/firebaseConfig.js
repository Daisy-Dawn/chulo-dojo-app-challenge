// firebaseConfig.js
import { initializeApp } from 'firebase/app'
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
    apiKey: 'AIzaSyCuW3f3H9PGZtHSRLqP7RmCV-8D4z1Hjx8',
    authDomain: 'daisy-77b9d.firebaseapp.com',
    projectId: 'daisy-77b9d',
    storageBucket: 'daisy-77b9d.appspot.com',
    messagingSenderId: '280940112842',
    appId: '1:280940112842:web:c71be3fee06322881bfd33',
    measurementId: 'G-RY7T7VK9FZ',
}

// const firebaseConfig = {
//     apiKey: 'AIzaSyBrbrLV3RpkxUjnRGP3AT-8ExxOpSoQnb4',
//     authDomain: 'chulo-dojo-app.firebaseapp.com',
//     databaseURL: 'https://chulo-dojo-app-default-rtdb.firebaseio.com',
//     projectId: 'chulo-dojo-app',
//     storageBucket: 'chulo-dojo-app.appspot.com',
//     messagingSenderId: '856274412831',
//     appId: '1:856274412831:web:4df6b5e0bc3d93c129fc2a',
// }

// Initialize Firebase
const app = initializeApp(firebaseConfig)

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

export { app, auth, db, storage, rtdb }

// // Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app'
// import {
//     browserLocalPersistence,
//     browserSessionPersistence,
//     getAuth,
//     setPersistence,
// } from 'firebase/auth'
// import { getFirestore, serverTimestamp } from 'firebase/firestore'
// import { getStorage, ref } from 'firebase/storage'
// import { getDatabase, onDisconnect, onValue, set } from 'firebase/database'

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: 'AIzaSyBrbrLV3RpkxUjnRGP3AT-8ExxOpSoQnb4',
//     authDomain: 'chulo-dojo-app.firebaseapp.com',
//     projectId: 'chulo-dojo-app',
//     storageBucket: 'chulo-dojo-app.appspot.com',
//     messagingSenderId: '856274412831',
//     appId: '1:856274412831:web:4df6b5e0bc3d93c129fc2a',
// }

// // Initialize Firebase
// const app = initializeApp(firebaseConfig)

// // Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app)

// // Initialize Firestore and Storage
// const db = getFirestore(app)
// const storage = getStorage(app)

// // Initialize Realtime Database and get a reference to the service
// const rtdb = getDatabase(app)

// // Set persistence
// setPersistence(auth, browserSessionPersistence)
//     .then(() => {
//         // Auth state persists across page reloads
//     })
//     .catch((error) => {
//         console.error('Error setting persistence:', error)
//     })

// export { app, auth, db, storage, rtdb }
