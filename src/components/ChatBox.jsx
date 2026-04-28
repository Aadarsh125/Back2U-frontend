import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { api } from "../config";

const socket = io(api);

export default function ChatBox({ itemId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState(localStorage.getItem("chat_name") || "");
  const [nameSet, setNameSet] = useState(!!localStorage.getItem("chat_name"));
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.emit("join_room", itemId);
    socket.on("load_messages", (msgs) => setMessages(msgs));
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("load_messages");
      socket.off("receive_message");
    };
  }, [itemId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveName = () => {
    if (!name.trim()) return;
    localStorage.setItem("chat_name", name);
    setNameSet(true);
  };

  const send = () => {
    if (!text.trim()) return;
    socket.emit("send_message", { itemId, sender: name, text });
    setText("");
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, width: 300,
      background: "#1a1a1a", border: "1px solid #fdf004", borderRadius: 12,
      zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      
      {/* Header */}
      <div style={{ background: "#fdf004", padding: "10px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#000" }}>💬 Live Chat</span>
        <button onClick={onClose} style={{ background: "none", border: "none",
          fontWeight: 700, fontSize: 18, cursor: "pointer" }}>✕</button>
      </div>

      {/* Name input screen */}
      {!nameSet ? (
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ color: "#fff", fontSize: 13, margin: 0 }}>Enter your name to start chatting</p>
          <input value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveName()}
            placeholder="Your name..."
            style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #fdf004",
              background: "#2a2a2a", color: "#fff", fontSize: 13 }} />
          <button onClick={saveName}
            style={{ background: "#fdf004", border: "none", borderRadius: 6,
              padding: "8px", fontWeight: 700, cursor: "pointer" }}>Start Chatting</button>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div style={{ height: 250, overflowY: "auto", padding: 10 }}>
            {messages.length === 0 &&
              <p style={{ color: "#666", textAlign: "center", marginTop: 80, fontSize: 13 }}>
                No messages yet. Say hi!
              </p>}
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 8,
                display: "flex", justifyContent: m.sender === name ? "flex-end" : "flex-start" }}>
                <div>
                  {m.sender !== name &&
                    <div style={{ fontSize: 10, color: "#fdf004", marginBottom: 2 }}>{m.sender}</div>}
                  <span style={{ background: m.sender === name ? "#fdf004" : "#2a2a2a",
                    color: m.sender === name ? "#000" : "#fff",
                    padding: "5px 10px", borderRadius: 8, fontSize: 13, display: "inline-block" }}>
                    {m.text}
                  </span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ display: "flex", gap: 6, padding: 8, borderTop: "1px solid #333" }}>
            <input value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message..."
              style={{ flex: 1, border: "1px solid #333", borderRadius: 6,
                padding: "6px 10px", fontSize: 13, background: "#2a2a2a", color: "#fff" }} />
            <button onClick={send}
              style={{ background: "#fdf004", border: "none", borderRadius: 6,
                padding: "6px 12px", fontWeight: 700, cursor: "pointer" }}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}