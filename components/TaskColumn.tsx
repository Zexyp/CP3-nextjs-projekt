import {Box, Container, Grid, TextField} from "@mui/material";
import {TaskData} from "@/components/Canvas";
import Task from "@/components/Task";
import React, {useState} from "react";

interface TaskColumnPropsInterface {
    tasks: TaskData[]
    heading: string
}

export default function TaskColumn(props: TaskColumnPropsInterface) {
    let [tasks, setTasks] = useState(props.tasks)
    let [heading, setHeading] = useState(props.heading)

    return (
        <Box>
            <TextField label="List" value={props.heading}/>
            <>
                {props.tasks.map((task, i) => <Task key={i} title={task.title} checked={task.checked}/>)}
            </>
        </Box>
    )
}