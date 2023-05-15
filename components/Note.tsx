import {Box, IconButton, TextField} from "@mui/material";
import {NoteData} from "@/components/Scene";
import React, {useState} from "react";
import {Delete} from "@mui/icons-material";

interface NotePropsInterface {
    data: NoteData
    onUpdate: () => void
    onRemove: () => void
}

export default function Note(props: NotePropsInterface) {
    let [content, setContent] = useState(props.data.content)

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, width: '100%'}}>
            <IconButton onClick={props.onRemove}><Delete/></IconButton>
            <TextField fullWidth label="Note" value={content} multiline onChange={(e) => { setContent(e.target.value); props.data.content = e.target.value; props.onUpdate(); }}/>
        </Box>
    )
}