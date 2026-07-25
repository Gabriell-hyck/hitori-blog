export function validatePost({ title, content }) {
  const errors = {};
  if (!title.trim()) {
    errors.title = 'Title is required.';
  } else if (title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (title.trim().length > 100) {
    errors.title = 'Title cannot exceed 100 characters.';
  }

  if (!content.trim()) {
    errors.content = 'Content is required.';
  } else if (content.trim().length < 10) {
    errors.content = 'Content must be at least 10 characters.';
  }

  return errors;
}