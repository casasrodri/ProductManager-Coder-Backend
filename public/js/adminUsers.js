const deleteUser = async (uid) => {
    Swal.fire({
        title: "Are you sure to delete the user?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/users/${uid}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log(data)

                if (data.status == 'ok') location.reload();
            } catch (err) {
                console.log(err);
            }
        }
    });
}

const switchRole = async (uid) => {
    try {
        const response = await fetch(`/api/users/premium/${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log(data)

        if (data.status == 'ok') location.reload();

        if (data.status == 'error' && data.message == 'Missing documents.') {
            Swal.fire({
                title: "Missing documents",
                text: `Please, upload the following documents to become a premium user: ${data.data.missingDocs.join(", ")}`,
                icon: "error"
            });
        }

    } catch (err) {
        console.log(err);
    }
}


const deleteInactiveUsers = async () => {
    Swal.fire({
        title: "Are you sure to delete inactive users?",
        text: "You won't be able to revert this! The users will be notifid by email.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/users`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log(data)

                if (data.status == 'ok') location.reload();
            } catch (err) {
                console.log(err);
            }
        }
    });
}
