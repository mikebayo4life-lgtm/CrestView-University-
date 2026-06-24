import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDjcNfeAoSv6l22eELrmnX82rs0Uh3TJ9I",
    authDomain: "school-management-f7a54.firebaseapp.com",
    projectId: "school-management-f7a54",
    storageBucket: "school-management-f7a54.firebasestorage.app",
    messagingSenderId: "333306723954",
    appId: "1:333306723954:web:36b88533e53aee10128ceb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const studentTable = document.getElementById("studentTable");
const studentCount = document.getElementById("studentCount");
const searchInput = document.getElementById("searchStudent");

let students = [];

// Display students
function displayStudents(studentArray) {

    studentTable.innerHTML = "";

    studentArray.forEach((student) => {

        studentTable.innerHTML += `
            <tr>
                <td>${student.firstName} ${student.lastName}</td>
                <td>${student.email}</td>
                <td>${student.matricNumber}</td>
                <td>${student.course}</td>
            </tr>
        `;

    });

}

const snapshot = await getDocs(
    collection(db, "applications")
);

let totalStudents = 0;

snapshot.forEach((doc) => {

    const data = doc.data();

    if (data.status === "Approved") {

        students.push(data);

        totalStudents++;

    }

});

displayStudents(students);

studentCount.innerHTML = totalStudents;

searchInput.addEventListener("input", () => {

    const newSearch = searchInput.value.toLowerCase();

    const filteredStudents = students.filter((student) =>

        student.firstName.toLowerCase().includes(newSearch) ||

        student.lastName.toLowerCase().includes(newSearch) ||

        (student.matricNumber || "").toLowerCase().includes(newSearch) ||

        student.course.toLowerCase().includes(newSearch)

    );

    displayStudents(filteredStudents);

});