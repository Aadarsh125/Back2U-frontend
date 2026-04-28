import React, { useState, useEffect } from "react";
import Itemcard from "../components/ItemCard";
import Navbar from "../components/Navbar";
import axios from "axios";
import { api } from "../config";
import HashLoader from "react-spinners/HashLoader";
import AOS from "aos";
import "aos/dist/aos.css";

function Find() {
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    AOS.init({ duration: 750 });
  }, []);

  const override = {
    display: "block",
    borderColor: "#fdf004",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  };

  useEffect(() => {
    axios
      .get(`${api}/item`)
      .then((res) => {
        setItem(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Filter items based on search input
  const filteredItems = item
    .slice()
    .reverse()
    .filter(
      (findItem) =>
        findItem.title.toLowerCase().includes(search.toLowerCase()) ||
        findItem.description.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <main id="findpage">
      <Navbar />
      <section>
        <h1 className="lfh1">Your item is just a short distance away</h1>

        {/* Search Bar */}
        <div style={{ display: "flex", justifyContent: "center", margin: "0 0 24px" }}>
          <input
            type="text"
            placeholder="🔍 Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "90%",
              maxWidth: 500,
              padding: "12px 18px",
              borderRadius: 30,
              border: "2px solid #fdf004",
              background: "#1a1a1a",
              color: "#fff",
              fontSize: 15,
              outline: "none",
            }}
          />
        </div>

        <div className="item-container">
          <HashLoader
            color="#fdf004"
            loading={loading}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />

          {/* No results message */}
          {!loading && filteredItems.length === 0 && (
            <p style={{ color: "#aaa", textAlign: "center", width: "100%", marginTop: 40 }}>
              No items found for "<span style={{ color: "#fdf004" }}>{search}</span>"
            </p>
          )}

          {filteredItems.map((findItem, index) => (
            <Itemcard
              key={index}
              id={findItem._id}
              title={findItem.title}
              description={findItem.description}
              image={findItem.image}
            />
          ))}

          <div className="extraItem"></div>
          <div className="extraItem"></div>
          <div className="extraItem"></div>
        </div>
      </section>
    </main>
  );
}

export default Find;