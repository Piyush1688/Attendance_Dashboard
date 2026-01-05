import { db } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let allStudents = [];
let myChart = null;

// --- NAVIGATION & SIDEBAR ---
const sidebar = document.getElementById("sidebar");
const body = document.body;

document.getElementById("menuBtn").onclick = () => { sidebar.classList.toggle("active"); body.classList.toggle("sidebar-open"); };
document.getElementById("closeSidebar").onclick = () => { sidebar.classList.remove("active"); body.classList.remove("sidebar-open"); };

document.querySelectorAll(".nav-link").forEach(link => {
    link.onclick = () => {
        const target = link.getAttribute("data-section");
        showSection(target);
    };
});

function showSection(id) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById("section-" + id).classList.add("active");
    if (window.innerWidth < 768) sidebar.classList.remove("active");
}

// --- DATA FETCHING & FILTERING ---
function init() {
    // Populate Roll Numbers 1-80
    const rollSelect = document.getElementById("filterRoll");
    for (let i = 1; i <= 80; i++) {
        let opt = document.createElement("option");
        opt.value = i; opt.text = i; rollSelect.add(opt);
    }

    onSnapshot(collection(db, "students"), (snapshot) => {
        allStudents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        updateDashboard(allStudents);
        renderStudentList();
    });

    // Filter Listeners
    ["studentSearch", "filterDept", "filterYear", "filterSection", "filterRoll"].forEach(id => {
        document.getElementById(id).addEventListener("input", renderStudentList);
    });
}

function renderStudentList() {
    const term = document.getElementById("studentSearch").value.toLowerCase();
    const dept = document.getElementById("filterDept").value;
    const year = document.getElementById("filterYear").value;
    const section = document.getElementById("filterSection").value;
    const roll = document.getElementById("filterRoll").value;

    const filtered = allStudents.filter(s => {
        const matchesSearch = s.name?.toLowerCase().includes(term) || s.rollno?.toString().includes(term);
        const matchesDept = dept === "" || s.department === dept;
        const matchesYear = year === "" || s.year === year;
        const matchesSection = section === "" || s.section === section;
        const matchesRoll = roll === "" || s.rollno?.toString() === roll;
        return matchesSearch && matchesDept && matchesYear && matchesSection && matchesRoll;
    });

    document.getElementById("studentDetails").innerHTML = filtered.map(s => `
        <div class="card student-card" onclick="openProfile('${s.id}')">
            <div style="color: #6366f1; font-weight: bold; font-size: 0.8rem;">${s.year}</div>
            <strong>${s.name}</strong><br>
            <small>Roll: ${s.rollno} | Dept: ${s.department}</small>
        </div>
    `).join('');
}

// --- INDIVIDUAL PROFILE VIEW ---
window.openProfile = function(id) {
    const s = allStudents.find(student => student.id === id);
    if (!s) return;

    showSection("student-profile");
    document.getElementById("profileContainer").innerHTML = `
        <div class="card profile-header">
            <div class="profile-layout">
                <div class="profile-info">
                    <h1>${s.name}</h1>
                    <p><strong>Email:</strong> ${s.email}</p>
                    <p><strong>Mobile:</strong> ${s.mobile}</p>
                    <p><strong>DOB:</strong> ${s.dob}</p>
                    <p><strong>Gender:</strong> ${s.gender}</p>
                </div>
                <div class="profile-stats">
                    <p><strong>Roll No:</strong> ${s.rollno}</p>
                    <p><strong>Section:</strong> ${s.section}</p>
                    <p><strong>Year:</strong> ${s.year}</p>
                    <p><strong>Images Captured:</strong> ${s.imagesCount}</p>
                    <p><strong>Joined:</strong> ${new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    `;
};

document.getElementById("backToList").onclick = () => showSection("students");

// --- DASHBOARD CHART ---
function updateDashboard(students) {
    document.getElementById("totalStudents").innerText = students.length;
    // (Existing Chart Logic stays here...)
}

init();