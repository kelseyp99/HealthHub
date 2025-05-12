const AppRouter: React.FC = () => (
    <div className="container">
      <Routes>
        <Route path="/" element={<DietitianList />} />
        <Route path="/profile/:id" element={<DietitianProfile />} />
        <Route path="/discussions" element={<Discussions />} />
        <Route path="/services" element={<UserServices />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
  