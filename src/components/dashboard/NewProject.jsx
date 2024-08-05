import {
    Textarea,
    Input,
    Select,
    Option,
    Button,
    Typography,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Checkbox,
} from '@material-tailwind/react'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { auth, db } from '../firebase/firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { MdOutlineAddTask } from 'react-icons/md'

export const TypographyI = () => {
    return (
        <Typography
            variant="small"
            color="red"
            className="mt-2 flex items-center gap-1 font-normal"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-px h-4 w-4"
            >
                <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                />
            </svg>
            Field is required
        </Typography>
    )
}

const NewProject = () => {
    const navigate = useNavigate()
    const [projectName, setProjectName] = useState('')
    const [projectDetails, setProjectDetails] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [projectCategory, setProjectCategory] = useState('')
    const [assignedTo, setAssignedTo] = useState([])
    const [users, setUsers] = useState([])
    const [errors, setErrors] = useState({
        projectName: false,
        projectDetails: false,
        dueDate: false,
        projectCategory: false,
        assignedTo: false,
    })
    const [loading, setLoading] = useState(false)

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

    const handleChange = (setter, field) => (e) => {
        setter(e.target.value)
        setErrors((prev) => ({ ...prev, [field]: '' }))
    }

    const handleCheckboxChange = (user) => {
        setAssignedTo((prevAssignedTo) => {
            const isAlreadySelected = prevAssignedTo.some(
                (assignedUser) => assignedUser.uid === user.id
            )
            if (isAlreadySelected) {
                return prevAssignedTo.filter(
                    (assignedUser) => assignedUser.uid !== user.id
                )
            } else {
                return [
                    ...prevAssignedTo,
                    { uid: user.id, displayName: user.displayName },
                ]
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        const newErrors = {
            projectName: !projectName,
            projectDetails: !projectDetails,
            dueDate: !dueDate,
            projectCategory: !projectCategory,
            assignedTo: assignedTo.length === 0,
        }
        setErrors(newErrors)

        const hasErrors = Object.values(newErrors).some((error) => error)
        if (hasErrors) {
            return
        }

        const currentUser = auth.currentUser
        const projectData = {
            projectName,
            projectDetails,
            dueDate,
            projectCategory,
            assignedTo,
            assignedBy: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                email: currentUser.email,
                photoURL: currentUser.photoURL,
            },
        }

        try {
            setLoading(true)
            const docRef = await addDoc(collection(db, 'projects'), projectData)
            console.log('Document written with ID: ', docRef.id)
            console.log(projectData)
            navigate('/dashboard')
            setLoading(false)
        } catch (e) {
            console.error('Error adding document: ', e)
            setLoading(false)
        }
    }

    return (
        <div className="px-[1rem] my-[4rem] font-roboto lg:px-[4rem]">
            <p className="text-blackberry font-roboto mb-[1.5rem] font-medium text-[1.3rem]">
                Create a New Project
            </p>

            <form
                onSubmit={handleSubmit}
                className="flex gap-[1rem] w-[70%] flex-col"
            >
                <div className="flex w-full flex-col">
                    <label className="text-blackberry mb-[1rem]">
                        Project Name:{' '}
                    </label>
                    <Input
                        color="pink"
                        label="Input Project Name"
                        value={projectName}
                        onChange={(e) => {
                            setProjectName(e.target.value)
                            setErrors((prevErrors) => ({
                                ...prevErrors,
                                projectName: false,
                            }))
                        }}
                    />
                    {errors.projectName && <TypographyI />}
                </div>

                <div className="flex w-full flex-col">
                    <label className="text-blackberry mb-[1rem]">
                        Project Details:{' '}
                    </label>
                    <Textarea
                        color="pink"
                        label="Input Project Details"
                        value={projectDetails}
                        onChange={(e) => {
                            setProjectDetails(e.target.value)
                            setErrors((prevErrors) => ({
                                ...prevErrors,
                                projectDetails: false,
                            }))
                        }}
                    />
                    {errors.projectDetails && <TypographyI />}
                </div>

                <div className="flex w-2/3 flex-col">
                    <label className="text-blackberry mb-[1rem] capitalize">
                        Set due date:{' '}
                    </label>
                    <Input
                        type="date"
                        color="pink"
                        label="Input Project Due Date"
                        value={dueDate}
                        onChange={(e) => {
                            setDueDate(e.target.value)
                            setErrors((prevErrors) => ({
                                ...prevErrors,
                                dueDate: false,
                            }))
                        }}
                    />
                    {errors.dueDate && <TypographyI />}
                </div>

                <div className="flex w-2/3  flex-col">
                    <label className="text-blackberry mb-[1rem] capitalize">
                        Project Category
                    </label>
                    <Select
                        // mult
                        label="Select Project Category"
                        value={projectCategory}
                        onChange={(value) => {
                            setProjectCategory(value)
                            setErrors((prevErrors) => ({
                                ...prevErrors,
                                projectCategory: false,
                            }))
                        }}
                    >
                        <Option value="Development">Development</Option>
                        <Option value="Design">Design</Option>
                        <Option value="Sales">Sales</Option>
                        <Option value="Marketing">Marketing</Option>
                    </Select>
                    {errors.projectCategory && <TypographyI />}
                </div>

                <div className="flex w-full flex-col">
                    <label className="text-blackberry mb-[1rem] capitalize">
                        Assigned To:
                    </label>
                    <Menu
                        dismiss={{
                            itemPress: false,
                        }}
                    >
                        <MenuHandler>
                            <Button variant="outlined" color="pink">
                                {assignedTo.length > 0
                                    ? assignedTo
                                          .map((user) => user.displayName)
                                          .join(', ')
                                    : 'Select Single or Multiple Users'}
                            </Button>
                            {/* <Select
                                label={
                                    assignedTo.length > 0
                                        ? assignedTo
                                              .map((user) => user.displayName)
                                              .join(', ')
                                        : 'Select Assigned To'
                                }
                            /> */}
                        </MenuHandler>
                        <MenuList>
                            {users.map((user) => (
                                <MenuItem key={user.id} className="p-0">
                                    <label
                                        htmlFor={user.displayName}
                                        className="flex cursor-pointer items-center gap-2 p-2"
                                    >
                                        <Checkbox
                                            ripple={false}
                                            id={user.displayName}
                                            containerProps={{
                                                className: 'p-0',
                                            }}
                                            className="hover:before:content-none"
                                            checked={assignedTo.some(
                                                (assignedUser) =>
                                                    assignedUser.uid === user.id
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(user)
                                            }
                                        />
                                        {user.displayName}
                                    </label>
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    {errors.assignedTo && <TypographyI />}
                </div>

                <div className="flex w-full flex-col my-[2rem]">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="text-sm tracking-[0.17rem] font-roboto capitalize bg-pink-500 flex justify-center items-center gap-2 py-[0.7rem]"
                    >
                        {loading && (
                            <span className="border-4 border-dashed rounded-full w-4 h-4 animate-spin border-white"></span>
                        )}
                        Create Project <MdOutlineAddTask size={20} />
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default NewProject
