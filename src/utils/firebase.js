// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "blog-6412c.firebaseapp.com",
  projectId: "blog-6412c",
  storageBucket: "blog-6412c.firebasestorage.app",
  messagingSenderId: "558177127547",
  appId: "1:558177127547:web:7567538dfb4b0a961de6de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);