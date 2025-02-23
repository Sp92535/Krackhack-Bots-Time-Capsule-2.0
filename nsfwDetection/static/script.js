function uploadFile(type) {
    let fileInput = type === 'image' ? document.getElementById('imageUpload') : document.getElementById('videoUpload');
    let file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    let formData = new FormData();
    formData.append("file", file);

    fetch(`/upload/${type}`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        let messageDiv = document.getElementById("message");
        if (data.message.includes("blocked")) {
            messageDiv.style.color = "red";
        } else {
            messageDiv.style.color = "green";
        }
        messageDiv.innerText = data.message;
    })
    .catch(error => console.error("Error:", error));
}
