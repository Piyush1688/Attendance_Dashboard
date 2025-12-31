// firebase.js
// Modular Firebase v9 setup for Attendance Dashboard

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// ✅ Your Firebase Web App configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOlzMgjaaugPQYTGE2ICtwNs1envpkqbo",
  authDomain: "attendance-record-a28ff.firebaseapp.com",
  projectId: "attendance-record-a28ff",
  storageBucket: "attendance-record-a28ff.firebasestorage.app",
  messagingSenderId: "880634261655",
  appId: "1:880634261655:web:18048313a4885263f1b9d2"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Firestore database reference
export const db = getFirestore(app);

// Authentication reference (for future login)
export const auth = getAuth(app);