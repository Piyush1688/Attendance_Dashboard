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
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const isDashboard = path.includes("dashboard.html");

  // If NOT logged in and trying to see dashboard, go to Login
  if (!user && isDashboard) {
    window.location.href = "index.html";
  } 
  // If ALREADY logged in and sitting on Login page, go to Dashboard
  else if (user && (path.includes("index.html") || path === "/")) {
    window.location.href = "dashboard.html";
  }
});