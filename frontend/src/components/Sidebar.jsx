function Sidebar({ chats, selected, setSelected }) {
  return (
    <nav
      aria-label="Conversations"
      style={{
        width: "30%",
        borderRight: "1px solid #ddd",
        overflowY: "auto",
      }}
    >
      {chats.length === 0 && (
        <p
          role="status"
          style={{
            padding: "15px",
            color: "#d1d7db",
          }}
        >
          No conversations yet.
        </p>
      )}

      {chats.map((chat) => (
        <button
          type="button"
          className="conversation-button"
          aria-pressed={selected === chat.from}
          key={chat.from}
          onClick={() => setSelected(chat.from)}
          style={{
            width: "100%",
            padding: "15px",
            cursor: "pointer",
            background: selected === chat.from ? "#202c33" : "#111b21",
            color: "white",
            border: "none",
            borderBottom: "1px solid #eee",
            textAlign: "left",
            font: "inherit",
          }}
        >
          <strong>{chat.name || chat.from}</strong>
          <span
            style={{
              display: "block",
              marginTop: "4px",
              fontSize: "0.875rem",
            }}
          >
            {chat.message}
          </span>
        </button>
      ))}
    </nav>
  );
}

export default Sidebar;
