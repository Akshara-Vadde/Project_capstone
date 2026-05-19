import { updateNoteInDB } from './api.js';

export function createNote({
            id,
            title,
            content,
            x = 100,
            y = 100,
            dateTime = new Date().toLocaleString()
        },notesArray, containerElement) {

            const noteEl = document.createElement("div");

            noteEl.className = "note";
            noteEl.style.left = `${x}px`;
            noteEl.style.top = `${y}px`;

            noteEl.dataset.id = id;

            const titleInput = document.createElement("input");

            titleInput.className = "note-title";
            titleInput.value = title || "";
            titleInput.placeholder = "Title...";

            const textarea = document.createElement("textarea");

            textarea.value = content || "";
            textarea.placeholder = "Notes...";

            ////////////////////////////
            function autoResize() {

                textarea.style.height = "auto";
                textarea.style.height = textarea.scrollHeight + "px";

                noteEl.style.height = "auto";
            }

            autoResize();



            const deleteBtn = document.createElement("button");

            deleteBtn.className = "delete";
            deleteBtn.innerText = "×";

            const moveIcon = document.createElement("div");

            moveIcon.className = "move-icon";
            moveIcon.innerText = "☰";


            //////////////////////

            const infoRow = document.createElement("div");

            infoRow.className = "info-row";



            const dateEl = document.createElement("p");

            dateEl.className = "dateTime";
            dateEl.innerText = new Date(dateTime).toLocaleString() !== "Invalid Date"
                ? new Date(dateTime).toLocaleString()
                : dateTime;


            //////////////////////count of sticky notes///////////////////


            const counter = document.createElement("p");

            counter.className = "counter";
            counter.innerText = `${textarea.value.length}/250`;

            textarea.maxLength = 250;

            infoRow.appendChild(dateEl);
            infoRow.appendChild(counter);

            ////////////////copying the data in notes //////////////////

            const copyBtn = document.createElement("button");

            copyBtn.className = "copy-btn";
            copyBtn.innerText = "📋 Copy";

            copyBtn.addEventListener("click", async () => {

                try {

                    await navigator.clipboard.writeText(textarea.value);

                    copyBtn.innerText = "✅ Copied";

                    setTimeout(() => {
                        copyBtn.innerText = "📋 Copy";
                    }, 1500);

                }
                catch (err) {
                    alert("Copy failed");
                }

            });





            noteEl.appendChild(titleInput);
            noteEl.appendChild(textarea);
            noteEl.appendChild(deleteBtn);
            noteEl.appendChild(moveIcon);

            noteEl.appendChild(infoRow);
            noteEl.appendChild(copyBtn);

            containerElement.appendChild(noteEl);

            titleInput.addEventListener("input", () => {

                const currentId = noteEl.dataset.id;

                const idx = notesArray.findIndex((n) => n.id === currentId);

                if (idx !== -1) {

                    notesArray[idx].title = titleInput.value;

                    updateNoteInDB(
                        currentId,
                        titleInput.value,
                        textarea.value,
                        notesArray[idx].x,
                        notesArray[idx].y,
                        notesArray[idx].dateTime
                    );
                }

            });

            textarea.addEventListener("input", () => {

                autoResize();

                const currentId = noteEl.dataset.id;

                const idx = notesArray.findIndex((n) => n.id === currentId);

                if (idx !== -1) {

                    notesArray[idx].content = textarea.value;

                    // update counter
                    counter.innerText = `${textarea.value.length}/250`;

                    updateNoteInDB(
                        currentId,
                        titleInput.value,
                        textarea.value,
                        notesArray[idx].x,
                        notesArray[idx].y,
                        notesArray[idx].dateTime
                    );
                }

            });

            let offsetX, offsetY;

            noteEl.addEventListener("mousedown", (e) => {

                if (
                    e.target.tagName === "TEXTAREA" ||
                    e.target.tagName === "INPUT" ||
                    e.target.className === "delete" ||/////////
                    e.target.className === "copy-btn" ||
                    e.target.className === "color-btn"
                ) return;

                offsetX = e.offsetX;
                offsetY = e.offsetY;

                function onMouseMove(ev) {

                    noteEl.style.left = `${ev.pageX - offsetX}px`;
                    noteEl.style.top = `${ev.pageY - offsetY}px`;

                }

                function onMouseUp() {

                    const currentId = noteEl.dataset.id;

                    const newX = parseInt(noteEl.style.left);
                    const newY = parseInt(noteEl.style.top);

                    const idx = notesArray.findIndex((n) => n.id === currentId);

                    if (idx !== -1) {

                        notesArray[idx].x = newX;
                        notesArray[idx].y = newY;

                        updateNoteInDB(
                            currentId,
                            titleInput.value,
                            textarea.value,
                            notesArray[idx].x,
                            notesArray[idx].y,
                            notesArray[idx].dateTime
                        );
                    }

                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);

                }

                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);

            });

            deleteBtn.addEventListener("click", async () => {

                const currentId = noteEl.dataset.id;

                noteEl.remove();

                const targetIndex = notesArray.findIndex(n => n.id === currentId);
                    if (targetIndex !== -1) {
                        notesArray.splice(targetIndex, 1);
                    }

                if (currentId.length === 24) {

                    try {

                        const response = await fetch(`/api/notes/${currentId}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
                        });

                        const result = await response.json();

                        if (result.success) {
                            console.log("Note permanently deleted from DB");
                        }

                    }
                    catch (err) {
                        console.error("Failed to delete note from server:", err);
                    }

                }
                else {
                    console.log("Temporary note removed");
                }

            });

        }
