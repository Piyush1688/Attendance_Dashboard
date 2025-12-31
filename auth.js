import { auth } from "./firebase.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// --- REGISTER LOGIC ---
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.onclick = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const name = document.getElementById("name").value.trim();

    if (!email || !password || !name) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Registration Error: " + error.message);
    }
  };
}

// --- LOGIN LOGIC ---
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.onclick = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Login Failed: " + error.message);
    }
  };
}

// --- AUTH STATE CHECKER ---
// This prevents unlogged users from accessing dashboard.html
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  // If no user and trying to access dashboard, redirect to login
  if (!user && path.includes("dashboard.html")) {
    window.location.href = "login.html";
  }
});