import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const DietitianAccess: React.FC = () => {
  const [accessData, setAccessData] = useState<any>(null); // Data of users and their access
  const [selectedUser, setSelectedUser] = useState<string>(''); // Selected user email
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Selected categories
  const [activityLog, setActivityLog] = useState<any[]>([]); // Activity log data

  // Function to fetch access data
  const fetchAccessData = async (token: string) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/get-access',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        }
      );
      setAccessData(response.data);
    } catch (error) {
      console.error('Error fetching access data', error);
      alert('Failed to retrieve access data');
    }
  };

  // Function to fetch activity log based on selected user and categories
  const fetchActivityLog = async (userEmail: string, categories: string[]) => {
    try {
      const response = await axios.get('http://localhost:3000/ActivityLog', {
        params: { user: userEmail, categories: categories },
      });
      setActivityLog(response.data); // Set the activity log data
    } catch (error) {
      console.error('Error fetching activity log', error);
      alert('Failed to retrieve activity log');
    }
  };

  useEffect(() => {
    // Try to retrieve the token from the browser's cookies
    const token = Cookies.get('jwt_token');

    if (token) {
      // If the token exists, use it to fetch access data
      fetchAccessData(token);
    } else {
      alert('No token found. Please log in.');
    }
  }, []); // Run once when the component mounts

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedCategories(prevCategories =>
      prevCategories.includes(value)
        ? prevCategories.filter(category => category !== value)
        : [...prevCategories, value]
    );
  };

  const handleFetchActivityLog = () => {
    if (selectedUser && selectedCategories.length > 0) {
      fetchActivityLog(selectedUser, selectedCategories);
    } else {
      alert('Please select both a user and at least one category');
    }
  };

  return (
    <div>
      <h2>Dietitian Access</h2>

      {accessData ? (
        <div>
          <h3>Users and Categories You Have Access To:</h3>
          <ul>
            {accessData.users.map((user: any) => (
              <li key={user.email}>
                <strong>{user.email}</strong>:
                <ul>
                  {user.categories.map((category: string) => (
                    <li key={category}>{category}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {/* Dropdown to select user */}
          <div>
            <label>Select User:</label>
            <select onChange={handleUserChange} value={selectedUser}>
              <option value="">Select a user</option>
              {accessData.users.map((user: any) => (
                <option key={user.email} value={user.email}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown to select categories */}
          <div>
            <label>Select Categories:</label>
            {accessData.users
              .find((user: any) => user.email === selectedUser)
              ?.categories.map((category: string) => (
                <div key={category}>
                  <input
                    type="checkbox"
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={handleCategoryChange}
                  />
                  <label>{category}</label>
                </div>
              ))}
          </div>

          <button onClick={handleFetchActivityLog}>Fetch Activity Log</button>

          {/* Display Activity Log */}
          {activityLog.length > 0 && (
            <div>
              <h3>Activity Log:</h3>
              <ul>
                {activityLog.map((activity: any, index: number) => (
                  <li key={index}>
                    <strong>{activity.timestamp}</strong>: {activity.details}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>Loading your access data...</p>
      )}
    </div>
  );
};

export default DietitianAccess;
