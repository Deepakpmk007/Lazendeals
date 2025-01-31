import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD35L-jTXii4oryCiFbeEEjayMtcoIcYtQ",
  authDomain: "chat-a031a.firebaseapp.com",
  databaseURL:
    "https://chat-a031a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-a031a",
  storageBucket: "chat-a031a.appspot.com",
  messagingSenderId: "220195616691",
  appId: "1:220195616691:web:a1a5739b47c90c8ff3bdc6",
  measurementId: "G-PE1TEDNXNW",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
