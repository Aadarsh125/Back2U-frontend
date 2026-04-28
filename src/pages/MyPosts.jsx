import { useEffect, useState } from "react";
import { api } from "../config";
import axios from "axios";
import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import noimg from "../assets/no-image.png";

export default function MyPosts() {
  const [myItems, setMyItems] = useState([]);
  const [chatItem, setChatItem] = useState(null);
  const [images, setImages] = useState({});

  useEffect(() => {
    // Get my post IDs from localStorage
    const myPostIds = JSON.parse(localStorage.getItem("myPostIds") || "[]");
    if (myPostIds.length === 0) return;

    // Fetch all items and filter mine
    axios.get(`${api}/item`).then((res) => {
      const all = res.data.data;
      const mine = all.filter((item) => myPostIds.includes(item._id));
      setMyItems(mine);

      // Load images
      mine.forEach((item) => {
        axios
          .get(`${api}/files/${item.image}`)
          .then(() => setImages((prev) => ({ ...prev, [item._id]: `${api}/files/${item.image}` })))
          .catch(() => setImages((prev) => ({ ...prev, [item._id]: noimg })));
      });
    });
  }, []);

  return (
    <main>
      <Navbar />
      <section style={{ padding: "24px 16px", maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ color: "#fdf004", marginBottom: 20 }}>📋 My Posts</h1>

        {myItems.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", marginTop: 60 }}>
            You haven't posted anything yet.
          </p>
        ) : (
          myItems.map((item) => (
            <div
              key={item._id}
              style={{
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                display: "flex",
                gap: 14,
                alignItems: "center",
              }}
            >
              <img
                src={images[item._id] || noimg}
                alt=""
                style={{ width: 70, height: 70, borderRadius: 8, objectFit: "cover" }}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{ color: "#fff", margin: "0 0 4px", fontSize: 16 }}>{item.title}</h2>
                <p style={{ color: "#aaa", margin: "0 0 10px", fontSize: 13 }}>{item.description}</p>
                <button
                  onClick={() => setChatItem(item)}
                  style={{
                    background: "#fdf004",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 16px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  💬 See Messages
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {chatItem && (
        <ChatBox itemId={chatItem._id} onClose={() => setChatItem(null)} />
      )}
    </main>
  );
}