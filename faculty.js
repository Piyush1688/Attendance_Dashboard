// faculty.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let facultyData = [];

async function loadFaculty() {
  const facultyCol = collection(db, "faculty"); // Make sure this collection exists in Firestore
  const snapshot = await getDocs(facultyCol);
  facultyData = snapshot.docs.map(doc => doc.data());
  renderFaculty(facultyData);
}

function renderFaculty(data) {
  const detailsDiv = document.getElementById("facultyDetails");
  if (data.length === 0) {
    detailsDiv.innerHTML = "<p>No faculty data available.</p>";
    return;
  }

  detailsDiv.innerHTML = data.map(f => `
    <div class="faculty-card">
      <p><strong>${f.name}</strong> (${f.id || f.email || 'N/A'})</p>
      <p>Department: ${f.department || '-'}</p>
      <p>Courses: ${f.courses || '-'}</p>
    </div>
  `).join('');
}

// Search functionality
document.getElementById("facultySearch").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = facultyData.filter(f => 
    f.name.toLowerCase().includes(term) || 
    (f.id && f.id.toString().includes(term)) ||
    (f.email && f.email.toLowerCase().includes(term))
  );
  renderFaculty(filtered);
});

loadFaculty();
