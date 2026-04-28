import { useState } from "react";
import axios from "axios";
import { api } from "../config";

export default function Form() {
  const [form, setForm] = useState({
    name: "", email: "", phoneno: "", title: "", description: ""
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phoneno", form.phoneno);
      formData.append("title", form.title);
      formData.append("description", form.description);
      if (file) formData.append("file", file);

      const res = await axios.post(`${api}/item`, formData);

      // ✅ Save posted item ID to localStorage so user can see it in My Posts
      const myPostIds = JSON.parse(localStorage.getItem("myPostIds") || "[]");
      myPostIds.push(res.data._id);
      localStorage.setItem("myPostIds", JSON.stringify(myPostIds));

      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="form-container" style={{ textAlign: "center", paddingTop: 60 }}>
        <div style={{ fontSize: 50 }}>✅</div>
        <h2 style={{ color: "#fdf004", marginTop: 16 }}>Post successful!</h2>
        <p style={{ color: "#aaa" }}>Your item has been posted.</p>
        <button
          onClick={() => window.location.href = "/myposts"}
          style={{ background: "#fdf004", border: "none", borderRadius: 8,
            padding: "10px 24px", fontWeight: 700, cursor: "pointer", marginTop: 16, marginRight: 10 }}>
          See My Posts
        </button>
        <button
          onClick={() => { setSuccess(false); setForm({ name: "", email: "", phoneno: "", title: "", description: "" }); setFile(null); }}
          style={{ background: "#333", color: "#fff", border: "none", borderRadius: 8,
            padding: "10px 24px", fontWeight: 700, cursor: "pointer", marginTop: 16 }}>
          Post Another
        </button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1>Please fill all the required fields</h1>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Phone</label>
        <input type="tel" name="phoneno" value={form.phoneno} onChange={handleChange} required />

        <label>Title</label>
        <input type="text" name="title" value={form.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required></textarea>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <input type="submit" value={loading ? "Posting..." : "Submit"} disabled={loading} />
      </form>
    </div>
  );
}