import "./App.css";
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! 👋 How can I help you today?",
    },
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://ai-chatbot-hp61.onrender.com/chat",
        {
          message: currentInput,
        }
      );

      const aiMessage = {
        role: "ai",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const aiMessage = {
        role: "ai",
        text:
          error?.response?.data?.reply ||
          error.message ||
          "Something went wrong",
      };

      setMessages((prev) => [...prev, aiMessage]);
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <h1 className="title">
        🤖 AI ChatBot
      </h1>

      <div className="chat-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.role === "user"
                ? "user"
                : "ai"
            }`}
          >
            <strong>
              {msg.role === "user"
                ? "You"
                : "AI"}
            </strong>

            <ReactMarkdown>
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}

        {loading && (
          <div className="message ai">
            <strong>AI</strong>
            <p>Thinking...</p>
          </div>
        )}
      </div>

      <div className="input-container">
        <input
          className="input-box"
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          className="send-btn"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;