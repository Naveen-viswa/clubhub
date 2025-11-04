import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import { UserProvider, useUser } from './context/UserContext';
import ClubsList from './components/Clubs/ClubsList';
import CreateClub from './components/Clubs/CreateClub';

Amplify.configure(awsExports);

function Dashboard() {
  const { user, logout, isAdmin, isEventCoordinator } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshClubs, setRefreshClubs] = useState(0);

  // ADD THESE DEBUG LOGS
  console.log('=== Dashboard Debug ===');
  console.log('User object:', user);
  console.log('User groups:', user?.groups);
  console.log('isAdmin():', isAdmin());
  console.log('isEventCoordinator():', isEventCoordinator());
  console.log('=====================');

  const handleClubCreated = () => {
    setRefreshClubs(prev => prev + 1);
    setActiveTab('clubs');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        background: '#007bff',
        color: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 5px 0' }}>🎓 ClubHub</h1>
            <p style={{ margin: 0, opacity: 0.9 }}>Welcome, {user?.email}</p>
          </div>
          <button
            onClick={logout}
            style={{
              padding: '10px 20px',
              background: 'white',
              color: '#007bff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid #ddd',
        padding: '0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '0' }}>
          {['dashboard', 'clubs', 'events'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '15px 30px',
                background: activeTab === tab ? '#007bff' : 'transparent',
                color: activeTab === tab ? 'white' : '#666',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                borderBottom: activeTab === tab ? '3px solid #007bff' : '3px solid transparent',
                transition: 'all 0.3s'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h2>Dashboard</h2>
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div style={{ padding: '20px', background: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h3>👤 Your Profile</h3>
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Roles:</strong> {user?.groups?.join(', ') || 'Member'}</p>
              </div>
              <div style={{ padding: '20px', background: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h3>🎯 Quick Stats</h3>
                <p>Your clubs and events will appear here</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clubs' && (
          <div>
            {isAdmin() && <CreateClub onClubCreated={handleClubCreated} />}
            <ClubsList key={refreshClubs} />
          </div>
        )}

        {activeTab === 'events' && (
          <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
            <h2>📅 Events</h2>
            <p>Events page coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <Authenticator>
      {() => (
        <UserProvider>
          <Dashboard />
        </UserProvider>
      )}
    </Authenticator>
  );
}

export default App;
