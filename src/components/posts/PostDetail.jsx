import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, deletePost } from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import styles from './PostDetail.module.css';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        if (!data) {
          setError('Post not found');
        } else {
          setPost(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeleting(true);
    try {
      await deletePost(id);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return <ErrorMessage message="Post not found" />;

  const isAuthor = user && user.uid === post.authorId;
  const createdAt = post.createdAt?.toDate().toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const updatedAt = post.updatedAt?.toDate().toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const isUpdated = post.updatedAt && post.createdAt && 
    post.updatedAt.toDate().getTime() !== post.createdAt.toDate().getTime();

  return (
    <article className={styles.article}>
      <Link to="/" className={styles.backLink}>← Back to all posts</Link>

      <h1 className={styles.title}>{post.title}</h1>

      <div className={styles.meta}>
        <div className={styles.authorInfo}>
          <Link to={`/profile/${post.authorId}`} className={styles.authorLink}>
            👤 {post.authorName}
          </Link>
          <span className={styles.email}>({post.authorEmail})</span>
        </div>
        <div className={styles.dates}>
          <span> Published: {createdAt}</span>
          {isUpdated && <span> Updated: {updatedAt}</span>}
        </div>
      </div>

      <div className={styles.content}>{post.content}</div>

      {isAuthor && (
        <div className={styles.actions}>
          <Link to={`/edit/${post.id}`} className={styles.editBtn}>
             Edit
          </Link>
          <button onClick={handleDelete} disabled={deleting} className={styles.deleteBtn}>
            {deleting ? ' Deleting...' : ' Delete'}
          </button>
        </div>
      )}
    </article>
  );
}