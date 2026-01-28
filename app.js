import { db, dummyDb } from "./firebase.js";
import { collection, onSnapshot, doc, getDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let allStudents = [];

function init() {
    // Populate Roll Number Dropdown
    const rollSelect = document.getElementById("filterRoll");
    for (let i = 1; i <= 80; i++) {
        let opt = document.createElement("option"); opt.value = i; opt.text = i; rollSelect.add(opt);
    }

    // Sync Students from Main DB
    onSnapshot(collection(db, "students"), (snapshot) => {
        allStudents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        updateDashboard(allStudents);
        renderStudentList();
    });

    // Listen to Student Filters
    ["studentSearch", "filterDept", "filterYear", "filterRoll"].forEach(id => {
        document.getElementById(id)?.addEventListener("input", renderStudentList);
    });

    // Sidebar Toggle Logic
    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menuBtn");

    menuBtn.onclick = (e) => {
        e.stopPropagation();
        sidebar.classList.toggle("active");
        document.body.classList.toggle("sidebar-open");
    };

    // Close sidebar when clicking links
    document.querySelectorAll(".nav-link").forEach(link => {
        link.onclick = () => {
            // Section Switching
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
            
            const sectionId = "section-" + link.dataset.section;
            document.getElementById(sectionId).classList.add("active");
            document.getElementById("pageTitle").innerText = link.innerText.replace(/[^\w\s]/gi, '').trim();

            // AUTO-HIDE SIDEBAR
            sidebar.classList.remove("active");
            document.body.classList.remove("sidebar-open");
        };
    });

    // Close sidebar when clicking outside (on main content)
    document.addEventListener("click", (e) => {
        if (!sidebar.contains(e.target) && e.target !== menuBtn) {
            sidebar.classList.remove("active");
            document.body.classList.remove("sidebar-open");
        }
    });
}

function renderStudentList() {
    const term = document.getElementById("studentSearch").value.toLowerCase();
    const dept = document.getElementById("filterDept").value;
    const year = document.getElementById("filterYear").value;
    const roll = document.getElementById("filterRoll").value;

    const filtered = allStudents.filter(s => {
        return (s.name?.toLowerCase().includes(term) || s.rollno?.toString().includes(term)) &&
               (!dept || s.department === dept) &&
               (!year || s.year === year) &&
               (!roll || s.rollno?.toString() === roll);
    });

    document.getElementById("studentDetails").innerHTML = filtered.map(s => `
        <div class="card" style="cursor:pointer;" onclick="openProfile('${s.id}', '${s.rollno}')">
            <strong>${s.name || 'N/A'}</strong><br>
            <small>${s.rollno} | ${s.department}</small>
        </div>
    `).join('');
}

window.openProfile = async function(id, rollno) {
    const s = allStudents.find(st => st.id === id);
    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
    document.getElementById("section-student-profile").classList.add("active");

    document.getElementById("profileContainer").innerHTML = `
        <div class="card" style="border-top: 4px solid #6366f1;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h1 style="margin:0;">${s.name}</h1>
                <input type="date" id="calFilter" onchange="window.loadLogs('${rollno}')" style="width:auto; padding:8px;">
            </div>
            <div class="stats-cards" style="margin-bottom:20px;">
                <div class="card"><h3>Roll No</h3><p style="font-size:1.2rem;">${s.rollno}</p></div>
                <div class="card"><h3>Department</h3><p style="font-size:1.2rem;">${s.department}</p></div>
            </div>
            <table style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr style="text-align:left; border-bottom:1px solid #1f2937;">
                        <th style="padding:12px;">Date</th><th style="padding:12px;">Status</th><th style="padding:12px;">Confidence</th>
                    </tr>
                </thead>
                <tbody id="logTableBody"></tbody>
            </table>
        </div>
    `;
    window.loadLogs(rollno);
};

window.loadLogs = async function(rollno) {
    const selectedDate = document.getElementById("calFilter").value;
    const q = query(collection(dummyDb, "students_dummy", `dummy_${rollno}`, "attendance_logs"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    let logs = snap.docs.map(d => d.data());

    if (selectedDate) logs = logs.filter(l => l.date === selectedDate);

    document.getElementById("logTableBody").innerHTML = logs.map(l => `
        <tr style="border-bottom:1px solid #1f2937;">
            <td style="padding:12px;">${l.date}</td>
            <td style="padding:12px; color:${l.status === 'Present' ? '#10b981' : '#f87171'}"><strong>${l.status}</strong></td>
            <td style="padding:12px;">${(l.confidenceScore * 100).toFixed(1)}%</td>
        </tr>
    `).join('') || '<tr><td colspan="3" style="padding:20px; text-align:center;">No data found</td></tr>';
};

document.getElementById("backToList").onclick = () => {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById("section-students").classList.add("active");
};

function updateDashboard(students) {
    document.getElementById("totalStudents").innerText = students.length;
    document.getElementById("presentCount").innerText = students.filter(s => s.status === "Present").length;
    document.getElementById("absentCount").innerText = students.filter(s => s.status !== "Present").length;
}

init();

// Add this to the bottom of your app.js
import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

document.getElementById("logoutLink").onclick = async () => {
    try {
        await signOut(auth);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Logout Error:", error);
    }
};