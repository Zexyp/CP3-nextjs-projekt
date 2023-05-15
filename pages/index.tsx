/*
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>pages/index.js</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{' '}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Docs <span>-&gt;</span>
            </h2>
            <p>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Learn <span>-&gt;</span>
            </h2>
            <p>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Templates <span>-&gt;</span>
            </h2>
            <p>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Deploy <span>-&gt;</span>
            </h2>
            <p>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
*/

import {Box, Button, Checkbox, Container, Modal, useTheme} from "@mui/material";
import React, {useState} from "react";
import Entity from "@/components/Entity";
import Scene, {
    EntityData,
    NoteData,
    TaskColumnData,
    TaskData,
    ImageData,
    BaseData,
    EntityType
} from "@/components/Scene";
import {addDoc, updateDoc, deleteDoc, getFirestore, collection, DocumentReference} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {width} from "@mui/system";
import {fbCreate, fbGetAll, fbRemove, fbUpdateData, fbUpdateTransform} from "@/components/firebaseConfig";
import Panel from "@/components/Panel";

async function getEnts() {
    return (await fbGetAll()).map(doc => {
        let dbdata = doc.data()
        switch (dbdata.type) {
            case EntityType.Note: {
                let data = new NoteData()
                data.deseri(dbdata.data)
                let ed = EntityData.createNote(data)
                ed.doc = doc.ref
                ed.transform = dbdata.transform
                return ed
            }
            case EntityType.Column: {
                let data = new TaskColumnData()
                data.deseri(dbdata.data)
                let ed = EntityData.createColumn(data)
                ed.doc = doc.ref
                ed.transform = dbdata.transform
                return ed
            }
            case EntityType.Image: {
                let data = new ImageData()
                data.deseri(dbdata.data)
                let ed = EntityData.createImage(data)
                ed.doc = doc.ref
                ed.transform = dbdata.transform
                return ed
            }
            default:
                console.log("invalid data type while deserializing")
        }
    })
}

let initEnts = await getEnts()

export default function Home() {
    let [ents, setEnts] = useState(initEnts)

    async function createEnt(ent: EntityData) {
        ents.push(ent)
        setEnts([...ents]);
        await fbCreate(ent).then(d => {
            ent.doc = d
        })
    }

    ents.forEach((e) => {
        e.onRemove = (e) => {
            ents = ents.filter(v => e != v)
            setEnts([...ents])
            fbRemove(e)
        }

        // it gets quite laggy when not using this
        let updateDataId
        let updateTransformId
        e.onUpdateData = (e) => {
            clearTimeout(updateDataId);
            updateDataId = setTimeout(() => fbUpdateData(e), 1000)
        }
        e.onUpdateTransform = (e) => {
            clearTimeout(updateTransformId);
            updateTransformId = setTimeout(() => fbUpdateTransform(e), 1000)
        }
    })

    let [imageModalOpen, setImageModalOpen] = useState(false)
    async function handleCreate(type) {
        switch (type) {
            case EntityType.Note: await createEnt(EntityData.createNote(new NoteData())); break
            case EntityType.Image: setImageModalOpen(true); break
            case EntityType.Column:
                let tc = new TaskColumnData()
                tc.tasks.push(new TaskData())
                await createEnt(EntityData.createColumn(tc)); break
        }

    }

    return (
        <>
            <div style={{"width": "100%", "height": "100vh"}}>
                <Scene data={ents}/>
                <Panel onEntityCreate={handleCreate}/>
                <Modal
                    open={imageModalOpen}
                    onClose={() => setImageModalOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    padding: 4, background: useTheme().palette.background.default, borderRadius: "8px" }}>
                        <Button
                            variant="contained"
                            component="label"
                        >
                            Upload File
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={async (e) => {
                                        let data = new ImageData();

                                        let reader = new FileReader();
                                        reader.onload = async () => {
                                            data.src = reader.result.toString()
                                            console.log(data.src)

                                            await createEnt(EntityData.createImage(data))

                                            setImageModalOpen(false)
                                        }
                                        reader.readAsDataURL(e.target.files[0])
                                    }}
                                />
                        </Button>
                    </Box>
                </Modal>
            </div>
        </>
    )
}