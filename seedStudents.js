import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const students = [];

for (let i = 1; i <= 50; i++) {
  students.push({
    name: `Student ${i}`,
    rollNo: i,
    year: 4,
    section: i <= 25 ? "A" : "B",
    totalPresent: Math.floor(Math.random() * 15) + 75,
    totalAbsent: Math.floor(Math.random() * 10),
    status: Math.random() > 0.2 ? "Present" : "Absent"
  });
}

students.forEach(async (student) => {
  await addDoc(collection(db, "students"), student);
  console.log("Student added:", student.name);
});
