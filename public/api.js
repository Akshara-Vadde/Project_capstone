export const token = localStorage.getItem("token");
export const uid = localStorage.getItem("myUserId");



export async function updateNoteInDB(id, title, content, x, y, datetime) {

            if (id.length < 20) {
                console.log("Waiting for real MongoDB ID...");
                return;
            }

            try {

                await fetch(`/api/notes/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id,
                        title,
                        description: content,
                        x,
                        y,
                        datetime
                    })
                });

            }
            catch (err) {
                console.error("Sync failed:", err);
            }
        }