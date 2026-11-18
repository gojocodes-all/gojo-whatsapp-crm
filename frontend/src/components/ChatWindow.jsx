import { useState } from "react";
import api from "../services/api";

function ChatWindow({ messages, selected }) {
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await api.post("/send", {
        to: selected,
        message: text,
      });

      setText("");
    } catch (err) {
      console.log(err);
      alert("Failed to send message");
    }
  };

  return (
    <div
      style={{
        flex: 1,
        padding: "20px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        {messages.map((msg) => (
          <div
            key={msg._id}
            style={{
              marginBottom: "15px",
              background: "#005c4b",
              color: "white",
              padding: "10px",
              borderRadius: "10px",
              maxWidth: "70%",
            }}
          >
            <div>{msg.message}</div>

            <small
              style={{
                display: "block",
                marginTop: "5px",
                opacity: 0.7,
              }}
            >
              {new Date(msg.createdAt).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "none",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            background: "#25d366",
            color: "white",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
