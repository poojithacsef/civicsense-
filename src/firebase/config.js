import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBekXem-DTWb4X0mGtXdokn040yiiCnMgE",
  authDomain: "civicsense-98516.firebaseapp.com",
  projectId: "civicsense-98516",
  storageBucket: "civicsense-98516.firebasestorage.app",
  messagingSenderId: "397042879404",
  appId: "1:397042879404:web:66ae58dd4248ea07424809",
  measurementId: "G-YKX16T19FX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
