import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AddItem() {
  const [formData, setFormData] = useState({ ItemName: '', Description: '', Type: 'Lost', Location: '', ContactInfo: '' });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/items', formData, config);
      navigate('/');
    } catch (err) {
      alert('Failed to report item');
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '600px' }}>
      <div className="card">
        <h2 className="title" style={{ marginBottom: '2rem' }}>Report an Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name</label>
            <input className="input" placeholder="e.g., Apple AirPods, Blue Backpack" required value={formData.ItemName} onChange={e => setFormData({...formData, ItemName: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select className="input" value={formData.Type} onChange={e => setFormData({...formData, Type: e.target.value})} style={{ appearance: 'none' }}>
              <option value="Lost">I Lost This Item</option>
              <option value="Found">I Found This Item</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea className="textarea" placeholder="Brand, color, identifiable marks..." rows="3" value={formData.Description} onChange={e => setFormData({...formData, Description: e.target.value})}></textarea>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input className="input" placeholder="Where did you see it last?" required value={formData.Location} onChange={e => setFormData({...formData, Location: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Contact Info</label>
            <input className="input" placeholder="Phone number or email address" required value={formData.ContactInfo} onChange={e => setFormData({...formData, ContactInfo: e.target.value})} />
          </div>
          <button type="submit" className="btn" style={{ marginTop: '1rem', width: '100%' }}>Submit Report</button>
        </form>
      </div>
    </div>
  );
}
