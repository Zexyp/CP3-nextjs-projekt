
// the css matrix goes like so:
// -     -
// | 1 0 |
// | 0 1 |  ==  matrix(1, 0, 0, 1, 0, 0)
// | 0 0 |
// -     -

import { Box, useTheme } from "@mui/material";
import {ReactNode, useState} from "react";

export interface EntityPropsInterface {
    transform: {
        position: {x: number, y: number}
        rotation: number
        scale: number
    }
    view: {position: {x: number, y: number}, zoom: number, viewport: {width: string, height: string}}
    handleMove?: (i, e) => void
    handleDown?: (i, e) => void
    handleUp?: (i, e) => void
    handleWheel?: (i, e) => void
    children?: ReactNode
    identifier: any
}

export default function Entity(props: EntityPropsInterface) {
    return (
        <Box style={{
            "border": "1px solid #8888",
            "borderRadius": "8px",
            "padding": "16px",
            "cursor": "grab",
            "width": "fit-content",
            "height": "fit-content",
            "position": "absolute",
            "top": 0,
            "left": 0,
            "background": useTheme().palette.background.default,
            "transform":
                // center
                "translate(-50%, -50%)" +
                // center coords
                `translate(calc(${props.view.viewport.width} / 2), calc(${props.view.viewport.height} / 2))` +
                // view
                `matrix(${1 / props.view.zoom},    ${0},` +
                       `${0},                      ${1 / props.view.zoom},` +
                       `${0},                      ${0}) ` +
                `matrix(${1},                      ${0},` +
                       `${0},                      ${1},` +
                       `${-props.view.position.x}, ${-props.view.position.y}) ` +
                // model
                `matrix(${1},                                  ${0},` +
                       `${0},                                  ${1},` +
                       `${props.transform.position.x},         ${props.transform.position.y}) ` +
                `matrix(${Math.cos(props.transform.rotation)}, ${-Math.sin(props.transform.rotation)},` +
                       `${Math.sin(props.transform.rotation)}, ${Math.cos(props.transform.rotation)},` +
                       `${0},                                  ${0}) ` +
                `matrix(${props.transform.scale},              ${0},` +
                       `${0},                                  ${props.transform.scale},` +
                       `${0},                                  ${0})`
            }}
            onMouseDown={(e) => props.handleDown && props.handleDown(props.identifier, e)}
            onMouseUp={(e) => props.handleUp && props.handleUp(props.identifier, e)}
            onMouseMove={(e) => props.handleMove && props.handleMove(props.identifier, e)}
            onWheel={(e) => props.handleWheel && props.handleWheel(props.identifier, e)}
        >
            {props.children}
        </Box>
    )
}