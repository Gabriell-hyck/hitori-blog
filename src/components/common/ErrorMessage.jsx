export default function ErrorMessage({ message }) {
  if (!message) return null;
  return <div style={{ color: 'red', padding: '1rem', background: '#ffe6e6' }}>{message}</div>;
}