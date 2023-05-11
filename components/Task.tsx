import {Box, Checkbox, Container, TextField} from "@mui/material";
import {useState} from "react";

interface TaskPropsInterface {
    title: string
    checked: boolean
}

export default function Task(props: TaskPropsInterface) {
    let [checked, setChecked] = useState(props.checked)
    let [title, setTitle] = useState(props.title)

    return (
        <Box>
            <Checkbox checked={checked}/><TextField label="Task" value={title}/>
        </Box>
    )
}