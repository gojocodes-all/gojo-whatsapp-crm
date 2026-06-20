function ChatWindow({ messages }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "20px",
        overflowY: "auto"
      }}
>
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
      opacity: 0.7
    }}
  >
    {new Date(msg.createdAt).toLocaleTimeString()}
  </small>
</div>
      ))}
    </div>
  );
}

export default ChatWindow;
