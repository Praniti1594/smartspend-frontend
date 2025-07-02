import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import './signup.css';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Registration successful!');
        router.push('/login');
      } else {
        alert('❌ ' + (data.detail || 'Registration failed'));
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('❌ Server error. Please try again later.');
    }
  };

  return (
    <div className="signupWrapper">
      <div className="signupCard">
        <div className="signupImage">
          <img src="/finance-education.webp" alt="Sign Up" />
        </div>

        <form onSubmit={handleSubmit} className="signupForm">
          <h2>Create an Account</h2>

          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type="submit">Sign Up</button>
                    {/* ✅ Back button */}
          <button
            type="button"
            className="backButton"
            onClick={() => router.push('/')}
          >
            Back 
          </button>

          <p className="signupRedirect">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
