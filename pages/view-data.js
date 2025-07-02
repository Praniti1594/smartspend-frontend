import React, { useEffect, useState } from 'react';
// import './view-data.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ViewData() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editIdx, setEditIdx] = useState(null);
  const [newExpense, setNewExpense] = useState({ date: '', description: '', amount: '', category: '' });

  const router = useRouter();

  const [userEmail, setUserEmail] = useState(null);

  // ✅ Check authentication on mount
  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user")) : null;

    if (!storedUser || !storedUser.email) {
      toast.error("🚫 Unauthorized! Please login.");
      router.push('/');
    } else {
      setUserEmail(storedUser.email);
    }
  }, []);

  // ✅ Fetch expenses only if userEmail is set
  useEffect(() => {
    if (userEmail) {
      fetchExpenses();
    }
  }, [userEmail]);

  const fetchExpenses = async () => {
    const res = await fetch(`http://localhost:8000/expenses?email=${userEmail}`);
    const data = await res.json();
    setExpenses(data);
    setFilteredExpenses(data);
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = expenses.filter(expense =>
      expense.description.toLowerCase().includes(term) ||
      expense.category.toLowerCase().includes(term)
    );
    setFilteredExpenses(filtered);
  }, [searchTerm, expenses]);

  const handleInputChange = (e, idx) => {
    const { name, value } = e.target;
    const updated = [...filteredExpenses];
    updated[idx][name] = value;
    setFilteredExpenses(updated);
  };

  const saveEdit = async (idx) => {
    const expense = { ...filteredExpenses[idx], email: userEmail };

    const res = await fetch(`http://localhost:8000/expenses/${expense.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });

    if (res.ok) {
      toast.success("✅ Expense updated!");
      setEditIdx(null);
      fetchExpenses();
    } else {
      toast.error("❌ Failed to update expense");
    }
  };

  const deleteExpense = async (id) => {
    const res = await fetch(`http://localhost:8000/expenses/${id}?email=${userEmail}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      toast("🗑️ Expense deleted!", {
        style: {
          background: "#f8d7da",
          color: "#721c24",
          border: "1px solid #f5c6cb"
        }
      });
      fetchExpenses();
    } else {
      toast.error("❌ Failed to delete expense");
    }
  };

  const addExpense = async () => {
    const expenseWithEmail = { ...newExpense, email: userEmail };

    const res = await fetch('http://localhost:8000/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseWithEmail)
    });

    if (res.ok) {
      toast.success("✅ Expense added!");
      setNewExpense({ date: '', description: '', amount: '', category: '' });
      fetchExpenses();
    } else {
      toast.error("❌ Failed to add expense");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("🚪 Logged out!");
    router.push("/");
  };

  return (
    <div className="wrapper">
      <nav className="navbar34">
        <div className="logo">💸 SmartSpend</div>
        <div className="navLinks">
          <Link href="/home" className="link">Home</Link>
          <Link href="/profile" className="link">Profile</Link>
          <Link href="/view-data" className="link">Past Data</Link>
          <Link href="/visualizations" className="link">Insights</Link>
          <button className="link logout-link" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <h1 className="heading">Past Expense Logs</h1>

      <div className="searchBarContainer">
        <input
          type="text"
          className="searchInput"
          placeholder="🔍 Search by description or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h3>Add New Expense</h3>
      <div className="addForm">
        <DatePicker
          selected={newExpense.date ? new Date(newExpense.date) : null}
          onChange={(date) =>
            setNewExpense({ ...newExpense, date: date.toISOString().split('T')[0] })
          }
          dateFormat="yyyy-MM-dd"
          placeholderText="📅 Select date"
          className="customDatePicker"
        />
        <input type="text" placeholder="Description" name="description" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} />
        <input type="number" placeholder="Amount" name="amount" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
        <input type="text" placeholder="Category" name="category" value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} />
        <button onClick={addExpense}>➕ Add</button>
      </div>

      {filteredExpenses.length === 0 ? (
        <p>No matching records found.</p>
      ) : (
        <table className="expensesTable">
          <thead>
            <tr>
              <th>📅 Date</th>
              <th>📝 Description</th>
              <th>💸 Amount</th>
              <th>🏷️ Category</th>
              <th>✏️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense, idx) => (
              <tr key={expense.id}>
                {editIdx === idx ? (
                  <>
                    <td><input type="date" name="date" value={expense.date} onChange={(e) => handleInputChange(e, idx)} /></td>
                    <td><input type="text" name="description" value={expense.description} onChange={(e) => handleInputChange(e, idx)} /></td>
                    <td><input type="number" name="amount" value={expense.amount} onChange={(e) => handleInputChange(e, idx)} /></td>
                    <td><input type="text" name="category" value={expense.category} onChange={(e) => handleInputChange(e, idx)} /></td>
                    <td>
                      <button onClick={() => saveEdit(idx)}>✅ Save</button>
                      <button onClick={() => setEditIdx(null)}>❌ Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>{expense.description}</td>
                    <td>₹{parseFloat(expense.amount).toFixed(2)}</td>
                    <td>{expense.category}</td>
                    <td>
                      <button className="actionButton editButton" onClick={() => setEditIdx(idx)}>✏️ Edit</button>
                      <button className="actionButton deleteButton" onClick={() => deleteExpense(expense.id)}>🗑️ Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
