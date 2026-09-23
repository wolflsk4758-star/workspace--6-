import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZmeSb1aBrPVzewnJeFgGMG14m0sTHggU",
  authDomain: "wolf-lsk-clint.firebaseapp.com",
  projectId: "wolf-lsk-clint",
  storageBucket: "wolf-lsk-clint.firebasestorage.app",
  messagingSenderId: "339906681289",
  appId: "1:339906681289:web:3e652ad6463681b8e6f018"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);