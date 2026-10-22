import { useState } from "react";
import api from "../services/api";
import { canSendMessage } from "../utils/messages";

function ChatWindow({ messages, selected }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const canSend = canSendMessage({ selected, text, sending });

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!canSend) return;

    const message = text.trim();
    setSending(true);
    setError("");

    try {
      await api.post("/send", {
        to: selected,
        message,
      });

      setText("");
    } catch (err) {
      console.error(err);
      setError("Message could not be sent. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      aria-label={selected ? `Conversation with ${selected}` : "Conversation"}
      style={{
        flex: 1,
        padding: "20px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        {!selected && (
          <p role="status" style={{ color: "#d1d7db" }}>
            Select a conversation to reply.
          </p>
        )}

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

      <form
        aria-label="Reply to conversation"
        onSubmit={sendMessage}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <label className="visually-hidden" htmlFor="reply-message">
          Message
        </label>
        <input
          id="reply-message"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (error) setError("");
          }}
          placeholder={selected ? "Type a message..." : "Select a conversation first"}
          disabled={!selected || sending}
          aria-describedby={error ? "reply-error" : undefined}
          style={{
            flex: "1 1 240px",
            minWidth: 0,
            padding: "12px",
            borderRadius: "10px",
            border: "none",
          }}
        />

        <button
          type="submit"
          disabled={!canSend}
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            background: "#25d366",
            color: "#071b0e",
            cursor: canSend ? "pointer" : "not-allowed",
            opacity: canSend ? 1 : 0.55,
            fontWeight: 700,
          }}
        >
          {sending ? "Sending..." : "Send"}
        </button>

        {error && (
          <p
            id="reply-error"
            role="alert"
            style={{
              flexBasis: "100%",
              color: "#ffb4ab",
            }}
          >
            {error}
          </p>
        )}
      </form>
    </section>
  );
}

export default ChatWindow;
