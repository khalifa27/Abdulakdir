// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIPSuHL6jUI4aCG5o-zk5rlfnyN1xHG6g",
  authDomain: "abdulkadirs-app.firebaseapp.com",
  projectId: "abdulkadirs-app",
  storageBucket: "abdulkadirs-app.firebasestorage.app",
  messagingSenderId: "555328374738",
  appId: "1:555328374738:web:c79059c32c01fbd7c5aa0b",
  measurementId: "G-1CMBX2927P"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();
