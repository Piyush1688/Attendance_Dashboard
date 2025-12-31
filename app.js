import { db } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Global data storage
let allStudents = [];
let allFaculty = [];

// --- 1. SIDEBAR & NAVIGATION LOGIC ---
const menuBtn = document.getElementById("menuBtn");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");
const body = document.body;
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");

// Open Sidebar
menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    body.classList.toggle("sidebar-open");
});

// Close Sidebar via X button
closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("active");
    body.classList.remove("sidebar-open");
});

// Switch Sections logic
links.forEach(link => {
    link.addEventListener("click", () => {
        const target = link.getAttribute("data-section");
        
        // Update UI
        sections.forEach(sec => sec.classList.remove("active"));
        document.getElementById("section-" + target).classList.add("active");
        document.getElementById("pageTitle").innerText = target.charAt(0).toUpperCase() + target.slice(1);

        // Auto-close sidebar on mobile
        if (window.innerWidth < 768) {
            sidebar.classList.remove("active");
            body.classList.remove("sidebar-open");
        }
    });
});

// --- 2. DASHBOARD LOGIC ---
function updateDashboard(students) {
    const total = students.length;
    const present = students.filter(s => s.status === "Present").length;
    const absent = total - present;

    document.getElementById("totalStudents").innerText = total;
    document.getElementById("presentCount").innerText = present;
    document.getElementById("absentCount").innerText = absent;

    // Draw Chart
    const ctx = document.getElementById("attendanceChart").getContext("2d");
    if (window.myChart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Present", "Absent"],
            datasets: [{
                label: 'Student Count',
                data: [present, absent],
                backgroundColor: ["#4caf50", "#f44336"]
            }]
        },
        options: { responsive: true }
    });
}

// --- 3. STUDENT SEARCH & RENDER ---
function renderStudents(data) {
    const container = document.getElementById("studentDetails");
    container.innerHTML = data.map(s => `
        <div class="card" style="text-align: left;">
            <strong>${s.name}</strong> (Roll: ${s.rollNo})<br>
            <small>Section: ${s.section} | Status: <span style="color: ${s.status === 'Present' ? 'green' : 'red'}">${s.status}</span></small>
        </div>
    `).join('');
}

document.getElementById("studentSearch").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allStudents.filter(s => s.name.toLowerCase().includes(term) || s.rollNo.toString().includes(term));
    renderStudents(filtered);
});

// --- 4. FACULTY SEARCH & RENDER ---
function renderFaculty(data) {
    const container = document.getElementById("facultyDetails");
    container.innerHTML = data.map(f => `
        <div class="card" style="text-align: left; border-left: 4px solid #6366f1;">
            <strong>${f.name}</strong><br>
            <small>${f.designation} - ${f.department}</small>
        </div>
    `).join('');
}

document.getElementById("facultySearch").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allFaculty.filter(f => f.name.toLowerCase().includes(term));
    renderFaculty(filtered);
});

// --- 5. INITIALIZE FIREBASE LISTENERS ---
function init() {
    // Listen for Student changes
    onSnapshot(collection(db, "students"), (snapshot) => {
        allStudents = snapshot.docs.map(doc => doc.data());
        updateDashboard(allStudents);
        renderStudents(allStudents);
    });

    // Listen for Faculty changes
    onSnapshot(collection(db, "faculty"), (snapshot) => {
        allFaculty = snapshot.docs.map(doc => doc.data());
        renderFaculty(allFaculty);
    });
}

init();