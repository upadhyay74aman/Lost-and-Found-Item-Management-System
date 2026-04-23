import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <Search color="#3b82f6" />
          Lost & Found
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <span style={{ color: 'var(--text-secondary)' }}>Welcome, {user.Name}</span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Login</Link>
              <Link to="/register" className="btn" style={{ padding: '0.4rem 1rem' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
