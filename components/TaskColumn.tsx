import {Box, Container, Grid, IconButton, TextField} from "@mui/material";
import {TaskColumnData, TaskData} from "@/components/Scene";
import Task from "@/components/Task";
import React, {useState} from "react";
import {Add, Delete} from "@mui/icons-material";

interface TaskColumnPropsInterface {
    data: TaskColumnData
    onUpdate: () => void
    onRemove: () => void
}

export default function TaskColumn(props: TaskColumnPropsInterface) {
    let [tasks, setTasks] = useState(props.data.tasks)
    let [heading, setHeading] = useState(props.data.heading)

    function taskUpdate(i) {
        setTasks([...tasks])
        props.onUpdate()
    }

    function taskRemove(i) {
        tasks.splice(i, 1)
        setTasks([...tasks])
        props.data.tasks = tasks
        props.onUpdate()
    }

    function taskAdd() {
        tasks.push(new TaskData())
        setTasks([...tasks])
        props.data.tasks = tasks
        props.onUpdate()
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2    }}>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, width: '100%'}}>
                <IconButton onClick={props.onRemove}><Delete/></IconButton>
                <TextField fullWidth label="List" value={heading} onChange={(e) => { setHeading(e.target.value); props.data.heading = e.target.value; props.onUpdate() }}/>
            </Box>
            <>
                {tasks.map((task, i) => <Task key={task.id} identifier={i} data={task}
                actionRemove={taskRemove}
                actionTitle={(i, v) => { task.title = v; taskUpdate(i) }}
                actionCheck={(i, v) => { task.checked = v; taskUpdate(i) }}/>)}
            </>
            <IconButton onClick={taskAdd}><Add/></IconButton>
        </Box>
    )
}