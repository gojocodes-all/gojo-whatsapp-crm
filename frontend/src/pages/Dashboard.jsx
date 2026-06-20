import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
  const fetchMessages = () => {
    api.get("/messages")
      .then((res) => {
        setMessages(res.data);

        if (!selected && res.data.length > 0) {
          setSelected(res.data[0].from);
        }
      })
      .catch(console.error);
  };

  fetchMessages();

  const interval = setInterval(fetchMessages, 3000);

  return () => clearInterval(interval);
}, [selected]);

  const chats = [];
  const seen = new Set();

  messages.forEach((msg) => {
    if (!seen.has(msg.from)) {
      seen.add(msg.from);
      chats.push(msg);
    }
  });

  const currentMessages = messages.filter(
    (msg) => msg.from === selected
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
background: "#111b21"
      }}
    >
      <Sidebar
        chats={chats}
        selected={selected}
        setSelected={setSelected}
      />

      <ChatWindow messages={currentMessages} />
    </div>
  );
}

export default Dashboard;
