import React, {ReactNode, useState} from "react";
import {Button} from "@mui/material";
import Entity from "@/components/Entity";
import {useElementSize} from "@/components/funnyhook";
import TaskColumn from "@/components/TaskColumn";

export class TaskData {
    title: string
    checked: boolean
}

export class TaskColumnData {
    heading: string
    tasks: TaskData[]
}

export class EntityData {
    id: string
    transform: {
        position: {x: number, y: number}
        rotation: number
        scale: number
    }
    content?: ReactNode

    constructor() {
        this.transform = {
            position: {x: 0, y: 0},
            rotation: 0,
            scale: 1
        }
    }

    public static createImage(src: string) {
        let ent = new EntityData()
        ent.content = <img src={src} draggable="false" unselectable="on" style={{"userSelect": "none"}}/>
        return ent
    }

    public  static  createColumn(data: TaskColumnData) {
        let ent = new EntityData()
        ent.content = <TaskColumn tasks={data.tasks} heading={data.heading}/>
        return ent
    }
}

interface CanvasPropsInterface {
    data: EntityData[]
}

enum MouseButtonFlag {
    Primary = 1,
    Secondary = 2,
    Auxiliary = 4,
}

export default function Canvas(props: CanvasPropsInterface) {
    let [elements, setElements] = useState(props.data)
    let [moving, setMoving] = useState(-1)
    let [view, setView] = useState({position: {x: 0, y: 0}, zoom: 1})
    let [squareRef, viewport] = useElementSize()

    function handleMove(i, e) {
        switch (e.buttons) {
            case MouseButtonFlag.Auxiliary:
                view.position.x -= e.movementX * view.zoom
                view.position.y -= e.movementY * view.zoom
                setView({...view})
                break
            case MouseButtonFlag.Primary:
                if (e.ctrlKey) {
                    view.position.x -= e.movementX * view.zoom
                    view.position.y -= e.movementY * view.zoom
                    setView({...view})
                    break
                }
                if (e.shiftKey) {
                    view.zoom += e.movementY * view.zoom * 0.01
                    view.zoom = Math.max(view.zoom, .25)
                    setView({...view})
                    break
                }

                if (moving < 0)
                    break

                elements[moving].transform.position.x += e.movementX * view.zoom
                elements[moving].transform.position.y += e.movementY * view.zoom
                setElements([...elements])
                break
            default:
                moving = -1
                setMoving(moving);
        }
    }
    function handleDown(i, e) {
        if (e.buttons != MouseButtonFlag.Primary)
            return
        moving = i
        setMoving(moving)
    }
    function handleUp(i, e) {
        moving = -1
        setMoving(moving)
    }
    function handleWheel(i, e) {
        if (i >= 0) {
            moving = i
            if (e.altKey) {
                elements[i].transform.scale -= e.deltaY * elements[i].transform.scale * 0.005
                elements[i].transform.scale = Math.max(0.15, elements[i].transform.scale)
                setElements([...elements])
                return
            }
            if (e.shiftKey) {
                elements[i].transform.rotation -= Math.sign(e.deltaY) * Math.PI / 32
                setElements([...elements])
                return
            }
        }

        if (moving >= 0)
            return

        if (!e.shiftKey) {
            view.position.x += e.deltaX * view.zoom
            view.position.y += e.deltaY * view.zoom
        }
        else {
            view.position.x += e.deltaY * view.zoom
            view.position.y += e.deltaX * view.zoom
        }
        setView({...view})
    }

    return (
        <>
            <div ref={squareRef} style={{
                "height": "100%",
                "width": "100%",
                "overflow": "hidden",
                "transform": "translate(0px, 0px)",
                "position": "fixed",
            }}
                onMouseMove={(e) => handleMove(-1, e)}
                onMouseUp={(e) => handleUp(-1, e)}
                onWheel={(e) => handleWheel(-1, e)}
            >
                {
                    elements.map((e, i) => {
                        return <Entity
                            view={{...view, viewport: {width: viewport.width + "px", height: viewport.height + "px"}}}
                            identifier={i}
                            key={i}
                            position={e.transform.position}
                            rotation={e.transform.rotation}
                            scale={e.transform.scale}
                            handleMove={(i, e) => {}}
                            handleUp={(i, e) => {}}
                            handleDown={handleDown}
                            handleWheel={handleWheel}
                        >
                            {e.content}
                        </Entity>
                        })
                }
            </div>
        </>
    )
}