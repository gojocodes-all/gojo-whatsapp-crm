function Sidebar({ chats, selected, setSelected }) {
  return (
    <div
      style={{
        width: "30%",
        borderRight: "1px solid #ddd",
        overflowY: "auto"
      }}
    >
      {chats.map((chat) => (
        <div
          key={chat.from}
          onClick={() => setSelected(chat.from)}
          style={{
            padding: "15px",
            cursor: "pointer",
            background:
selected === chat.from ? "#202c33" : "#111b21",
color: "white",
            borderBottom: "1px solid #eee"
          }}
        >
          <strong>{chat.name}</strong>
          <br />
          <small>{chat.message}</small>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
