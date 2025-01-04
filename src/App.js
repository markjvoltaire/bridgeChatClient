import React, { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { user: "AI Bot", content: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    setLoading(true);

    // Add user message to the chat history
    const newMessages = [...messages, { user: "You", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message.");
      }

      const data = await res.json();

      // Add AI's response to the chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "AI Bot", content: data.response },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "AI Bot", content: "Sorry, I couldn't process your request." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="discord-layout">
      {/* Sidebar */}

      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.user === "You" ? "user-message" : "bot-message"
              }`}
            >
              <strong>{msg.user}:</strong> {msg.content}
            </div>
          ))}
          {loading && (
            <div className="message bot-message">
              <em>Loading...</em>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="message-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
