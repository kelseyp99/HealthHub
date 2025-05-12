import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './Routes';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <AppRouter />
    </Router>
  );
};

export default App;
