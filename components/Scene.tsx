import React, {ReactNode, useState} from "react";
import {Button} from "@mui/material";
import Entity from "@/components/Entity";
import {useElementSize} from "@/components/funnyhook";
import TaskColumn from "@/components/TaskColumn";
import Note from "@/components/Note";
import Image from "@/components/Image";
import { initializeApp } from "firebase/app";
import {getFirestore, collection, addDoc, updateDoc, DocumentReference} from "firebase/firestore";
import {util} from "protobufjs";

export class BaseData {

}

export class ImageData extends BaseData{
    src: string = ''

    seri(): object {
        return {
            src: this.src,
        }
    }

    deseri(d: any) {
        this.src = d.src
    }
}

export class TaskData {
    title: string = ''
    checked: boolean = false
    id: any = TaskData.sus++

    static sus: number = 0

    seri(): object {
        return {
            title: this.title,
            checked: this.checked,
        }
    }

    deseri(d: any) {
        this.title = d.title
        this.checked = d.checked
    }
}

export class NoteData extends BaseData {
    content: string = ''

    seri(): object {
        return {
            content: this.content,
        }
    }

    deseri(d: any) {
        this.content = d.content
    }
}

export class TaskColumnData extends BaseData {
    heading: string = ''
    tasks: TaskData[] = []

    seri(): object {
        return {
            heading: this.heading,
            tasks: this.tasks.map(e => e.seri()),
        }
    }

    deseri(d: any) {
        this.heading = d.heading
        d.tasks.forEach((e) => {
            let t = new TaskData()
            t.deseri(e)
            this.tasks.push(t)
        })
    }
}

export enum EntityType {
    Image,
    Column,
    Note
}

export class EntityData {
    id: any = EntityData.sus++
    doc: DocumentReference = null
    transform: {
        position: {x: number, y: number}
        rotation: number
        scale: number
    } = {
        position: {x: 0, y: 0},
        rotation: 0,
        scale: 1
    }
    data: any
    type: EntityType
    content?: ReactNode

    onRemove?: (sender: EntityData) => void = null
    onUpdateTransform?: (sender: EntityData) => void = null
    onUpdateData?: (sender: EntityData) => void = null

    static sus: number = 0

    constructor(data) {
        this.data = data
    }

    public static createImage(data: ImageData) {
        let ent = new EntityData(data)
        ent.type = EntityType.Image
        ent.content = <Image data={data} onRemove={() => ent.remove(ent)}/>
        return ent
    }

    public static createColumn(data: TaskColumnData) {
        let ent = new EntityData(data)
        ent.type = EntityType.Column
        ent.content = <TaskColumn data={data} onUpdate={() => ent.updateData(ent)} onRemove={() => ent.remove(ent)}/>
        return ent
    }

    public static createNote(data: NoteData) {
        let ent = new EntityData(data)
        ent.type = EntityType.Note
        ent.content = <Note data={data} onUpdate={() => ent.updateData(ent)} onRemove={() => ent.remove(ent)}/>
        return ent
    }

    updateTransform() {
        if (this.onUpdateTransform != null)
            this.onUpdateTransform(this)
    }

    updateData(e) {
        if (e.onUpdateData != null)
            e.onUpdateData(this)
    }

    remove(e) {
        if (e.onRemove != null)
            e.onRemove(this)
    }
}

interface ScenePropsInterface {
    data: EntityData[]
}

enum MouseButtonFlag {
    Primary = 1,
    Secondary = 2,
    Auxiliary = 4,
}

export default function Scene(props: ScenePropsInterface) {
    let [elements, setElements] = useState(props.data)
    if (elements.length != props.data.length) {
        setElements(props.data) // weird fix
    }
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
                elements[moving].updateTransform()
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
        // viewport
        if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
            view.position.x += e.deltaX * view.zoom
            view.position.y += e.deltaY * view.zoom
            setView({...view})
            return
        }
        else if (e.shiftKey && !e.ctrlKey && !e.altKey) {
            view.position.x += e.deltaY * view.zoom
            view.position.y += e.deltaX * view.zoom
            setView({...view})
            return
        }
        // elements
        else if (i < 0) {
            return
        }
        else if (!e.shiftKey && !e.ctrlKey && e.altKey) {
            elements[i].transform.scale -= e.deltaY * elements[i].transform.scale * 0.0025
            elements[i].transform.scale = Math.max(0.15, elements[i].transform.scale)
            elements[i].updateTransform()
            setElements([...elements])
            return
        }
        else if (e.shiftKey && !e.ctrlKey && e.altKey) {
            elements[i].transform.rotation -= Math.sign(e.deltaY) * Math.PI / 32
            elements[i].updateTransform()
            setElements([...elements])
            return
        }
    }

    // do not make this 0
    let grdSpace = 16
    let gridSpacing = 1 / view.zoom * grdSpace;
    while (gridSpacing < grdSpace)
        gridSpacing *= 3
    let invZoom = 1 / view.zoom

    return (
        <>
            <div ref={squareRef} style={{
                // lol this fixed my eternal issues
                "height": "calc(100% + 1px)",
                "width": "calc(100% + 1px)",
                "overflow": "hidden",
                "transform": "translate(0px, 0px)",
                "position": "fixed",
                "backgroundSize": `${gridSpacing}px ${gridSpacing}px`,
                "backgroundImage":  "radial-gradient(#8886 1px, transparent 0)",
                "backgroundPosition": `${(viewport.width / 2 - view.position.x) * invZoom + viewport.width / 2}px ${(viewport.height / 2 - view.position.y) * invZoom + viewport.height / 2}px`,

            }}
                onMouseMove={(e) => handleMove(-1, e)}
                onMouseUp={(e) => handleUp(-1, e)}
                onWheel={(e) => handleWheel(-1, e)}
            >
                {
                    elements.map((e, i) => {
                        return <Entity
                            key={e.id}
                            identifier={i}
                            view={{...view, viewport: {width: viewport.width + "px", height: viewport.height + "px"}}}
                            transform={e.transform}
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