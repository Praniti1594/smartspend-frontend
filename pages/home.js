import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
// import './home.css';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState(null);            
  const [userEmail, setUserEmail] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [message, setMessage] = useState('');
  const [typedText, setTypedText] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const [showInfoCard, setShowInfoCard] = useState(false); 
  const [showCSVForm, setShowCSVForm] = useState(false);
const [showReceiptForm, setShowReceiptForm] = useState(false);


  const mascotMessages = [
    "Hey! Don't forget to log your expenses.",
    "Let's upload your receipt.",
    "Saving money is super cool!",
    "Great job checking your data.",
    "You're doing amazing. Keep it up!"
  ];

  // 🔐 Fetch user from localStorage and redirect if missing
 useEffect(() => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("🚫 Unauthorized! Please login.");
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser.email) {
        toast.error("🚫 Unauthorized! Please login.");
        router.push('/login');
      } else {
        setUser(parsedUser);
        setUserEmail(parsedUser.email);
      }
    } catch (err) {
      toast.error("❌ Invalid user data.");
      router.push('/login');
    }
  }
}, []);


  // 📝 Animate welcome text
  useEffect(() => {
    if (!user) return;
    const fullText = `Welcome, ${user.name}`;
    let index = 0;
    const timer = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, [user]);

  // 🎤 Typing mascot messages loop
  useEffect(() => {
    let msgIndex = 0;
    let charIndex = 0;
    let typeInterval;
    let mainInterval;

    const startTyping = () => {
      setTypedMessage('');
      const message = mascotMessages[msgIndex];
      charIndex = 0;

      typeInterval = setInterval(() => {
        setTypedMessage((prev) => {
          const next = prev + message[charIndex];
          charIndex++;
          if (charIndex === message.length) {
            clearInterval(typeInterval);
          }
          return next;
        });
      }, 50);

      msgIndex = (msgIndex + 1) % mascotMessages.length;
    };

    startTyping(); // Initial message
    mainInterval = setInterval(() => startTyping(), 6000);

    return () => {
      clearInterval(mainInterval);
      clearInterval(typeInterval);
    };
  }, []);

  // ⏱️ Info card show delay (if needed in future)
  useEffect(() => {
    const timer = setTimeout(() => setShowInfoCard(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCSVUpload = async (e) => {
  e.preventDefault(); // prevent reload

  if (!csvFile || !userEmail) {
    setMessage('Missing file or email');
    return;
  }

  const formData = new FormData();
  formData.append('file', csvFile);
  formData.append('email', userEmail);

  try {
    const res = await fetch('http://localhost:8000/upload/csv/', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    setMessage(result.message || result.error);

  } catch (err) {
    setMessage("Server error during CSV upload.");
  }
};


const handleReceiptUpload = async (e) => {
  e.preventDefault(); // prevent reload

  if (!receiptFile || !userEmail) {
    setMessage('Missing file or email');
    return;
  }

  const formData = new FormData();
  formData.append('file', receiptFile);
  formData.append('email', userEmail);

  try {
    const res = await fetch('http://localhost:8000/upload/receipt/', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    setMessage(result.message || result.error);

  } catch (err) {
    setMessage("Server error during receipt upload.");
  }
};

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <main className="wrapper12">
      <nav className="navbar12">
        <div className="logo">SmartSpend</div>
        <div className="navLinks">
          <Link href="/home" className="link">Home</Link>
          <Link href="/profile" className="link">Profile</Link>
          <Link href="/view-data" className="link">Past Data</Link>
          <Link href="/visualizations" className="link">Insights</Link>
          <button className="link logout-link" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

<div className="centerContainer">
  <div className="heading12">
    <h1 className="headingText12">{typedText}</h1>
    <p className="subheading12">Your intelligent finance analyzer</p>
  </div>

{/* Upload CSV Section */}
<div className="buttonGroup2">
  {!showCSVForm ? (
    <button onClick={() => setShowCSVForm(true)} className="button12">
      📂 Upload CSV
    </button>
  ) : (
    <form onSubmit={handleCSVUpload} className="uploadForm">
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => setCsvFile(e.target.files[0])}
        className="fileInput"
      />
      <button type="submit" className="button">Submit CSV</button>
    </form>
  )}
</div>

{/* Upload Receipt Section */}
<div className="buttonGroup12">
  {!showReceiptForm ? (
    <button onClick={() => setShowReceiptForm(true)} className="button12">
      🧾 Upload Receipt
    </button>
  ) : (
    <form onSubmit={handleReceiptUpload} className="uploadForm">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setReceiptFile(e.target.files[0])}
        className="fileInput"
      />
      <button type="submit" className="button">Submit Receipt</button>
    </form>
  )}
</div>



</div>

      {message && (
        <div className="popupOverlay" onClick={() => setMessage('')}>
          <div className="popupContent" onClick={(e) => e.stopPropagation()}>
            <div className="closeBtn" onClick={() => setMessage('')} />
            <p>{message}</p>
          </div>
        </div>
      )}

      <div className="mascotFixedContainer">
        <div className="speechBubbleFixed">{typedMessage}</div>
        <img src="/girlspecs.gif" alt="Mascot" className="mascotImageFixed" />
      </div>
    </main>
  );
}
