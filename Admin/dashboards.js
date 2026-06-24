import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
    getAuth,
    signOut
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyDjcNfeAoSv6l22eELrmnX82rs0Uh3TJ9I",
    authDomain: "school-management-f7a54.firebaseapp.com",
    projectId: "school-management-f7a54",
    storageBucket: "school-management-f7a54.firebasestorage.app",
    messagingSenderId: "333306723954",
    appId: "1:333306723954:web:36b88533e53aee10128ceb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);

const applicationCount = document.getElementById("applicationCount");
const studentCount = document.getElementById("studentCount");
const pendingCount = document.getElementById("pendingCount");
const applicationTable = document.getElementById("applicationTable");

const snapshot = await getDocs(
    collection(db, "applications")
);

let totalApplications = 0;
let approvedStudents = 0;
let pendingApplications = 0;

snapshot.forEach((doc) => {

    const data = doc.data();

    totalApplications++;

    if (data.status === "Approved") {
        approvedStudents++;
    }

    if (data.status === "Pending") {
        pendingApplications++;
    }

    applicationTable.innerHTML += `
        <tr>
            <td>${data.firstName} ${data.lastName}</td>
            <td>${data.email}</td>
            <td>${data.course}</td>
            <td>${data.status}</td>
        </tr>
    `;
});

applicationCount.innerHTML = totalApplications;

studentCount.innerHTML = approvedStudents;

pendingCount.innerHTML = pendingApplications;

document.getElementById("logout").addEventListener("click", async (e) => {
    e.preventDefault();
    await signOut(auth);

    window.location.replace("/Logs/login.html");

});