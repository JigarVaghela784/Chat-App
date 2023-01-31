import {
    addDoc,
    collection,
    orderBy,
    onSnapshot,
    query,
    serverTimestamp,
  } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
export const getAllData = async () => {
    const querySnapshot = query(
      collection(db, "Messages"),
      orderBy("timestamp", "asc")
    );
    return await onSnapshot(
      querySnapshot,
      (snapshot) => {
        let newData = [];

        snapshot.forEach((doc) => {
          newData.push({ id: doc.id, ...doc.data() });
        });
        // const setMessage= newData;
        // return setMessage
      },
      (error) => {
        console.error(error);
      }
    );
    
  };