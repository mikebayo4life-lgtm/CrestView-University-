        import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
        import {
            getFirestore,
            collection,
            getDocs,
            addDoc,
            deleteDoc,
            doc
        } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
        import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

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
        const auth = getAuth(app);

        const courseForm = document.getElementById("courseForm");
        const submitBtn = document.getElementById("submitBtn");
        const statusMsg = document.getElementById("statusMsg");
        const coursesTable = document.getElementById("coursesTable");
        const emptyState = document.getElementById("emptyState");
        const filterProgramme = document.getElementById("filterProgramme");

        let allCourses = [];

        function showStatus(message, type) {
            statusMsg.textContent = message;
            statusMsg.className = "status-msg " + type;
            setTimeout(() => {
                statusMsg.textContent = "";
                statusMsg.className = "status-msg";
            }, 3000);
        }

        function renderCourses() {
            const filter = filterProgramme.value;
            const filtered = filter === "all"
                ? allCourses
                : allCourses.filter(c => c.programme === filter);

            coursesTable.innerHTML = "";

            if (filtered.length === 0) {
                emptyState.style.display = "block";
                return;
            }
            emptyState.style.display = "none";

            filtered
                .sort((a, b) => a.programme.localeCompare(b.programme) || a.courseCode.localeCompare(b.courseCode))
                .forEach(course => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td class="code">${course.courseCode}</td>
                        <td>${course.courseName}</td>
                        <td><span class="badge">${course.programme}</span></td>
                        <td class="center">${course.credits}</td>
                        <td class="center"><button class="delete-btn" data-id="${course.id}">Delete</button></td>
                    `;
                    coursesTable.appendChild(row);
                });

            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const id = btn.getAttribute("data-id");
                    if (!confirm("Delete this course?")) return;
                    try {
                        await deleteDoc(doc(db, "courses", id));
                        allCourses = allCourses.filter(c => c.id !== id);
                        renderCourses();
                        showStatus("Course deleted", "success");
                    } catch (err) {
                        console.error(err);
                        showStatus("Failed to delete course", "error");
                    }
                });
            });
        }

        async function loadCourses() {
            const snapshot = await getDocs(collection(db, "courses"));
            allCourses = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            renderCourses();
        }

        filterProgramme.addEventListener("change", renderCourses);

        courseForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const programme = document.getElementById("programme").value;
            const courseCode = document.getElementById("courseCode").value.trim();
            const courseName = document.getElementById("courseName").value.trim();
            const credits = Number(document.getElementById("credits").value);

            if (!programme || !courseCode || !courseName || !credits) {
                showStatus("Please fill in all fields", "error");
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = "Adding...";

            try {
                const newDoc = await addDoc(collection(db, "courses"), {
                    programme,
                    courseCode,
                    courseName,
                    credits,
                    createdAt: new Date().toISOString()
                });

                allCourses.push({ id: newDoc.id, programme, courseCode, courseName, credits });
                renderCourses();
                courseForm.reset();
                showStatus("Course added successfully", "success");
            } catch (err) {
                console.error(err);
                showStatus("Failed to add course", "error");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = "Add course";
            }
        });

        onAuthStateChanged(auth, (user) => {
            if (!user) {
                window.location.href = "../login.html";
                return;
            }
            loadCourses();
        });
