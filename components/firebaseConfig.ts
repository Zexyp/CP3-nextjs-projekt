import {EntityData} from "@/components/Scene";
import {addDoc, collection, deleteDoc, getFirestore, updateDoc, getDocs} from "firebase/firestore";
import {initializeApp} from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_authDomain,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_messagingSenderId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_appId,
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const col = collection(db, 'entities');

export async function fbCreate(e: EntityData) {
    console.log("ent create")
    return addDoc(col, {
        transform: e.transform,
        type: e.type,
        data: e.data.seri()
    })
}

export function fbUpdateTransform(e: EntityData) {
    console.log("ent transform update")
    updateDoc(e.doc, {
        "transform": e.transform
    }).catch()
}

export function fbUpdateData(e: EntityData) {
    console.log("ent data update")
    updateDoc(e.doc, {
        "data": e.data.seri()
    }).catch()
}

export function fbRemove(e: EntityData) {
    console.log("ent remove")
    deleteDoc(e.doc)
}

export async function fbGetAll() {
    let arr = [];
    (await getDocs(col)).forEach(e => {
        arr.push(e)
    })
    return arr
}