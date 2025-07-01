import { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const [summary, setSummary] = useState([]);
  const [tips, setTips] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const fetchProfileData = async (email) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/analytics/summary", {
        params: { email }, // 👈 pass user email here
      });
      setSummary(res.data.summary_phrases || []);
      setTips(res.data.gemini_tips || "");
    } catch (error) {
      console.error("Error fetching profile summary:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.email) {
          fetchProfileData(parsedUser.email); // ✅ fetch insights using email
        }
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="profileWrapper">
      <nav className="navbar">
        <div className="logo">💸 SmartSpend</div>
        <div className="navLinks">
          <Link href="/home" className="link">Home</Link>
          <Link href="/profile" className="link">Profile</Link>
          <Link href="/view-data" className="link">Past Data</Link>
          <Link href="/visualizations" className="link">Insights</Link>
          <button className="link logout-link" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="profileContent">
        <div className="profileLeft">
          <div className="profileCard">
            <h1 className="profileHeading">👤 Your Profile</h1>
            {user ? (
              <div className="userInfo">
                <p><strong>Username:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            ) : (
              <p>Loading user info...</p>
            )}
          </div>

          <div className="profileCard">
            <h2 className="profileSubheading">Expense Insights</h2>
            {loading ? (
              <p>Loading insights...</p>
            ) : (
              <ul className="summaryList">
                {summary.map((phrase, index) => (
                  <li key={index}>🌟 {phrase}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="profileRight">
          <img src="/profilepage.gif" alt="Money gif" className="rotatingGif" />
        </div>
      </div>
    </div>
  );
}
