import React, { useState } from 'react'
import { MdOutlineMailOutline } from 'react-icons/md'
import { FcLock, FcGoogle } from 'react-icons/fc'
import { FaRegEye } from 'react-icons/fa'
import { FaRegEyeSlash } from 'react-icons/fa'
import { Spinner, Alert, Button } from '@material-tailwind/react'
import { auth, db } from '../firebase/firebaseConfig'
import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth'
import { MdErrorOutline, MdCheckCircleOutline } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const Login = () => {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    const navigate = useNavigate()
    const [revealPassword, setRevealPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loading1, setLoading1] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertContent, setAlertContent] = useState({
        message: '',
        icon: null,
        color: '',
    })

    const [loginFormData, setLoginFormData] = useState({
        email: '',
        password: '',
    })

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    })

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Validation function
    const validateForm = (name, value) => {
        let newErrors = { ...errors }

        if (name === 'email') {
            if (value.trim() === '') {
                newErrors.email = 'Email is required!'
            } else if (!emailRegex.test(value.trim())) {
                newErrors.email = 'Please enter a valid email address!'
            } else {
                newErrors.email = ''
            }
        }

        if (name === 'password') {
            if (value.trim() === '') {
                newErrors.password = 'Password is required!'
            } else if (value.trim().length < 8) {
                newErrors.password =
                    'Password must be at least 8 characters long!'
            } else {
                newErrors.password = ''
            }
        }

        setErrors(newErrors)
        checkFormValidity({ ...loginFormData, [name]: value }, newErrors)
    }

    // Check form validity
    const checkFormValidity = (formData, errorData) => {
        const isValid =
            formData.email.trim() !== '' &&
            emailRegex.test(formData.email.trim()) &&
            formData.password.trim() !== '' &&
            formData.password.trim().length >= 8 &&
            Object.values(errorData).every((error) => error === '')
        setIsFormValid(isValid)
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setLoginFormData({
            ...loginFormData,
            [name]: value,
        })

        setErrors({
            ...errors,
            [name]: '',
        })

        validateForm(name, value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = {}

        if (loginFormData.email.trim() === '') {
            newErrors.email = 'Email is required!'
        } else if (!emailRegex.test(loginFormData.email.trim())) {
            newErrors.email = 'Please enter a valid email address!'
        }

        if (loginFormData.password.trim() === '') {
            newErrors.password = 'Password is required!'
        } else if (loginFormData.password.trim().length < 8) {
            newErrors.password = 'Password must be at least 8 characters long!'
        }

        if (Object.values(newErrors).some((error) => error !== '')) {
            setErrors(newErrors)
        } else {
            try {
                setLoading(true)
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    loginFormData.email,
                    loginFormData.password
                )
                console.log('Logged in:', userCredential.user)
                setAlertContent({
                    message: 'Login successful!',
                    icon: <MdCheckCircleOutline className="text-white" />,
                    color: 'green',
                })
                setAlertOpen(true)
                setLoading(false)
                setTimeout(() => {
                    navigate('/dashboard')
                }, 2000)
            } catch (error) {
                console.error('Error logging in:', error)
                setAlertContent({
                    message: 'Error logging in: ' + error.message,
                    icon: <MdErrorOutline className="text-white" />,
                    color: 'red',
                })
                setAlertOpen(true)
                setLoading(false)
            }
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            setLoading1(true)
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            // Check if user already exists in Firestore
            const userRef = doc(db, 'users', user.uid)
            const userSnap = await getDoc(userRef)

            if (!userSnap.exists()) {
                // User does not exist, store their info in Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                })
            }

            console.log('Logged in with Google:', user)
            setAlertContent({
                message: 'Login successful!',
                icon: <MdCheckCircleOutline className="text-green-500" />,
                color: 'green',
            })
            setAlertOpen(true)
            setLoading1(false)
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000)
        } catch (error) {
            console.error('Error logging in with Google:', error)
            setAlertContent({
                message: 'Error logging in with Google: ' + error.message,
                icon: <MdErrorOutline className="text-red-500" />,
                color: 'red',
            })
            setAlertOpen(true)
            setLoading1(false)
        }
    }

    return (
        <div className="flex w-full relative justify-center items-center h-[85vh] bg-lightPink md:bg-greyBg">
            <div className="bg-lightPink flex gap-[1.5rem] flex-col login-box w-full md:w-[70%] lg:w-[50%]">
                <h2 className="text-redRose font-roboto font-bold text-[1.7rem] md:text-[2rem] capitalize">
                    Login
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-[1.5rem]"
                >
                    {/* EMAIL */}
                    <div className="w-full relative">
                        <input
                            type="text"
                            id="email"
                            value={loginFormData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            name="email"
                            className="mt-1 py-[1.5rem] px-[3.5rem] text-[0.9rem] w-full placeholder:text-[0.8rem] placeholder:text-darkGrey  color-bg rounded-md focus:outline-none"
                        />
                        <span className="absolute top-[25px] left-3">
                            {' '}
                            <MdOutlineMailOutline className="text-[25px] text-blackberry size-[25px] text-dark" />{' '}
                        </span>
                        {errors.email && (
                            <p className="text-red-600 text-[0.75rem] ">
                                {' '}
                                *{errors.email}{' '}
                            </p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div className="w-full relative">
                        <input
                            value={loginFormData.password}
                            onChange={handleChange}
                            type={revealPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            id="password"
                            className="mt-1 py-[1.5rem] px-[3.5rem] text-[0.9rem] placeholder:text-[0.8rem] placeholder:text-darkGrey w-full  color-bg rounded-md focus:outline-none"
                        />
                        <span className="absolute top-[25px] left-3">
                            {' '}
                            <FcLock className="text-[25px] size-[25px] " />{' '}
                        </span>
                        <span
                            onClick={() => setRevealPassword(!revealPassword)}
                            className="absolute top-[25px] right-3"
                        >
                            {revealPassword ? (
                                <FaRegEye className="text-blackberry size-[25px] cursor-pointer" />
                            ) : (
                                <FaRegEyeSlash className="text-blackberry size-[25px] cursor-pointer" />
                            )}{' '}
                        </span>

                        {errors.password && (
                            <p className="text-red-600 text-[0.75rem]">
                                {' '}
                                *{errors.password}{' '}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={loading || !isFormValid}
                        type="submit"
                        className={`py-[1rem] disabled:bg-[#e6d1d8] ${
                            loading || !isFormValid
                                ? 'cursor-not-allowed'
                                : 'cursor-pointer hover:shadow-2xl'
                        } text-[0.9rem] font-semibold capitalize text-white bg-blackberry rounded-[12px] text-center`}
                    >
                        {loading ? (
                            <span className="flex justify-center items-center gap-3 ">
                                <Spinner className="h-6 w-6" /> Please wait
                            </span>
                        ) : (
                            'Sign in'
                        )}
                    </button>

                    {/* GOOGLE SIGNIN */}
                    <div className="w-full flex justify-center">
                        <Button
                            onClick={handleGoogleSignIn}
                            variant="outlined"
                            color="blue-gray"
                            className="flex items-center w-full xl:w-1/2 justify-center gap-3"
                        >
                            <FcGoogle className="size-[25px]" />
                            <p className="text-blackberry hover:text-coral cursor-pointer">
                                {loading1 ? (
                                    <span className="flex justify-center items-center gap-3 ">
                                        <Spinner className="h-6 w-6" /> Please
                                        wait
                                    </span>
                                ) : (
                                    'Sign in with Google'
                                )}
                            </p>
                        </Button>
                    </div>
                </form>
            </div>
            {alertOpen && (
                <Alert
                    className="absolute text-[0.9rem] w-[70%] bottom-[1rem]"
                    variant="gradient"
                    open={alertOpen}
                    color={alertContent.color}
                    icon={alertContent.icon}
                    action={
                        <Button
                            variant="text"
                            color="white"
                            size="sm"
                            className="!absolute top-3 right-3"
                            onClick={() => setAlertOpen(false)}
                        >
                            Close
                        </Button>
                    }
                >
                    {alertContent.message}
                </Alert>
            )}
        </div>
    )
}

export default Login
