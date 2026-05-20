import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import AddEditBook from './pages/AddEditBook';
import BookDetails from './pages/BookDetails';
import Categories from './pages/Categories';
import LendingTracker from './pages/LendingTracker';
import BookSearch from './pages/BookSearch';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="books" element={<Books />} />
        <Route path="books/:id" element={<BookDetails />} />
        <Route path="add-book" element={<AddEditBook />} />
        <Route path="edit-book/:id" element={<AddEditBook />} />
        <Route path="categories" element={<Categories />} />
        <Route path="lending" element={<LendingTracker />} />
        <Route path="search" element={<BookSearch />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
