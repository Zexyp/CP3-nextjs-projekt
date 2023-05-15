import {EntityType} from "@/components/Scene";
import {Box, Button, ClickAwayListener, Grow, IconButton, MenuItem, MenuList, Paper, Popper, useTheme} from "@mui/material";
import {KeyboardEvent, SyntheticEvent, useRef, useState} from "react";
import {Add} from "@mui/icons-material";


interface PanelPropsInterface {
    onEntityCreate: (type: EntityType) => void
}

export default function Panel(props: PanelPropsInterface) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    const handleClose = (event: Event | SyntheticEvent) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event: KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    return (
        <Box
            bgcolor={useTheme().palette.background.default}
            position={"absolute"}
            width={"100%"}
            sx={{
                borderBottom: 1,
                padding: 1,
                borderColor: 'primary.main'
            }}
        >
            <IconButton
                ref={anchorRef}
                onClick={handleToggle}
            >
                <Add/>
            </IconButton>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                >
                                    <MenuItem onClick={(e) => { props.onEntityCreate(EntityType.Note); handleClose(e) }}>Note</MenuItem>
                                    <MenuItem onClick={(e) => { props.onEntityCreate(EntityType.Column); handleClose(e) }}>Task Column</MenuItem>
                                    <MenuItem onClick={(e) => { props.onEntityCreate(EntityType.Image); handleClose(e) }}>Image</MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Box>
    )
}