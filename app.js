"use strict";

// Load chat history when the page loads
window.addEventListener("load", loadChatHistory);

document.getElementById("send-button").addEventListener("click", sendMessage);

// Allow "Enter" key to send messages
document.getElementById("user-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {
    const userInputField = document.getElementById("user-input");
    const userInput = userInputField.value.trim();

    if (!userInput) return;

    displayMessage(userInput, "user");
    saveToLocalStorage("user", userInput); // Save user message

    // Show loading message while waiting for response
    displayMessage("Thinking...", "bot");

    try {
        const response = await fetch("https://proxy-key-apyd.onrender.com/get-key", { // Ensure correct backend URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "CJBOSCO" }),
        });

        if (!response.ok) throw new Error(`Failed to fetch response: ${response.statusText}`);

        const data = await response.json();
        console.log(data)

        if (data.message) {
            displayMessage(data.message, "bot");
            saveToLocalStorage("bot", data.message); // Save bot response
        } else {
            throw new Error("Invalid API response");
        }
    } catch (error) {
        displayMessage("Error: Unable to get response", "bot");
        console.error("Chatbot API Error:", error);
    }

    userInputField.value = ""; // Clear input field
}

 
