// pages/visualizations.js
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import './visualisations.css';
import { useRouter } from 'next/router';
import { LineChart, Line } from 'recharts';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import Link from 'next/link';

const COLORS = ['#0d6efd', '#6610f2', '#20c997', '#ffc107', '#dc3545'];

export default function VisualizationsPage() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [weekdayData, setWeekdayData] = useState(null);
  const [predictionData, setPredictionData] = useState([]);
  const [biggestCategory, setBiggestCategory] = useState(null);
  const [weeklyTrendData, setWeeklyTrendData] = useState([]);
  const [spikeData, setSpikeData] = useState(null);
  const [width, height] = useWindowSize();
 const [userEmail, setUserEmail] = useState(null);


  const router = useRouter();
  const { type } = router.query;

  useEffect(() => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserEmail(parsedUser.email);
    } else {
      router.push('/'); // Optional: redirect to landing if no user found
    }
  }
}, []);


  const fetchData = async (type) => {
    if (!userEmail) return;
    setPopupType(type);
    if (type === 'category' && categoryData.length === 0) {
     const [res1, res2] = await Promise.all([
  fetch(`http://localhost:8000/analytics/category-breakdown?email=${userEmail}`),
  fetch(`http://localhost:8000/analytics/biggest-category?email=${userEmail}`)
]);

      const data = await res1.json();
      const biggest = await res2.json();
      setCategoryData(data);
      setBiggestCategory(biggest);
    }
    if (type === 'weekday' && (!weekdayData || weeklyTrendData.length === 0)) {
const [res1, res2] = await Promise.all([
  fetch(`http://localhost:8000/analytics/weekday-vs-weekend?email=${userEmail}`),
  fetch(`http://localhost:8000/analytics/weekly-trend?email=${userEmail}`)
]);

  const data1 = await res1.json();
  const data2 = await res2.json();
  setWeekdayData(data1);
  setWeeklyTrendData(data2);
}

    if (type === 'prediction' && predictionData.length === 0) {
     const res = await fetch(`http://localhost:8000/analytics/predictions?email=${userEmail}`);

      const data = await res.json();
      setPredictionData(data);
    }

    if (type === 'spike' && !spikeData) {
  const res = await fetch(`http://localhost:8000/analytics/spending-spike?email=${userEmail}`);
  const data = await res.json();
  setSpikeData(data);
}

  };

  const closePopup = () => setPopupType(null);

    const handleLogout = () => {
  localStorage.removeItem("user");  // 🔐 Remove user info
  router.push("/");                 // 🔄 Redirect to index.js (landing page)
};


  return (
    <div className="wrapper">
                <nav className="navbar">
        <div className="logo">SmartSpend</div>
        <div className="navLinks">
          <Link href="/home" className="link"> Home</Link>
          <Link href="/profile" className="link">Profile</Link>
          <Link href="/view-data" className="link">Past Data</Link>
          <Link href="/visualizations" className="link">Insights</Link>
                    <button className="link logout-link" onClick={handleLogout}>
   Logout
</button>

        
        </div>
      </nav>
      <div className="mainContent">
       <div className="heading">
  <h1> Insights Dashboard</h1>
  <p> You have been spending like royalty <br />Time to face the financial truth! 🔍</p>
</div>

        <div className="buttonGroup1">
          <button className="button" onClick={() => fetchData('category')}>📊 Category Breakdown</button>
          <button className="button" onClick={() => fetchData('weekday')}>🗓️ Weekday vs Weekend</button>
          <button className="button" onClick={() => fetchData('spike')}>💥 Most Spent Day</button>

          <button className="button" onClick={() => fetchData('prediction')}>🔮 Predictions</button>
        </div>

        {popupType && (
          <div className="popupOverlay1" onClick={closePopup}>
            <div className="popupContent" onClick={(e) => e.stopPropagation()}>
              <span className="closeBtn" onClick={closePopup}></span>

              {popupType === 'category' && (
                <>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
                    <PieChart width={400} height={300}>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>

                    {/* 🏆 Biggest Category Beside the Pie */}
                    {biggestCategory && (
                      <div style={{
                        backgroundColor: '#f5f6fa',
                        borderLeft: '6px solid #0d6efd',
                        padding: '1rem 1.5rem',
                        borderRadius: '10px',
                        maxWidth: '300px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', color: '#343a40' }}>
                          💸 Top Category
                        </h3>
                        <p style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                          🎯 <strong style={{ color: '#dc3545' }}>{biggestCategory.category}</strong>
                        </p>
                        <p style={{ fontSize: '0.95rem', margin: 0, color: '#6c757d' }}>
                          ₹{biggestCategory.amount.toFixed(2)} spent
                        </p>
                        <p style={{ fontSize: '1rem', color: '#6c757d' }}>Keep an eye on this category! 👀</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {popupType === 'weekday' && weekdayData && (
  <>
    
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
      {/* Bar Chart */}
      <div>
        <BarChart width={500} height={300} data={[
          { name: 'Weekday', ...weekdayData.weekday },
          { name: 'Weekend', ...weekdayData.weekend }
        ]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#0d6efd" name="Total Spending" />
          <Bar dataKey="average" fill="#20c997" name="Average Spending" />
        </BarChart>
      </div>

      {/* Line Chart */}
      <div>
        
        <LineChart width={500} height={300} data={weeklyTrendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="spending" stroke="#dc3545" name="Weekly Spending" />
        </LineChart>
      </div>
    </div>
  </>
)}


{popupType === 'spike' && spikeData && (
  <>
    <Confetti width={width} height={height} numberOfPieces={200} recycle={false} gravity={0.2} />

    <div style={{
      maxWidth: '650px',
      margin: '2rem auto',
      background: '#fffaf3',
      borderRadius: '24px',
      padding: '2.5rem 2rem',
      position: 'relative',
      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      border: '4px solid #ffd43b'
    }}>
      {/* Decorative Emoji Bubble */}
      <div style={{
        position: 'absolute',
        top: '-25px',
        left: 'calc(50% - 25px)',
        backgroundColor: '#ffec99',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#fab005',
        border: '3px solid white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 10
      }}>
        💸
      </div>

      <h2 style={{
        textAlign: 'center',
        fontSize: '1.9rem',
        color: '#d9480f',
        fontFamily: 'Segoe UI, sans-serif',
        marginTop: '1rem'
      }}>
        Most Expensive Day of the Month!
      </h2>

      <p style={{
        textAlign: 'center',
        margin: '0.8rem 0 1.8rem',
        fontSize: '1.1rem',
        color: '#495057'
      }}>
        Looks like you treated yourself on <strong>{spikeData.spike_date}</strong>! 🎉
      </p>

      <div style={{
        background: '#fff0d8',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        marginBottom: '1.2rem',
        fontSize: '1.2rem',
        textAlign: 'center',
        fontWeight: '500',
        color: '#e67700'
      }}>
        Total spent: <strong style={{ fontSize: '1.6rem', color: '#d9480f' }}>₹{spikeData.total_amount.toFixed(2)}</strong>
      </div>



      <ul style={{ paddingLeft: '1rem', lineHeight: '1.6' }}>
        {spikeData.items.map((item, idx) => (
          <li key={idx} style={{
            fontSize: '1.05rem',
            color: '#495057',
            marginBottom: '0.4rem'
          }}>
            <span style={{ fontWeight: '600', color: '#1971c2' }}>{item.description}</span> — ₹{item.amount.toFixed(2)}
            <span style={{ fontStyle: 'italic', color: '#868e96' }}> ({item.category})</span>
          </li>
        ))}
      </ul>

      <div style={{
        marginTop: '1.8rem',
        padding: '1rem',
        backgroundColor: '#fff9db',
        borderRadius: '10px',
        fontStyle: 'italic',
        color: '#5c5f66',
        fontSize: '0.95rem',
        textAlign: 'center'
      }}>
        💡 Pro Tip: Track your top spending days to discover where your money truly goes — maybe next month its a vacation day? 🏖️
      </div>
    </div>
  </>
)}

              {popupType === 'prediction' && (
                <>
                  <h2>🔮 Category Predictions</h2>
                  <BarChart width={500} height={300} data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actual" fill="#6610f2" name="Actual" />
                    <Bar dataKey="predicted" fill="#ffc107" name="Predicted" />
                  </BarChart>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
