// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBju8VDBSEviwGVB4qPStfUv-aX5a32h6o",
  authDomain: "frase-do-dia-58a69.firebaseapp.com",
  projectId: "frase-do-dia-58a69",
  storageBucket: "frase-do-dia-58a69.firebasestorage.app",
  messagingSenderId: "1026912735651",
  appId: "1:1026912735651:web:a5e0ee457568ec763aca16"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


