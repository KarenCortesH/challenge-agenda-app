import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnqRZDHXq_Q8zbBRhMHi1p1ZSndnTXHIM",
  authDomain: "agenda-app-5c8e3.firebaseapp.com",
  projectId: "agenda-app-5c8e3",
  storageBucket: "agenda-app-5c8e3.firebasestorage.app",
  messagingSenderId: "546219898870",
  appId: "1:546219898870:web:ed5e74d8b0b600a51cb9d7",
  measurementId: "G-DPRLG6Z5SE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
