import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { bookApi, loanApi, setAuthToken } from '../services/api';
import type { Book, Loan } from '../types';

export default function StaffPage() {
  const { keycloak } = useKeycloak();
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '' });
  const [newLoan, setNewLoan] = useState({ bookId: '', userName: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (keycloak.token) {
      setAuthToken(keycloak.token);
      loadData();
    }
  }, [keycloak.token]);

  function loadData() {
    bookApi.getAll().then(setBooks);
    loanApi.getAll().then(setLoans);
  }

  function handleCreateBook() {
    setError('');
    if (!newBook.title || !newBook.author) {
      setError('Titel und Autor sind Pflichtfelder');
      return;
    }
    bookApi.create(newBook).then(() => {
      setNewBook({ title: '', author: '', isbn: '' });
      loadData();
    });
  }

  function handleCreateLoan() {
    setError('');
    if (!newLoan.bookId || !newLoan.userName) {
      setError('Buch und Kundenname sind Pflichtfelder');
      return;
    }
    loanApi.create(Number(newLoan.bookId), newLoan.userName, newLoan.userName)      .then(() => {
        setNewLoan({ bookId: '', userName: '' });
        loadData();
      })
      .catch(() => setError('Ausleihe fehlgeschlagen'));
  }

  function handleReturn(loanId: number) {
    loanApi.returnBook(loanId).then(loadData);
  }

  const availableBooks = books.filter(b => b.status === 'AVAILABLE');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mitarbeiter-Bereich</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
      )}

      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-bold mb-2">Neues Buch erfassen</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            className="border p-2"
            placeholder="Titel *"
            value={newBook.title}
            onChange={e => setNewBook({ ...newBook, title: e.target.value })}
          />
          <input
            className="border p-2"
            placeholder="Autor *"
            value={newBook.author}
            onChange={e => setNewBook({ ...newBook, author: e.target.value })}
          />
          <input
            className="border p-2"
            placeholder="ISBN"
            value={newBook.isbn}
            onChange={e => setNewBook({ ...newBook, isbn: e.target.value })}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleCreateBook}
          >
            Hinzufügen
          </button>
        </div>
      </div>

      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-bold mb-2">Buch ausleihen</h2>
        <div className="flex gap-2 flex-wrap">
          <select
            className="border p-2"
            value={newLoan.bookId}
            onChange={e => setNewLoan({ ...newLoan, bookId: e.target.value })}
          >
            <option value="">-- Buch wählen --</option>
            {availableBooks.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.author})
              </option>
            ))}
          </select>
          <input
            className="border p-2"
            placeholder="Kundenname *"
            value={newLoan.userName}
            onChange={e => setNewLoan({ ...newLoan, userName: e.target.value })}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleCreateLoan}
          >
            Ausleihen
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Aktive Ausleihen</h2>
        {loans.filter(l => l.status === 'ACTIVE').length === 0 ? (
          <p>Keine aktiven Ausleihen.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Buch</th>
                <th className="border p-2 text-left">Ausgeliehen an</th>
                <th className="border p-2 text-left">Fällig am</th>
                <th className="border p-2 text-left">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {loans.filter(l => l.status === 'ACTIVE').map(loan => (
                <tr key={loan.id}>
                  <td className="border p-2">{loan.book.title}</td>
                  <td className="border p-2">{loan.userName}</td>
                  <td className="border p-2">{loan.dueDate}</td>
                  <td className="border p-2">
                    <button
                      className="bg-orange-500 text-white px-2 py-1 rounded"
                      onClick={() => handleReturn(loan.id)}
                    >
                      Zurückgeben
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Alle Bücher ({books.length})</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Titel</th>
              <th className="border p-2 text-left">Autor</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td className="border p-2">{book.title}</td>
                <td className="border p-2">{book.author}</td>
                <td className="border p-2">
                  <span className={book.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-600'}>
                    {book.status === 'AVAILABLE' ? 'Verfügbar' : 'Ausgeliehen'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}