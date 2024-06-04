// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_FIREBASE_API,
  authDomain: "todo-list-app-754d4.firebaseapp.com",
  projectId: "todo-list-app-754d4",
  storageBucket: "todo-list-app-754d4.appspot.com",
  messagingSenderId: "764066145000",
  appId: "1:764066145000:web:130d22af394f3b79585f5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)