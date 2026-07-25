import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'posts';

// Create
export async function createPost({ title, content, authorId, authorName, authorEmail }) {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    title,
    content,
    authorId,
    authorName,
    authorEmail,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Get all posts sorted by createdAt desc (real-time)
export function subscribeToPosts(callback) {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(posts);
  });
}

// Get single post
export async function getPostById(id) {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

// Update
export async function updatePost(id, { title, content }) {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    title,
    content,
    updatedAt: serverTimestamp(),
  });
}

// Delete
export async function deletePost(id) {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}