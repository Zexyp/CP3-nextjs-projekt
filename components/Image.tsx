import {Box, IconButton} from "@mui/material";
import {ImageData, NoteData} from "@/components/Scene";
import React, {useState} from "react";
import {Delete} from "@mui/icons-material";

interface NotePropsInterface {
    data: NoteData
}

interface ImagePropsInterface {
    data: ImageData
    onRemove: () => void
}

export default function Image(props: ImagePropsInterface) {
    return (
        <Box>
            <Box paddingBottom={1}>
                <IconButton onClick={props.onRemove}><Delete/></IconButton>
            </Box>
            <img src={props.data.src} draggable="false" unselectable="on" style={{"userSelect": "none"}}/>
        </Box>
    )
}