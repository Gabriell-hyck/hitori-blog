import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <span className={styles.brand}>HitoriBlog</span>
        <span className={styles.tagline}>Write your story, share your world ✨</span>
        <p className={styles.copy}>© {new Date().getFullYear()} HitoriBlog. All rights reserved.</p>
      </div>
    </footer>
  );
}