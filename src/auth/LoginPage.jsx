import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { user, loading, loginWithGoogle, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  if (loading) return <LoadingSpinner />;
  if (user) return null; // will redirect

  return (
    <div className={styles.container}>
      <h1>Sign In</h1>
      <ErrorMessage message={error} />
      <button onClick={loginWithGoogle} className={styles.googleBtn}>
        <img src="/google-icon.svg" alt="" width="20" />
        Sign in with Google
      </button>
    </div>
  );
}