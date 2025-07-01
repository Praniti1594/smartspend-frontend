import React, { useState } from 'react';
import axios from 'axios';

export default function UploadReceipt() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/upload/receipt/", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResponse(res.data);
    } catch (err) {
      setResponse({ error: err.message });
    }
  };

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>🧾 Upload Receipt</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>

      {response && (
        <div>
          {response.error ? (
            <p>❌ {response.error}</p>
          ) : (
            <>
              <p>✅ {response.message}</p>
              <p>🗓️ Date: {response.date}</p>
              <ul>
                {response.items.map((item, idx) => (
                  <li key={idx}>
                    💰 {item.name} — ₹{item.price} — 📂 {item.category}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
