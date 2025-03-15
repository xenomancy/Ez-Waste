// Function to handle camera upload and preview the image
function handleCameraUpload(event) {
    const file = event.target.files[0];
    const previewImage = document.getElementById("image-preview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}

// Trigger file input on button click
document.addEventListener("DOMContentLoaded", () => {
    const cameraButton = document.querySelector(".upload-btn");
    cameraButton.addEventListener("click", () => {
        document.getElementById("camera-input").click();
    });
});
