import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { createPost, updatePost, getPostById } from '../../services/postService';
import { validatePost } from '../../utils/validation';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import styles from './PostForm.module.css';

export default function PostForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    const fetchPost = async () => {
      try {
        const post = await getPostById(id);
        if (!post) {
          setError('Post not found');
          return;
        }
        // Only author can edit
        if (post.authorId !== user.uid) {
          setError('You are not authorized to edit this post.');
          return;
        }
        setFormData({ title: post.title, content: post.content });
      } catch (err) {
        setError(err.message);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchPost();
  }, [id, isEdit, user.uid]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error when typing
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const errors = validatePost(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updatePost(id, formData);
      } else {
        await createPost({
          ...formData,
          authorId: user.uid,
          authorName: user.displayName,
          authorEmail: user.email,
        });
      }
      navigate('/', { replace: true, state: { message: isEdit ? 'Post updated!' : 'Post created!' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner />;
  if (error && !isEdit) return <ErrorMessage message={error} />;

  return (
    <div className={styles.formContainer}>
      <h1>{isEdit ? 'Edit Post' : 'New Post'}</h1>
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={100}
            disabled={loading}
          />
          {validationErrors.title && <span className={styles.error}>{validationErrors.title}</span>}
        </div>
        <div className={styles.field}>
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            rows={8}
            value={formData.content}
            onChange={handleChange}
            disabled={loading}
          />
          {validationErrors.content && <span className={styles.error}>{validationErrors.content}</span>}
        </div>
        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}