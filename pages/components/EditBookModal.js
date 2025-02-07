import { useState, useEffect } from 'react';
import styles from '../../styles/Home.module.css';

export default function EditBookModal({ book, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
    }
  }, [book]);

 
  if (!book) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, author });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* Close Button (X) */}
        <button
          type="button"
          onClick={onClose}
          className={styles.closeButton}
        >
          ×
        </button>

        <h2>Edit Book</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.modalActions}>
            <button type="submit" className={styles.button}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}