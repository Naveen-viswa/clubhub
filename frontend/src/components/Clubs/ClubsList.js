import React, { useState, useEffect } from 'react';
import { clubsAPI } from '../../services/api';
import { useUser } from '../../context/UserContext';

const ClubsList = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAdmin } = useUser();

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await clubsAPI.getAll();
      setClubs(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load clubs');
      console.error('Fetch clubs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async (clubId) => {
    try {
      await clubsAPI.join(clubId);
      alert('Successfully joined club!');
      fetchClubs(); // Refresh list
    } catch (err) {
      alert('Failed to join club: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteClub = async (clubId) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;
    
    try {
      await clubsAPI.delete(clubId);
      alert('Club deleted successfully!');
      fetchClubs(); // Refresh list
    } catch (err) {
      alert('Failed to delete club: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading clubs...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        {error}
        <button onClick={fetchClubs} style={{ marginLeft: '10px' }}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>🎯 Clubs</h2>
        {clubs.length === 0 && <p style={{ color: '#666' }}>No clubs yet. {isAdmin() && 'Create the first one!'}</p>}
      </div>

      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {clubs.map((club) => (
          <div key={club.clubId} style={{
            padding: '20px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{club.clubName}</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
              {club.description || 'No description'}
            </p>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '15px' }}>
              <div>📂 Category: {club.category}</div>
              <div>👥 Members: {club.totalMembers || 0}</div>
              <div>📅 Events: {club.upcomingEvents || 0}</div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {user && !club.members?.includes(user.userId) && (
                <button
                  onClick={() => handleJoinClub(club.clubId)}
                  style={{
                    padding: '8px 16px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Join Club
                </button>
              )}
              
              {club.members?.includes(user?.userId) && (
                <span style={{
                  padding: '8px 16px',
                  background: '#e8f5e9',
                  color: '#28a745',
                  border: '1px solid #28a745',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}>
                  ✓ Joined
                </span>
              )}
              
              {isAdmin() && (
                <button
                  onClick={() => handleDeleteClub(club.clubId)}
                  style={{
                    padding: '8px 16px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClubsList;
