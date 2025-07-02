import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import './index.css';

export default function HomeLanding() {
  const router = useRouter();
  const taglines = [
    "💡 Master your money, one click at a time!",
    "📊 Turn your expenses into insights.",
    "🚀 Your financial journey starts here.",
    "💸 Smarter spending starts with SmartSpend.",
    "🔐 Secure. Simple. Smart."
  ];

  const [currentTagline, setCurrentTagline] = useState(taglines[0]);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => {
        const currentIndex = taglines.indexOf(prev);
        const nextIndex = (currentIndex + 1) % taglines.length;
        return taglines[nextIndex];
      });
    }, 3000);

    setTimeout(() => setPopupVisible(true), 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homeWrapper">
      <div className="homeNavbar">
        <div className="homeLogo">💸 SmartSpend</div>
      </div>

 <main className="homeMain">
  <div className="mainLeft">
    <h1 className="homeHeading fade-in">Welcome to SmartSpend</h1>
    <p className="homeSubheading fade-in-delay">{currentTagline}</p>

    <div className="authButtons fade-in-delay-2">
      <button className="loginBtn" onClick={() => router.push('/login')}> Login</button>
      <button className="signupBtn" onClick={() => router.push('/signup')}> Sign Up</button>
    </div>

    {popupVisible && (
      <div className="popupMessage slide-up">
        ✨ Let&apos;s make your money work smarter!
      </div>
    )}
  </div>

  <div className="mainRight">
    <img src="/finance-management.png" alt="Finance Illustration" className="landingImg" />
  </div>

  {/* <div className="mainRight">
    <img src="/123.gif" alt="Finance Illustration" className="landingImg" />
  </div> */}
</main>

      
    </div>
  );
}
