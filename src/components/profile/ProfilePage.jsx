import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile, updateUserProfile, getUserPosts } from '../../services/userService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import PostCard from '../posts/PostCard';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { uid } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  const isOwner = currentUser?.uid === uid;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getUserProfile(uid);
        const userPosts = await getUserPosts(uid);
        setProfile(userProfile);
        setPosts(userPosts);
        setBio(userProfile?.bio || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [uid]);

  const handleSaveBio = async () => {
    setSaving(true);
    try {
      await updateUserProfile(uid, { bio });
      setProfile({ ...profile, bio });
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!profile) return <ErrorMessage message="User not found" />;

  return (
    <div className={styles.container}>
      {/* Header Profil */}
      <div className={styles.header}>
        <img
          src={profile.photoURL}
          alt={profile.displayName}
          className={styles.avatar}
        />
        <div className={styles.info}>
          <h1>{profile.displayName}</h1>
          <p className={styles.email}>{profile.email}</p>
          <p className={styles.stats}>
            📝 {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </div>

      {/* Bio Section */}
      <div className={styles.bioSection}>
        <h3>About</h3>
        {editing ? (
          <div className={styles.bioEdit}>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={300}
              className={styles.bioInput}
            />
            <div className={styles.bioActions}>
              <button
                onClick={handleSaveBio}
                disabled={saving}
                className={styles.saveBtn}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setBio(profile.bio || '');
                }}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.bioDisplay}>
            <p>{profile.bio || 'No bio yet.'}</p>
            {isOwner && (
              <button onClick={() => setEditing(true)} className={styles.editBtn}>
                ✏️ Edit Bio
              </button>
            )}
          </div>
        )}
      </div>

      {/* Postingan User */}
      <div className={styles.postsSection}>
        <h2>
          {isOwner ? 'Your Posts' : `${profile.displayName}'s Posts`}
        </h2>
        {posts.length === 0 ? (
          <p className={styles.noPosts}>
            {isOwner ? (
              <>
                You haven't written anything yet.{' '}
                <Link to="/new">Write your first post!</Link>
              </>
            ) : (
              'No posts yet.'
            )}
          </p>
        ) : (
          <div className={styles.postGrid}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}