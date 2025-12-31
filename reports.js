// reports.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

async function loadReports() {
  const attendanceCol = collection(db, "attendance");
  const snapshot = await getDocs(attendanceCol);
  const data = snapshot.docs.map(doc => doc.data());

  const container = document.getElementById("reportsContainer");
  if (data.length === 0) {
    container.innerHTML = "<p>No attendance records found.</p>";
    return;
  }

  // Build table
  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Roll</th>
          <th>Status</th>
          <th>Date</th>
          <th>Class</th>
          <th>Section</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(d => `
          <tr>
            <td>${d.name}</td>
            <td>${d.roll}</td>
            <td>${d.status}</td>
            <td>${d.date}</td>
            <td>${d.classYear}</td>
            <td>${d.section}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  container.innerHTML = tableHTML;

  // Optional: aggregate chart (present vs absent)
  const totalPresent = data.filter(d => d.status === "Present").length;
  const totalAbsent = data.filter(d => d.status === "Absent").length;

  const chartCanvas = document.createElement("canvas");
  chartCanvas.id = "reportsChart";
  container.appendChild(chartCanvas);

  const ctx = chartCanvas.getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Present", "Absent"],
      datasets: [{
        data: [totalPresent, totalAbsent],
        backgroundColor: ["green", "red"]
      }]
    },
    options: { responsive: true }
  });
}

loadReports();
