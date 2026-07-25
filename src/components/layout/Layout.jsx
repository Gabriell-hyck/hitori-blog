import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import styles from './Layout.module.css'; // (optional, just a wrapper)

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}