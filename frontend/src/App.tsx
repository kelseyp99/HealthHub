import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { fetchFromBackend } from './api';


function App() {
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string>("test-user");
  useEffect(() => {
    if (!userId) return;
    fetchFromBackend(`/api/firestoretest/user/${userId}/discussions`)
      .then((data) => setDiscussions(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message));
  }, [userId]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div style={{ marginTop: 20 }}>
          <label>
            User ID:
            <input
              type="text"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              style={{ marginLeft: 8, padding: 4 }}
            />
          </label>
          <strong style={{ display: 'block', marginTop: 16 }}>Discussions:</strong>
          {error && <div style={{ color: 'salmon' }}>{error}</div>}
          <table style={{ margin: '0 auto', color: 'white', background: '#222', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #444', padding: '8px' }}>ID</th>
                <th style={{ border: '1px solid #444', padding: '8px' }}>Title</th>
                <th style={{ border: '1px solid #444', padding: '8px' }}>Content</th>
              </tr>
            </thead>
            <tbody>
              {discussions.map((d: any) => (
                <tr key={d.id}>
                  <td style={{ border: '1px solid #444', padding: '8px' }}>{d.id}</td>
                  <td style={{ border: '1px solid #444', padding: '8px' }}>{d.title}</td>
                  <td style={{ border: '1px solid #444', padding: '8px' }}>{d.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {discussions.length === 0 && !error && <div>No discussions found.</div>}
        </div>
      </header>
    </div>
  );
}

export default App;
