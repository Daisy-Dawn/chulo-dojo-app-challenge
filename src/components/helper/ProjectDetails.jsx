import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp,
    orderBy,
    query,
    onSnapshot,
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase/firebaseConfig'
import {
    Card,
    CardBody,
    Typography,
    Button,
    Avatar,
    Textarea,
    IconButton,
} from '@material-tailwind/react'

const ProjectDetails = () => {
    const { projectId } = useParams()
    const [project, setProject] = useState(null)
    const [userAvatars, setUserAvatars] = useState({})
    const [currentUser, setCurrentUser] = useState(null)
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user)
            } else {
                setCurrentUser(null)
            }
        })

        return () => unsubscribeAuth()
    }, [])

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const projectDoc = await getDoc(doc(db, 'projects', projectId))
                if (projectDoc.exists()) {
                    const projectData = projectDoc.data()
                    setProject(projectData)

                    // Fetch avatars for assignedTo users
                    const userAvatars = {}
                    if (Array.isArray(projectData.assignedTo)) {
                        await Promise.all(
                            projectData.assignedTo.map(async (assignee) => {
                                const userDoc = await getDoc(
                                    doc(db, 'users', assignee.uid)
                                )
                                if (userDoc.exists()) {
                                    userAvatars[
                                        assignee.uid
                                    ] = userDoc.data().photoURL
                                }
                            })
                        )
                    } else if (projectData.assignedTo) {
                        const userDoc = await getDoc(
                            doc(db, 'users', projectData.assignedTo.uid)
                        )
                        if (userDoc.exists()) {
                            userAvatars[
                                projectData.assignedTo.uid
                            ] = userDoc.data().photoURL
                        }
                    }
                    setUserAvatars(userAvatars)
                }
            } catch (error) {
                console.error('Error fetching project details: ', error)
            }
        }

        fetchProjectDetails()
    }, [projectId])

    useEffect(() => {
        const commentsQuery = query(
            collection(db, 'projects', projectId, 'comments'),
            orderBy('timestamp', 'desc')
        )

        const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
            const commentsList = snapshot.docs.map((doc) => doc.data())
            setComments(commentsList)
        })

        return () => unsubscribe()
    }, [projectId])

    const handleCommentChange = (e) => {
        setComment(e.target.value)
    }

    const handlCancelComment = () => {
        setComment('')
    }

    const postComment = async () => {
        if (!currentUser || !comment.trim()) return

        const commentData = {
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            comment,
            timestamp: serverTimestamp(),
        }

        try {
            await addDoc(
                collection(db, 'projects', projectId, 'comments'),
                commentData
            )
            setComment('') // Clear the textarea after posting
        } catch (error) {
            console.error('Error posting comment: ', error)
        }
    }

    if (!project) return <div>Loading...</div>

    return (
        <div className="p-4 grid grid-cols-1 gap-[2rem] 2xl:gap-0 lg:grid-cols-1 2xl:grid-cols-2 md:grid-cols-2">
            <div>
                <Card className="mt-6 max-w-[24rem]">
                    <CardBody>
                        <Typography
                            variant="h5"
                            color="blue-gray"
                            className="mb-2"
                        >
                            {project.projectName}
                        </Typography>
                        <Typography>
                            By: {project.assignedBy.displayName}
                        </Typography>
                        <Typography className="">
                            Project Due: {project.dueDate}
                        </Typography>
                        <Typography className="my-[1rem]">
                            {project.projectDetails}
                        </Typography>
                        <Typography
                            variant="h6"
                            color="blue-gray"
                            className="mb-2"
                        >
                            Project is Assigned To:
                        </Typography>
                        <div className="grid mt-[1rem] grid-cols-2 gap-4">
                            {Array.isArray(project.assignedTo)
                                ? project.assignedTo.map((assignee) => (
                                      <div
                                          key={assignee.uid}
                                          className="flex flex-col items-center "
                                      >
                                          <Avatar
                                              src={
                                                  userAvatars[assignee.uid] ||
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
                                                  {assignee.displayName.length >
                                                  10
                                                      ? `${assignee.displayName.slice(
                                                            0,
                                                            10
                                                        )}...`
                                                      : assignee.displayName}
                                              </Typography>
                                          </div>
                                      </div>
                                  ))
                                : project.assignedTo && (
                                      <div
                                          key={project.assignedTo.uid}
                                          className="flex flex-col items-center gap-2"
                                      >
                                          <Avatar
                                              src={
                                                  userAvatars[
                                                      project.assignedTo.uid
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
                                                  {project.assignedTo
                                                      .displayName.length > 10
                                                      ? `${project.assignedTo.displayName.slice(
                                                            0,
                                                            10
                                                        )}...`
                                                      : project.assignedTo
                                                            .displayName}
                                              </Typography>
                                          </div>
                                      </div>
                                  )}
                        </div>
                    </CardBody>
                </Card>
                {currentUser?.uid === project.assignedBy.uid && (
                    <Button
                        className="mt-[2rem]"
                        variant="outlined"
                        color="pink"
                    >
                        Mark as Complete
                    </Button>
                )}
            </div>

            {/* Comment Section */}
            <div>
                <Typography
                    color="pink"
                    className="text-center mb-[2rem]"
                    variant="h5"
                >
                    Project Comments
                </Typography>

                <div className="space-y-4 mb-[2rem]">
                    {comments.map((commentData, index) => (
                        <Card key={index} className="max-w-96 mb-4">
                            <CardBody>
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        src={
                                            commentData.photoURL ||
                                            'https://docs.material-tailwind.com/img/face-2.jpg'
                                        }
                                        alt="avatar"
                                        size="sm"
                                    />
                                    <div>
                                        <Typography
                                            variant="h6"
                                            color="blue-gray"
                                        >
                                            {commentData.displayName}
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            color="gray"
                                        >
                                            {new Date(
                                                commentData.timestamp?.toDate()
                                            ).toLocaleString()}
                                        </Typography>
                                    </div>
                                </div>
                                <Typography className="mt-2">
                                    {commentData.comment}
                                </Typography>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* Comment Input */}

                <Textarea
                    className=""
                    color="pink"
                    placeholder="Add a Comment"
                    rows={4}
                    value={comment}
                    onChange={handleCommentChange}
                />
                <div className="flex w-full justify-between py-1.5">
                    <IconButton variant="text" color="blue-gray" size="sm">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="h-4 w-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                            />
                        </svg>
                    </IconButton>
                    <div className="flex gap-2">
                        <Button
                            onClick={handlCancelComment}
                            size="sm"
                            color="red"
                            variant="text"
                            className="rounded-md"
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            className="rounded-md"
                            onClick={postComment}
                        >
                            Post Comment
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectDetails
