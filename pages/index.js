import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/books');
      setBooks(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to fetch books. Please check the backend server.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/books', { title, author });
      setTitle('');
      setAuthor('');
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      setError('Failed to add book. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Book List</h1>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
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
        <button type="submit" className={styles.button}>
          Add Book
        </button>
      </form>

      <div className={styles.bookList}>
        {books.map((book) => (
          <div key={book._id} className={styles.bookCard}>
            <h2 className={styles.bookTitle}>{book.title}</h2>
            <p className={styles.bookAuthor}>by {book.author}</p>
            <div className={styles.bookActions}>
              <button className={styles.editButton}>Edit</button>
              <button className={styles.deleteButton}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}