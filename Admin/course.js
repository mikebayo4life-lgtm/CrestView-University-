import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const app = initializeApp({
    apiKey: "YOUR_API_KEY",
    authDomain: "school-management-f7a54.firebaseapp.com",
    projectId: "school-management-f7a54",
    storageBucket: "school-management-f7a54.firebasestorage.app",
    messagingSenderId: "333306723954",
    appId: "1:333306723954:web:36b88533e53aee10128ceb"
});

const db = getFirestore(app);
const auth = getAuth(app);

const form = document.getElementById("courseForm");
const table = document.getElementById("coursesTable");
const filter = document.getElementById("filterProgramme");

let courses = [];

async function loadCourses() {
    const snap = await getDocs(collection(db, "courses"));
    courses = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    displayCourses();
}

function displayCourses() {
    const selected = filter.value;

    table.innerHTML = courses
        .filter(c => selected === "all" || c.programme === selected)
        .map(c => `
            <tr>
                <td>${c.courseCode}</td>
                <td>${c.courseName}</td>
                <td>${c.programme}</td>
                <td>${c.credits}</td>
                <td>
                    <button class="delete-btn" data-id="${c.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `)
        .join("");
}

form.addEventListener("submit", async e => {
    e.preventDefault();

    const programme = programme.value;
    const courseCode = courseCode.value.trim();
    const courseName = courseName.value.trim();
    const credits = Number(credits.value);

    const ref = await addDoc(collection(db, "courses"), {
        programme,
        courseCode,
        courseName,
        credits
    });

    courses.push({
        id: ref.id,
        programme,
        courseCode,
        courseName,
        credits
    });

    form.reset();
    displayCourses();
});

table.addEventListener("click", async e => {
    if (!e.target.classList.contains("delete-btn")) return;

    const id = e.target.dataset.id;

    await deleteDoc(doc(db, "courses", id));

    courses = courses.filter(c => c.id !== id);
    displayCourses();
});

filter.addEventListener("change", displayCourses);

onAuthStateChanged(auth, user => {
    if (user) loadCourses();
});