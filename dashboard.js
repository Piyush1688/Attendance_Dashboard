// dashboard.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

async function loadDashboard() {
  const studentsCol = collection(db, "students"); // ✅ Fetch students, not "attendance"
  const snapshot = await getDocs(studentsCol);
  const students = snapshot.docs.map(doc => doc.data());

  // Calculate stats
  const totalStudents = students.length;
  const presentToday = students.reduce((sum, s) => sum + (s.status === "Present" ? 1 : 0), 0);
  const absentToday = students.reduce((sum, s) => sum + (s.status === "Absent" ? 1 : 0), 0);

  document.getElementById("totalStudents").textContent = totalStudents;
  document.getElementById("presentCount").textContent = presentToday;
  document.getElementById("absentCount").textContent = absentToday;

  // Prepare chart data
  const labels = students.map(s => s.name);
  const attendanceValues = students.map(s => s.status === "Present" ? 1 : 0);

  const ctx = document.getElementById("attendanceChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Attendance (1=Present, 0=Absent)",
        data: attendanceValues,
        backgroundColor: attendanceValues.map(v => v ? "green" : "red")
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 1 }
      }
    }
  });
}

// Call immediately
loadDashboard();
