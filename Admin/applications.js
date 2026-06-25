import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDjcNfeAoSv6l22eELrmnX82rs0Uh3TJ9I",
    authDomain: "school-management-f7a54.firebaseapp.com",
    projectId: "school-management-f7a54",
    storageBucket: "school-management-f7a54.firebasestorage.app",
    messagingSenderId: "333306723954",
    appId: "1:333306723954:web:36b88533e53aee10128ceb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const applicationTable = document.getElementById("applicationTable");

const snapshot = await getDocs(
    collection(db, "applications")
);

snapshot.forEach((document) => {

    const data = document.data();
    const id = document.id;

    console.log(id);

    applicationTable.innerHTML += `
    <tr>
        <td>${data.firstName} ${data.lastName}</td>
        <td>${data.email}</td>
        <td>${data.course}</td>
        <td>${data.status}</td>
        <td>
            <button class="approve" data-id="${id}">
                    Approve
            </button>

            <button class="reject" data-id="${id}">
                Reject
            </button>
        </td>
    </tr>
    `;

});
const approveButtons = document.querySelectorAll(".approve");

approveButtons.forEach((button) => {


    button.addEventListener("click", async () => {

        const id = button.dataset.id;

        const applicationRef = doc(
            db,
            "applications",
            id
        );

        const matricNumber =
            "CVU2026" +
            Math.floor(Math.random() * 1000);

        await updateDoc(
            applicationRef,
            {
                status: "Approved",
                matricNumber: matricNumber
            }
        );

        Swal.fire(
            "Application Approved",
            `Matric Number: ${matricNumber}`,
            "success"
        );

    })
});

const rejectButtons = document.querySelectorAll(".reject");

rejectButtons.forEach((button) => {


    button.addEventListener("click", async () => {
        const id = button.dataset.id;
        console.log(id);

        const applicationRef = doc(
            db,
            "applications",
            id
        );

        await updateDoc(
            applicationRef,
            {
                status: "Rejected"
            }
        );

        Swal.fire(
            "Application Rejected",
            "The application has been rejected.",
            "error"
        );
    });
});