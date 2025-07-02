import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import './auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          })
        );

        alert('✅ Login successful!');
        router.push('/home');
      } else {
        alert('❌ ' + (data.detail || 'Login failed'));
      }
    } catch (error) {
      alert('❌ Server error. Please try again later.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="authWrapper">
      <div className="authCard">
        <div className="authImage">
          <img src="/illustrations.webp" alt="Finance Illustration" />
        </div>

        <form onSubmit={handleSubmit} className="authForm">
          <h2>Welcome to SmartSpend</h2>



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
          <button type="submit">Login</button>
                    {/* ✅ Back button */}
          <button
            type="button"
            className="backButton"
            onClick={() => router.push('/')}
          >
            Back 
          </button>

          <p className="authRedirect">
            Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
