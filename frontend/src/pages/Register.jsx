import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!');
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2 className="title">Create Account</h2>
        {error && <p style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="input" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="input" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="input" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn">Sign Up</button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
