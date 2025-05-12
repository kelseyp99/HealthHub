import React from 'react';
import { useParams } from 'react-router-dom';
import './DietitianProfile.scss';

const DietitianProfile: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="dietitian-profile">
      <h2>Dietitian Profile</h2>
      <p>Viewing profile for dietitian ID: {id}</p>
    </div>
  );
};

export default DietitianProfile;
