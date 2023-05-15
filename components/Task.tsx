import {Box, Button, Checkbox, Container, IconButton, TextField} from "@mui/material";
import {useState} from "react";
import {Close} from '@mui/icons-material';
import {TaskData} from "@/components/Scene";

interface TaskPropsInterface {
    data: TaskData
    actionCheck: (i: number, v: boolean) => void
    actionTitle: (i: number, v: string) => void
    actionRemove: (i: number) => void
    identifier: any
}

export default function Task(props: TaskPropsInterface) {
    let [checked, setChecked] = useState(props.data.checked)
    let [title, setTitle] = useState(props.data.title)

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1}}>
            <Checkbox checked={checked} onChange={(e) => { setChecked(e.target.checked); props.actionCheck(props.identifier, e.target.checked) }}/>
            <TextField label="Task" value={title} onChange={(e) => { setTitle(e.target.value); props.actionTitle(props.identifier, e.target.value) }}/>
            <IconButton onClick={() => props.actionRemove(props.identifier)}><Close/></IconButton>
        </Box>
    )
}