import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import PostList from './components/posts/PostList';
import PostDetail from './components/posts/PostDetail';
import PostForm from './components/posts/PostForm';
import LoginPage from './components/auth/LoginPage';
import PrivateRoute from './components/auth/PrivateRoute';
import ProfilePage from './components/profile/ProfilePage'; // ← tambahin

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile/:uid" element={<ProfilePage />} /> {/* ← tambahin */}
            <Route path="/new" element={<PrivateRoute><PostForm /></PrivateRoute>} />
            <Route path="/edit/:id" element={<PrivateRoute><PostForm /></PrivateRoute>} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App; 