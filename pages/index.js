import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const [editingBook, setEditingBook] = useState(null); // Track the book being edited
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [searchQuery, setSearchQuery] = useState(''); // Track search query

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/books');
      setBooks(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to fetch books. Please check the backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author) {
      setError('Title and author are required.');
      return;
    }

    setIsLoading(true);
    try {
      if (editingBook) {
        // Update the book
        await axios.put(`http://localhost:3000/books/${editingBook._id}`, { title, author });
        setEditingBook(null); // Reset editing state
      } else {
        // Add a new book
        await axios.post('http://localhost:3000/books', { title, author });
      }
      setTitle('');
      setAuthor('');
      fetchBooks();
    } catch (error) {
      console.error('Error adding/updating book:', error);
      setError('Failed to add/update book. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
  };

  const handleCancelEdit = () => {
    setEditingBook(null); // Reset editing state
    setTitle('');
    setAuthor('');
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3000/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      if (error.response && error.response.status === 404) {
        setError('Book not found.');
      } else {
        setError('Failed to delete book. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filter books based on search query
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Book List</h1>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

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
        <div className={styles.formActions}>
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Processing...' : editingBook ? 'Update Book' : 'Add Book'}
          </button>
          {editingBook && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              ×
            </button>
          )}
        </div>
      </form>

      {isLoading ? (
        <p>Loading books...</p>
      ) : (
        <div className={styles.bookList}>
          {filteredBooks.map((book) => (
            <div key={book._id} className={styles.bookCard}>
              <h2 className={styles.bookTitle}>{book.title}</h2>
              <p className={styles.bookAuthor}>by {book.author}</p>
              <div className={styles.bookActions}>
                <button
                  onClick={() => handleEdit(book)}
                  className={styles.editButton}
                  disabled={isLoading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className={styles.deleteButton}
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}