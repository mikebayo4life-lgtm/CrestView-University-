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

const snapshot = await getDocs(
    collection(db, "applications")
);

let totalStudents = 0;

snapshot.forEach((doc) => {

    const data = doc.data();

    if (data.status === "Approved") {

        totalStudents++;

        studentTable.innerHTML += `
            <tr>
                <td>${data.firstName} ${data.lastName}</td>
                <td>${data.email}</td>
                <td>${data.matricNumber}</td>
                <td>${data.course}</td>
            </tr>
        `;
    }

});

studentCount.innerHTML = totalStudents;