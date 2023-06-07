// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZDMQ-WCMnwA0-E3HozWCj7p5Arb7Ytf4",
  authDomain: "shopping-93dce.firebaseapp.com",
  projectId: "shopping-93dce",
  storageBucket: "shopping-93dce.appspot.com",
  messagingSenderId: "515679027831",
  appId: "1:515679027831:web:5a05998dfb45feec5fbc72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const firestore = getFirestore(app);

export { auth, provider, firestore };