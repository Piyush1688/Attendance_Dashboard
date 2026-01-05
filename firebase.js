// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD6WFyu8KTO8ptCnlQ2ZMYpeOaROdnLJc0",
  authDomain: "student-attendance-bd78d.firebaseapp.com",
  projectId: "student-attendance-bd78d",
  storageBucket: "student-attendance-bd78d.firebasestorage.app",
  messagingSenderId: "620634497411",
  appId: "1:620634497411:web:8663c5a7fe29518f3196b6",
  measurementId: "G-ZZ3QWKJPV4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export these so dashboard.js can use them
export const db = getFirestore(app);
export const auth = getAuth(app);