import { Link } from 'react-router-dom';
import styles from './PostCard.module.css';

export default function PostCard({ post }) {
  const date = post.createdAt?.toDate().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const excerpt = post.content.length > 150 
    ? post.content.substring(0, 150).trim() + '...' 
    : post.content;

  return (
    <Link to={`/post/${post.id}`} className={styles.card}>
      <h2 className={styles.title}>{post.title}</h2>
      <p className={styles.author}>
        by{' '}
        <Link
          to={`/profile/${post.authorId}`}
          className={styles.authorLink}
          onClick={(e) => e.stopPropagation()}
        >
          {post.authorName}
        </Link>
      </p>
      <p className={styles.date}>date {date}</p>
      <p className={styles.excerpt}>{excerpt}</p>
    </Link>
  );
}