import React, { useEffect, useState } from 'react'
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    CardFooter,
    Avatar,
    Typography,
    Card,
    CardBody,
} from '@material-tailwind/react'
import { GiStack } from 'react-icons/gi'
import { FaRegCircleUser } from 'react-icons/fa6'
import { FaLaptopCode } from 'react-icons/fa'
import { LuFigma } from 'react-icons/lu'
import { AiOutlineStock } from 'react-icons/ai'
import { FcSalesPerformance } from 'react-icons/fc'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../firebase/firebaseConfig'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const [currentUser, setCurrentUser] = useState(null)
    const [projects, setProjects] = useState([])
    const [userProjects, setUserProjects] = useState([])
    const [userAvatars, setUserAvatars] = useState({})
    const [selectedTab, setSelectedTab] = useState('all')
    const navigate = useNavigate()

    const handleCardClick = (projectId) => {
        navigate(`/dashboard/${projectId}`)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user)
                // Filter projects based on the current user's UID
                const filteredProjects = projects.filter((project) => {
                    if (Array.isArray(project.assignedTo)) {
                        return project.assignedTo.some(
                            (assignee) => assignee.uid === user.uid
                        )
                    } else if (project.assignedTo) {
                        return project.assignedTo.uid === user.uid
                    }
                    return false
                })
                setUserProjects(filteredProjects)
            } else {
                setCurrentUser(null)
                setUserProjects([])
            }
        })

        return () => unsubscribe()
    }, [projects])

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'projects'))
                const projectsList = []
                querySnapshot.forEach((doc) => {
                    projectsList.push({ id: doc.id, ...doc.data() })
                })

                // Fetch user avatars
                const userAvatars = {}
                await Promise.all(
                    projectsList.map(async (project) => {
                        if (Array.isArray(project.assignedTo)) {
                            for (const assignee of project.assignedTo) {
                                if (!userAvatars[assignee.uid]) {
                                    const userDoc = await getDoc(
                                        doc(db, 'users', assignee.uid)
                                    )
                                    if (userDoc.exists()) {
                                        userAvatars[
                                            assignee.uid
                                        ] = userDoc.data().photoURL
                                    }
                                }
                            }
                        } else if (project.assignedTo) {
                            const assignee = project.assignedTo
                            if (!userAvatars[assignee.uid]) {
                                const userDoc = await getDoc(
                                    doc(db, 'users', assignee.uid)
                                )
                                if (userDoc.exists()) {
                                    userAvatars[
                                        assignee.uid
                                    ] = userDoc.data().photoURL
                                }
                            }
                        }
                    })
                )

                setProjects(projectsList)
                setUserAvatars(userAvatars)
                console.log(projectsList)
            } catch (error) {
                console.error('Error fetching projects: ', error)
            }
        }
        fetchProjects()
    }, [])

    // Filter projects based on projectCategory
    const developmentProjects = projects.filter(
        (project) => project.projectCategory === 'Development'
    )
    const designProjects = projects.filter(
        (project) => project.projectCategory === 'Design'
    )
    const salesProjects = projects.filter(
        (project) => project.projectCategory === 'Sales'
    )
    const marketingProjects = projects.filter(
        (project) => project.projectCategory === 'Marketing'
    )

    const data = [
        {
            label: 'All',
            value: 'all',
            icon: GiStack,
            desc: projects,
        },
        {
            label: 'Mine',
            value: 'mine',
            icon: FaRegCircleUser,
            desc: userProjects,
        },
        {
            label: 'Development',
            value: 'Development',
            icon: FaLaptopCode,
            desc: developmentProjects,
        },
        {
            label: 'Design',
            value: 'Design',
            icon: LuFigma,
            desc: designProjects,
        },
        {
            label: 'Marketing',
            value: 'Marketing',
            icon: AiOutlineStock,
            desc: salesProjects,
        },
        {
            label: 'Sales',
            value: 'Sales',
            icon: FcSalesPerformance,
            desc: marketingProjects,
        },
    ]

    if (!currentUser) {
        return <div>Loading...</div>
    }

    return (
        <div className="px-[1rem] mt-[4rem] font-roboto lg:px-[4rem]">
            <div className="flex gap-[1.5rem] flex-col">
                <p className="text-blackberry font-roboto font-medium text-[1.3rem]">
                    Dashboard
                </p>

                <Tabs
                    value={selectedTab}
                    onChange={(value) => setSelectedTab(value)}
                >
                    <TabsHeader>
                        {data.map(({ label, value, icon }) => (
                            <Tab key={value} value={value}>
                                <div className="flex items-center gap-2">
                                    {React.createElement(icon, {
                                        className: 'w-5 h-5',
                                    })}
                                    {label}
                                </div>
                            </Tab>
                        ))}
                    </TabsHeader>
                    <TabsBody className="">
                        {data.map(({ value, desc }) => (
                            <TabPanel key={value} value={value}>
                                {Array.isArray(desc) ? (
                                    <ul className="grid gap-5 grid-cols-2">
                                        {desc.map((project) => (
                                            <Card
                                                onClick={() =>
                                                    handleCardClick(project.id)
                                                }
                                                key={project.id}
                                                className="max-w-[24rem] cursor-pointer overflow-hidden"
                                            >
                                                <CardBody>
                                                    <Typography
                                                        className="capitalize"
                                                        variant="h5"
                                                        color="blue-gray"
                                                    >
                                                        {project.projectName}
                                                    </Typography>
                                                    <Typography className="font-normal">
                                                        Due by {project.dueDate}
                                                    </Typography>
                                                    <div className="grid mt-[1rem]  grid-cols-3 gap-4">
                                                        {Array.isArray(
                                                            project.assignedTo
                                                        )
                                                            ? project.assignedTo.map(
                                                                  (
                                                                      assignee
                                                                  ) => (
                                                                      <div
                                                                          key={
                                                                              assignee.uid
                                                                          }
                                                                          className="flex flex-col items-center gap-2"
                                                                      >
                                                                          <Avatar
                                                                              src={
                                                                                  userAvatars[
                                                                                      assignee
                                                                                          .uid
                                                                                  ] ||
                                                                                  'https://docs.material-tailwind.com/img/face-2.jpg'
                                                                              }
                                                                              alt="avatar"
                                                                              size="sm"
                                                                          />
                                                                          <div>
                                                                              <Typography
                                                                                  variant="small"
                                                                                  color="gray"
                                                                                  className="font-normal text-center"
                                                                              >
                                                                                  {assignee
                                                                                      .displayName
                                                                                      .length >
                                                                                  10
                                                                                      ? `${assignee.displayName.slice(
                                                                                            0,
                                                                                            10
                                                                                        )}...`
                                                                                      : assignee.displayName}
                                                                              </Typography>
                                                                          </div>
                                                                      </div>
                                                                  )
                                                              )
                                                            : project.assignedTo && (
                                                                  <div
                                                                      key={
                                                                          project
                                                                              .assignedTo
                                                                              .uid
                                                                      }
                                                                      className="flex flex-col items-center gap-2"
                                                                  >
                                                                      <Avatar
                                                                          src={
                                                                              userAvatars[
                                                                                  project
                                                                                      .assignedTo
                                                                                      .uid
                                                                              ] ||
                                                                              'https://docs.material-tailwind.com/img/face-2.jpg'
                                                                          }
                                                                          alt="avatar"
                                                                          size="sm"
                                                                      />
                                                                      <div>
                                                                          <Typography
                                                                              variant="small"
                                                                              color="gray"
                                                                              className="font-normal"
                                                                          >
                                                                              {project
                                                                                  .assignedTo
                                                                                  .displayName
                                                                                  .length >
                                                                              10
                                                                                  ? `${project.assignedTo.displayName.slice(
                                                                                        0,
                                                                                        10
                                                                                    )}...`
                                                                                  : project
                                                                                        .assignedTo
                                                                                        .displayName}
                                                                          </Typography>
                                                                      </div>
                                                                  </div>
                                                              )}
                                                    </div>
                                                </CardBody>
                                                <hr></hr>
                                                <CardFooter className="flex gap-3 items-center">
                                                    <Typography className="font-normal">
                                                        Assigned By:{' '}
                                                        {
                                                            project.assignedBy
                                                                .displayName
                                                        }
                                                    </Typography>
                                                    <Avatar
                                                        src={
                                                            project.assignedBy
                                                                .photoURL
                                                        }
                                                        alt="avatar"
                                                        size="sm"
                                                    />
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{desc}</p>
                                )}
                            </TabPanel>
                        ))}
                    </TabsBody>
                </Tabs>
            </div>
        </div>
    )
}

export default Dashboard
