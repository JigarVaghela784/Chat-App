import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAreqn7Wq5XMxQxwvnDF-iA7cvJk51imys",
  authDomain: "chat-app-aa5be.firebaseapp.com",
  databaseURL: "https://chat-app-aa5be-default-rtdb.firebaseio.com",
  projectId: "chat-app-aa5be",
  storageBucket: "chat-app-aa5be.appspot.com",
  messagingSenderId: "860524157615",
  appId: "1:860524157615:web:b04c31e69c58f719d3d25a",
  measurementId: "G-5K1JSGR55D"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const dbRef = ref(database);