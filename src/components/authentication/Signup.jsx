import React, { useState } from 'react'
import { MdOutlineMailOutline } from 'react-icons/md'
import { FcLock } from 'react-icons/fc'
import { FaRegEye, FaRegUser, FaRegEyeSlash, FaRegImage } from 'react-icons/fa'
import { Spinner, Alert, Button } from '@material-tailwind/react'
import { auth, storage, db } from '../firebase/firebaseConfig'
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'
import { MdErrorOutline, MdCheckCircleOutline } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const auth = getAuth()
    const navigate = useNavigate()
    const [revealPassword, setRevealPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertContent, setAlertContent] = useState({
        message: '',
        icon: null,
        color: '',
    })

    const [signupFormData, setSignupFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        displayPicture: null,
    })

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        displayName: '',
        displayPicture: '',
    })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

        if (name === 'displayName') {
            if (value.trim() === '') {
                newErrors.displayName = 'Display Name is required!'
            } else {
                newErrors.displayName = ''
            }
        }

        if (name === 'displayPicture') {
            if (!value) {
                newErrors.displayPicture = 'Display Picture is required!'
            } else {
                newErrors.displayPicture = ''
            }
        }

        setErrors(newErrors)
        checkFormValidity({ ...signupFormData, [name]: value }, newErrors)
    }

    const checkFormValidity = (formData, errorData) => {
        const isValid =
            formData.email.trim() !== '' &&
            emailRegex.test(formData.email.trim()) &&
            formData.password.trim() !== '' &&
            formData.password.trim().length >= 8 &&
            formData.displayName.trim() !== '' &&
            formData.displayPicture &&
            Object.values(errorData).every((error) => error === '')
        setIsFormValid(isValid)
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target

        if (files) {
            setSignupFormData({
                ...signupFormData,
                [name]: files[0],
            })
        } else {
            setSignupFormData({
                ...signupFormData,
                [name]: value,
            })
        }

        setErrors({
            ...errors,
            [name]: '',
        })

        validateForm(name, files ? files[0] : value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = {}

        if (signupFormData.email.trim() === '') {
            newErrors.email = 'Email is required!'
        } else if (!emailRegex.test(signupFormData.email.trim())) {
            newErrors.email = 'Please enter a valid email address!'
        }

        if (signupFormData.password.trim() === '') {
            newErrors.password = 'Password is required!'
        } else if (signupFormData.password.trim().length < 8) {
            newErrors.password = 'Password must be at least 8 characters long!'
        }

        if (signupFormData.displayName.trim() === '') {
            newErrors.displayName = 'Display Name is required!'
        }

        if (!signupFormData.displayPicture) {
            newErrors.displayPicture = 'Display Picture is required!'
        }

        if (Object.values(newErrors).some((error) => error !== '')) {
            setErrors(newErrors)
        } else {
            try {
                setLoading(true)
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    signupFormData.email,
                    signupFormData.password
                )

                const user = userCredential.user

                // Upload the display picture to Firebase Storage
                const storageRef = ref(
                    storage,
                    `users/${user.uid}/displayPicture`
                )
                await uploadBytes(storageRef, signupFormData.displayPicture)
                const displayPictureURL = await getDownloadURL(storageRef)

                // Update the user's profile
                await updateProfile(user, {
                    displayName: signupFormData.displayName,
                    photoURL: displayPictureURL,
                })

                // Store user information in Firestore
                // await setDoc(doc(db, 'users', user.uid), {
                //     uid: user.uid,
                //     email: signupFormData.email,
                //     displayName: signupFormData.displayName,
                //     photoURL: displayPictureURL,
                // })

                console.log('User signed up:', user)
                setAlertContent({
                    message: 'Sign up successful!',
                    icon: <MdCheckCircleOutline className="text-white" />,
                    color: 'green',
                })
                setAlertOpen(true)
                setLoading(false)

                navigate('/dashboard')
            } catch (error) {
                console.error('Error signing up:', error)
                setAlertContent({
                    message: 'Error signing up: ' + error.message,
                    icon: <MdErrorOutline className="text-white" />,
                    color: 'red',
                })
                setAlertOpen(true)
                setLoading(false)
            }
        }
    }

    return (
        <div className="flex w-full relative justify-center items-center h-[85vh] bg-lightPink md:bg-greyBg">
            <div className="bg-lightPink flex gap-[1.5rem] flex-col login-box w-full md:w-[70%] lg:w-[50%]">
                <h2 className="text-redRose font-roboto font-bold text-[1.7rem] md:text-[2rem] capitalize">
                    Sign Up
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
                            value={signupFormData.email}
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
                            value={signupFormData.password}
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

                    {/* DISPLAY NAME */}
                    <div className="w-full relative">
                        <input
                            type="text"
                            id="displayName"
                            value={signupFormData.displayName}
                            onChange={handleChange}
                            placeholder="Display Name"
                            name="displayName"
                            className="mt-1 py-[1.5rem] px-[3.5rem] text-[0.9rem] w-full placeholder:text-[0.8rem] placeholder:text-darkGrey  color-bg rounded-md focus:outline-none"
                        />
                        <span className="absolute top-[25px] left-3">
                            {' '}
                            <FaRegUser className="text-[25px] text-blackberry size-[25px] text-dark" />{' '}
                        </span>
                        {errors.displayName && (
                            <p className="text-red-600 text-[0.75rem] ">
                                {' '}
                                *{errors.displayName}{' '}
                            </p>
                        )}
                    </div>

                    {/* DISPLAY PICTURE */}
                    <div className="w-full relative">
                        <input
                            type="file"
                            id="displayPicture"
                            accept="image/*"
                            onChange={handleChange}
                            placeholder="Display Picture"
                            name="displayPicture"
                            className="mt-1 py-[1.5rem] px-[3.5rem] text-[0.9rem] w-full placeholder:text-[0.8rem] placeholder:text-darkGrey  color-bg rounded-md focus:outline-none"
                        />
                        <span className="absolute top-[25px] left-3">
                            {' '}
                            <FaRegImage className="text-[25px] text-blackberry size-[25px] text-dark" />{' '}
                        </span>
                        {errors.displayPicture && (
                            <p className="text-red-600 text-[0.75rem] ">
                                {' '}
                                *{errors.displayPicture}{' '}
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
                            'Sign up'
                        )}
                    </button>
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

export default Signup
