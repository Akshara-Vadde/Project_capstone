import { token, uid } from './api.js';
import { createNote } from './noteComponent.js';


const addBtn = document.getElementById("add-note");
        const container = document.getElementById("notes-container");
        const searchInput = document.getElementById("search");
        const darkBtn = document.getElementById("toggle-dark");
        darkBtn.innerText = "🌙 Night";

        let notes = [];

        //////////////////searching in multiple notes//////////////
        searchInput.addEventListener("input", () => {

            const value = searchInput.value.toLowerCase().trim();

            document.querySelectorAll(".note").forEach(note => {

                const title =
                    note.querySelector(".note-title").value.toLowerCase();

                const content =
                    note.querySelector("textarea").value.toLowerCase();

                if (
                    title.includes(value) ||
                    content.includes(value)
                ) {
                    note.style.display = "block";
                }
                else {
                    note.style.display = "none";
                }

            });

        });



        

        

        addBtn.addEventListener("click", async () => {

            const tempId = Date.now().toString();

            const currentDateTime = new Date();

            const noteForUI = {
                id: tempId,
                title: "",
                content: "",
                x: 100,
                y: 100,
                dateTime: currentDateTime
            };

            notes.push(noteForUI);

            createNote(noteForUI,notes,container);

            try {

                const response = await fetch('/api/notes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: "",
                        description: "",
                        userId: uid,
                        x: 100,
                        y: 100,
                        dateTime: currentDateTime
                    })
                });

                const result = await response.json();

                if (result.success) {

                    const noteIndex = notes.findIndex(n => n.id === tempId);

                    if (noteIndex !== -1) {
                        notes[noteIndex].id = result.note._id;
                    }

                    const element = document.querySelector(`[data-id="${tempId}"]`);

                    if (element) {
                        element.dataset.id = result.note._id;
                    }

                }

            }
            catch (err) {
                console.error("Add note failed:", err);
            }

        });

        async function fetchNotes() {

            try {

                const response = await fetch(`/api/notes`,{
                    method: 'GET',
                     headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                if (Array.isArray(data)) {

                    notes = data.map(n => ({
                        id: n._id,
                        title: n.title,
                        content: n.description,
                        x: n.x !== undefined ? n.x : 100,
                        y: n.y !== undefined ? n.y : 100,
                        dateTime: n.dateTime
                    }));

                    container.innerHTML = "";

                    notes.forEach(note => createNote(note,notes,container));

                }

            }
            catch (err) {
                console.error("Failed to load notes:", err);
            }

        }

        const logoutBtn=document.getElementById("logoutbtn");

        if(logoutBtn) {
               logoutBtn.addEventListener("click",()=>{
            localStorage.removeItem("token");
            localStorage.removeItem("uid");

            window.location.href = "sign_up_form.html";

        });
    }

        

        //////////////////////dark-mode///////////////////////////
        darkBtn.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                darkBtn.innerText = "☀️ Light";
            }
            else {
                darkBtn.innerText = "🌙 Night";
            }

        });


        fetchNotes();