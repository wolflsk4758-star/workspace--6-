// استدعاء دوال Firebase الأساسية
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // تم إضافة هذا السطر لقاعدة البيانات

// بيانات الربط الخاصة بمشروعك
const firebaseConfig = {
  apiKey: "AIzaSyBZmeSb1aBrPVzewnJeFgGMG14m0sTHggU",
  authDomain: "wolf-lsk-clint.firebaseapp.com",
  projectId: "wolf-lsk-clint",
  storageBucket: "wolf-lsk-clint.firebasestorage.app",
  messagingSenderId: "339906681289",
  appId: "1:339906681289:web:3e652ad6463681b8e6f018",
  measurementId: "G-PR885G2EDG"
};

// تفعيل Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// تفعيل وتصدير قاعدة البيانات السحابية لكي نستخدمها في ملفات الفواتير
export const db = getFirestore(app);
