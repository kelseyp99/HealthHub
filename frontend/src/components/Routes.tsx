import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DietitianList from './components/DietitianList';
import DietitianProfile from './components/DietitianProfile';
import Discussions from './components/Discussions';
import NotFound from './components/NotFound';
import UserServices from './components/UserServices';
import Test from './components/Test';

const AppRouter: React.FC = () => (
  <Routes>
    <Route path="/" element={<DietitianList />} />
    <Route path="/profile/:id" element={<DietitianProfile />} />
    <Route path="/discussions" element={<Discussions />} />
    <Route path="/services" element={<UserServices />} />
    <Route path="/test" element={<Test />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;
