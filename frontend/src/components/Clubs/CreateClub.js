import React, { useState } from 'react';
import { clubsAPI } from '../../services/api';

const CreateClub = ({ onClubCreated }) => {
  const [formData, setFormData] = useState({
    clubName: '',
    description: '',
    category: 'General'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.clubName.trim()) {
      alert('Club name is required');
      return;
    }

    try {
      setLoading(true);
      await clubsAPI.create(formData);
      alert('Club created successfully!');
      setFormData({ clubName: '', description: '', category: 'General' });
      if (onClubCreated) onClubCreated();
    } catch (err) {
      alert('Failed to create club: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3>➕ Create New Club</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Club Name *
          </label>
          <input
            type="text"
            name="clubName"
            value={formData.clubName}
            onChange={handleChange}
            placeholder="e.g., Coding Club"
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the club"
            rows="3"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            <option value="General">General</option>
            <option value="Technical">Technical</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Arts">Arts</option>
            <option value="Academic">Academic</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Creating...' : 'Create Club'}
        </button>
      </form>
    </div>
  );
};

export default CreateClub;
