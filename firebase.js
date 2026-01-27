import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// --- MAIN PROJECT (Registration & Auth) ---
const mainConfig = {
  apiKey: "AIzaSyD6WFyu8KTO8ptCnlQ2ZMYpeOaROdnLJc0",
  authDomain: "student-attendance-bd78d.firebaseapp.com",
  projectId: "student-attendance-bd78d",
  storageBucket: "student-attendance-bd78d.firebasestorage.app",
  messagingSenderId: "620634497411",
  appId: "1:620634497411:web:8663c5a7fe29518f3196b6"
};

// --- DUMMY PROJECT (Peayush6 Analytics) ---
const dummyConfig = {
  apiKey: "AIzaSyAjxLXGnR4i04coWeJ9m_EYBujzbD0vZYM",
  authDomain: "peayush6.firebaseapp.com",
  projectId: "peayush6",
  storageBucket: "peayush6.firebasestorage.app",
  messagingSenderId: "700340531097",
  appId: "1:700340531097:web:9dcefff309f750b8bbed08"
};

// Initialize both apps with unique names
const mainApp = initializeApp(mainConfig, "main");
const dummyApp = initializeApp(dummyConfig, "dummy");

// Export Firestore and Auth instances
export const db = getFirestore(mainApp);      // Your real registration DB
export const auth = getAuth(mainApp);        // Your real user authentication
export const dummyDb = getFirestore(dummyApp); // Your peayush6 analytics DB