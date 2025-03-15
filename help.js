document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("pause-btn").addEventListener("click", toggleChatPause);
document.getElementById("user-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") sendMessage();
});

let isPaused = false;
const GEMINI_API_KEY = "AIzaSyDMcRY4fKt0wxzRi3cTohKy09iNqIF9kR4"; // Replace with your actual API key
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDMcRY4fKt0wxzRi3cTohKy09iNqIF9kR4";

function sendMessage() {
    if (isPaused) return;

    let userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    let chatbox = document.getElementById("chatbox");

    chatbox.appendChild(createMsgElement(userInput, "user-message"));
    document.getElementById("user-input").value = "";
    document.getElementById("user-input").disabled = true;
    chatbox.scrollTop = chatbox.scrollHeight;

    let loadingMsg = createMsgElement("Thinking...", "bot-message");
    chatbox.appendChild(loadingMsg);
    chatbox.scrollTop = chatbox.scrollHeight;

    // ✅ Corrected API Request Format
    fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: userInput }] }] // Correct input format
        })
    })
    .then(response => response.json())
    .then(data => {
        chatbox.removeChild(loadingMsg);
        let botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that.";
        typeMessage(botReply, "bot-message");
    })
    .catch(error => {
        chatbox.removeChild(loadingMsg);
        chatbox.appendChild(createMsgElement("⚠ Error: Unable to connect to AI.", "bot-message"));
        console.error("Error:", error);
    })
    .finally(() => {
        document.getElementById("user-input").disabled = false;
    });
}

function createMsgElement(content, type) {
    let div = document.createElement("div");
    div.classList.add(type);
    div.innerHTML = content;
    return div;
}

function typeMessage(message, type) {
    if (isPaused) return;

    let chatbox = document.getElementById("chatbox");
    let div = document.createElement("div");
    div.classList.add(type);
    chatbox.appendChild(div);

    let index = 0;
    function typeEffect() {
        if (index < message.length && !isPaused) {
            div.innerHTML += message.charAt(index);
            index++;
            setTimeout(typeEffect, 25);
        }
        chatbox.scrollTop = chatbox.scrollHeight;
    }
    typeEffect();
}

function toggleChatPause() {
    isPaused = !isPaused;
    let pauseBtn = document.getElementById("pause-btn");
    pauseBtn.innerText = isPaused ? "Resume Chat" : "Pause Chat";
    pauseBtn.style.background = isPaused ? "#27ae60" : "#ff4757";
}