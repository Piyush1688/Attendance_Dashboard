const admin = require("firebase-admin");

// 🔑 Service account key (DO NOT COMMIT THIS FILE)
const serviceAccount = require("./serviceaccountkey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// -------------------------------
// SEED STUDENTS
// -------------------------------
async function seedStudents() {
  const studentsRef = db.collection("students");

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

  for (const student of students) {
    await studentsRef.add(student);
    console.log("Student added:", student.name);
  }
}

// -------------------------------
// SEED FACULTY
// -------------------------------
async function seedFaculty() {
  const facultyRef = db.collection("faculty");

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

  for (const member of faculty) {
    await facultyRef.add(member);
    console.log("Faculty added:", member.name);
  }
}

// -------------------------------
// RUN SEED
// -------------------------------
async function runSeed() {
  try {
    console.log("Starting database seeding...");
    await seedStudents();
    await seedFaculty();
    console.log("✅ Database seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

runSeed();