import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Avatar,
    Tooltip,
} from '@material-tailwind/react'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../firebase/firebaseConfig'

export function BlogCard() {
    return (
        <Card className="max-w-[24rem] overflow-hidden">
            <CardBody>
                <Typography
                    className="capitalize"
                    variant="h5"
                    color="blue-gray"
                >
                    Project name
                </Typography>
                <Typography className="font-normal">
                    Due by Thurs January 10, 2024
                </Typography>
                <div className="grid mt-[1rem] grid-cols-2  lg:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <Avatar
                            src="https://docs.material-tailwind.com/img/face-2.jpg"
                            alt="avatar"
                            size="sm"
                        />
                        <div>
                            <Typography
                                variant="small"
                                color="gray"
                                className="font-normal"
                            >
                                Assigned To Names
                            </Typography>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Avatar
                            src="https://docs.material-tailwind.com/img/face-2.jpg"
                            alt="avatar"
                            size="sm"
                        />
                        <div>
                            <Typography
                                variant="small"
                                color="gray"
                                className="font-normal"
                            >
                                Assigned To Names
                            </Typography>
                        </div>
                    </div>
                </div>
            </CardBody>
            <hr></hr>
            <CardFooter className="flex gap-3 items-center">
                <Avatar
                    src="https://docs.material-tailwind.com/img/face-2.jpg"
                    alt="avatar"
                    size="sm"
                />
                <Typography className="font-normal">
                    Assigned By Name
                </Typography>
            </CardFooter>
        </Card>
    )
}
