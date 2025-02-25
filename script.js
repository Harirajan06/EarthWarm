const API_KEY = "AIzaSyBxAvIVZLATxK1asmNPBSHvF4Dr-7Ruclg";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

async function sendMessageToAPI(message) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: message }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("API Response:", data);

    // Correctly access the response text
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
}

let btn = document.getElementById("btn");
let input = document.getElementById("input");
let parent = document.getElementById("display-field");

btn.addEventListener("click", async () => {
  let userMessage = input.value;
  if (userMessage.trim() === "") return;

  // Display user message
  let userLi = document.createElement("li");
  userLi.textContent = "You: " + userMessage;
  userLi.classList.add("li");
  parent.appendChild(userLi);

  // Clear input field
  input.value = "";

  // Display "Bot: ..." as a placeholder
  let botLi = document.createElement("li");
  botLi.textContent = "Bot: ...";
  botLi.classList.add("li");
  parent.appendChild(botLi);

  try {
    // Get bot response
    let response = await sendMessageToAPI(userMessage);
    botLi.textContent = "Bot: " + response;
  } catch (error) {
    console.error("Error:", error);
    botLi.textContent = "Bot: Error occurred. Please try again.";
  }
});