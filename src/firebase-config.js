import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCie3OKhykwNoNO40DMZUSGxNic8JXxF0E",
  authDomain: "inventorymanager-6f31d.firebaseapp.com",
  projectId: "inventorymanager-6f31d",
  storageBucket: "inventorymanager-6f31d.firebasestorage.app",
  messagingSenderId: "877851088996",
  appId: "1:877851088996:web:b0577990d9b36df60ca771",
  measurementId: "G-7T1GKJM02L"
};

const app = initializeApp(firebaseConfig);
let analytics;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, analytics, db };
