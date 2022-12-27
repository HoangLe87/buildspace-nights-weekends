import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIsSnB2WQZ-f35d-O480l4ZXPMcpKd6Po",
  authDomain: "anna-795d6.firebaseapp.com",
  databaseURL:
    "https://anna-795d6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "anna-795d6",
  storageBucket: "anna-795d6.appspot.com",
  messagingSenderId: "355693477518",
  appId: "1:355693477518:web:133893f06fbcb3600713df",
  measurementId: "G-3CZTDLSDDE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
