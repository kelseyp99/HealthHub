import React, { useState, useEffect } from 'react';

const DiscussionsComponent = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch('/discussions');
        const data = await response.json();
        setDiscussions(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchDiscussions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Discussions</h1>
      <ul>
        {discussions.map((discussion) => (
          <li key={discussion.id}>{discussion.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default DiscussionsComponent;