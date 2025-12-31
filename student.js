// students.js
import { db } from "./firebase.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let studentsData = [];

async function loadStudents() {
  const studentCol = collection(db, "attendance");
  const snapshot = await getDocs(studentCol);
  studentsData = snapshot.docs.map(doc => doc.data());
  renderStudents(studentsData);
}

// Render student cards + chart placeholder
function renderStudents(data) {
  const detailsDiv = document.getElementById("studentDetails");
  detailsDiv.innerHTML = data.map(s => `
    <div class="student-card">
      <p><strong>${s.name}</strong> (${s.roll})</p>
      <p>Status: ${s.status}</p>
      <p>Year: ${s.classYear}, Section: ${s.section}</p>
      <p>Total Present: ${s.totalPresent}, Total Absent: ${s.totalAbsent}</p>
      <canvas id="chart-${s.roll}" width="400" height="200"></canvas>
    </div>
  `).join('');

  // Draw graphs per student
  data.forEach(s => {
    const ctx = document.getElementById(`chart-${s.roll}`).getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Present", "Absent"],
        datasets: [{
          label: "Attendance",
          data: [s.totalPresent, s.totalAbsent],
          backgroundColor: ["green", "red"]
        }]
      },
      options: { responsive: true }
    });
  });
}

// Search functionality
document.getElementById("studentSearch").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = studentsData.filter(s => 
    s.name.toLowerCase().includes(term) || s.roll.toString().includes(term)
  );
  renderStudents(filtered);
});

// Sort functionality
document.getElementById("attendanceSort").addEventListener("change", (e) => {
  const sortType = e.target.value; // weekly / monthly / semester
  // For now, just re-render same data, sorting can be added later when data has timestamps
  renderStudents(studentsData); 
});

loadStudents();
