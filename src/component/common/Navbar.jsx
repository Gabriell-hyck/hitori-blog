import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>
        <span className={styles.logo}>◈</span>
        <span className={styles.name}>HitoriBlog</span>
      </Link>
      <div className={styles.links}>
        {user ? (
          <>
            <Link to="/new" className={styles.button}>New Post</Link>
            <Link to={`/profile/${user.uid}`} className={styles.profileLink}>
              <img src={user.photoURL} alt={user.displayName} className={styles.avatar} />
              <span>{user.displayName}</span>
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <Link to="/login" className={styles.button}>Login</Link>
        )}
      </div>
    </nav>
  );
}