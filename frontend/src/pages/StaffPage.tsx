import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { bookApi, loanApi, setAuthToken } from '../services/api';
import type { Book, Loan } from '../types';

export default function StaffPage() {
  const { keycloak } = useKeycloak();
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '' });

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
    if (!newBook.title || !newBook.author) return;
    bookApi.create(newBook).then(() => {
      setNewBook({ title: '', author: '', isbn: '' });
      loadData();
    });
  }

  function handleReturn(loanId: number) {
    loanApi.returnBook(loanId).then(loadData);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mitarbeiter-Bereich</h1>

      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-bold mb-2">Neues Buch erfassen</h2>
        <div className="flex gap-2">
          <input
            className="border p-2"
            placeholder="Titel"
            value={newBook.title}
            onChange={e => setNewBook({ ...newBook, title: e.target.value })}
          />
          <input
            className="border p-2"
            placeholder="Autor"
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
                      className="bg-green-500 text-white px-2 py-1 rounded"
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
                <td className="border p-2">{book.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}