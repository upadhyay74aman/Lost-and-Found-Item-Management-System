import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Calendar, Phone, Edit2, Trash2, Search as SearchIcon } from 'lucide-react';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({ ItemName: '', Description: '', Type: 'Lost', Location: '', ContactInfo: '' });
  const { user } = useContext(AuthContext);

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  const fetchItems = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/items', config);
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch items');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return fetchItems();
    try {
      const { data } = await axios.get(`http://localhost:5000/api/items/search?name=${searchQuery}`, config);
      setItems(data);
    } catch (err) {
      console.error('Search failed');
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/items/${editId}`, formData, config);
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/api/items', formData, config);
      }
      setFormData({ ItemName: '', Description: '', Type: 'Lost', Location: '', ContactInfo: '' });
      fetchItems();
    } catch (err) {
      alert('Action failed! Please try again.');
    }
  };

  const editItem = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setFormData({ 
      ItemName: item.ItemName, 
      Description: item.Description, 
      Type: item.Type, 
      Location: item.Location, 
      ContactInfo: item.ContactInfo 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:5000/api/items/${id}`, config);
        fetchItems();
      } catch (err) {
        alert("Failed to delete item");
      }
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      
      {/* Top Section: Search Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', gap: '1rem' }}>
          <input 
            type="text" 
            className="input" 
            placeholder="Search items by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <button type="submit" className="btn" style={{ width: 'auto' }}><SearchIcon size={20} /> Search</button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left Side: Form */}
        <div style={{ flex: '1 1 350px' }}>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h2 className="title" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              {isEditing ? 'Update Item' : 'Add New Item'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Item Name</label>
                <input className="input" required value={formData.ItemName} onChange={e => setFormData({...formData, ItemName: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select className="input" value={formData.Type} onChange={e => setFormData({...formData, Type: e.target.value})} style={{ appearance: 'none' }}>
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="textarea" rows="2" value={formData.Description} onChange={e => setFormData({...formData, Description: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input className="input" required value={formData.Location} onChange={e => setFormData({...formData, Location: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Contact Info</label>
                <input className="input" required value={formData.ContactInfo} onChange={e => setFormData({...formData, ContactInfo: e.target.value})} />
              </div>
              <button type="submit" className="btn" style={{ marginTop: '1rem', width: '100%' }}>
                {isEditing ? 'Save Changes' : 'Submit Item'}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-outline" style={{ marginTop: '0.5rem', width: '100%' }} onClick={() => { setIsEditing(false); setFormData({ ItemName: '', Description: '', Type: 'Lost', Location: '', ContactInfo: '' }); }}>
                  Cancel
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Side: Items List */}
        <div style={{ flex: '2 1 500px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {items.map(item => (
              <div key={item._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'white' }}>{item.ItemName}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => editItem(item)} className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', border: 'none' }} title="Edit">
                      <Edit2 size={18} color="var(--accent-color)" />
                    </button>
                    <button onClick={() => deleteItem(item._id)} className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', border: 'none' }} title="Delete">
                      <Trash2 size={18} color="var(--danger)" />
                    </button>
                  </div>
                </div>
                
                <span className={`status-badge ${item.Type === 'Lost' ? 'status-lost' : 'status-found'}`} style={{ width: 'fit-content', marginBottom: '1rem' }}>
                  {item.Type}
                </span>
                
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6, flexGrow: 1 }}>
                  {item.Description || 'No description provided.'}
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} color="var(--accent-color)" /> {item.Location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} color="var(--accent-color)" /> {new Date(item.Date).toLocaleDateString()}
                  </span>
                </div>
                
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                  <Phone size={16} color="var(--success)" />
                  <strong>Contact:</strong> {item.ContactInfo}
                </div>
              </div>
            ))}
          </div>
          
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
              <h3>No items found.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
