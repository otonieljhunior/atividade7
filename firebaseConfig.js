import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB340F1UsCFvlueWO9ueFke2qX-7Hr6R-k",
  authDomain: "atvdd7-86d69.firebaseapp.com",
  projectId: "atvdd7-86d69",
  storageBucket: "atvdd7-86d69.firebasestorage.app",
  messagingSenderId: "1011551855304",
  appId: "1:1011551855304:web:20fd7d7a4e21c2f80e3bfd",
  measurementId: "G-QGVSCP83BS"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);