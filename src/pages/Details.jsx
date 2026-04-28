import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";
import { useParams } from "react-router-dom";
import { api } from "../config";
import HashLoader from "react-spinners/HashLoader";
import noimg from "../assets/no-image.png";
import ChatBox from "../components/ChatBox";

function Details() {
  const [item, setItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const { id } = useParams();

  const override = {
    display: "block",
    borderColor: "#fdf004",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${api}/item/${id}`)
      .then((res) => {
        setItem(res.data);
        // Cloudinary image is a full URL, use directly
        if (res.data.image && res.data.image.startsWith("http")) {
          setImage(res.data.image);
        } else {
          setImage(noimg);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <main id="detailspage">
      <Navbar />
      <section>
        {loading ? (
          <HashLoader
            color="#fdf004"
            loading={loading}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <div className="details-card">
            <div className="img-container">
              <img src={image} alt="" />
            </div>
            <div className="action-container">
              <a href={`tel:${item.phoneno}`}>
                <CallIcon /> Call
              </a>
              <a href={`mailto:${item.email}`}>
                <EmailIcon /> Email
              </a>
              <button
                onClick={() => setShowChat(true)}
                style={{
                  background: "#fdf004",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                💬 Chat
              </button>
            </div>
            <h1>{item.title}</h1>
            <div className="details-container">
              <p>Founder</p>
              <p>{item.name}</p>
            </div>
            <div className="details-container desc">
              <p>{item.description}</p>
            </div>
          </div>
        )}
        {showChat && (
          <ChatBox itemId={id} onClose={() => setShowChat(false)} />
        )}
      </section>
    </main>
  );
}

export default Details;