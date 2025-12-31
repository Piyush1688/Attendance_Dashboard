import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const departments = ["CSE", "ECE", "ME", "CE"];

const faculty = [];

for (let i = 1; i <= 10; i++) {
  faculty.push({
    name: `Faculty ${i}`,
    employeeId: `EMP${1000 + i}`,
    department: departments[i % departments.length],
    designation: i <= 3 ? "Professor" : "Assistant Professor",
    teachesSection: i % 2 === 0 ? "A" : "B"
  });
}

faculty.forEach(async (member) => {
  await addDoc(collection(db, "faculty"), member);
  console.log("Faculty added:", member.name);
});
