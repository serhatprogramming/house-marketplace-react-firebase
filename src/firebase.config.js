// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFireStore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpFAKMUHqrqKH66vDJ-TyVE-oWg0WlEA0",
  authDomain: "house-marketplace-app-11c87.firebaseapp.com",
  projectId: "house-marketplace-app-11c87",
  storageBucket: "house-marketplace-app-11c87.appspot.com",
  messagingSenderId: "651190976933",
  appId: "1:651190976933:web:fe592ff2577f7caf71684c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFireStore();
