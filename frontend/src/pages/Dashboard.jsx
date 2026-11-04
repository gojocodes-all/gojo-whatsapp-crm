import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { latestMessagePerChat, messagesForChat } from "../utils/messages";

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

  const chats = latestMessagePerChat(messages);
  const currentMessages = messagesForChat(messages, selected);

  return (
    <main className="dashboard-shell">
      <Sidebar
        chats={chats}
        selected={selected}
        setSelected={setSelected}
      />

      <ChatWindow messages={currentMessages} selected={selected} />
    </main>
  );
}

export default Dashboard;
