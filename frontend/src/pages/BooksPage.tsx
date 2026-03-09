import { useEffect, useState } from 'react';
import { bookApi } from '../services/api';
import type { Book } from '../types';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookApi.getAll()
      .then(setBooks)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Laden...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bücher</h1>
      {books.length === 0 ? (
        <p>Keine Bücher vorhanden.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Titel</th>
              <th className="border p-2 text-left">Autor</th>
              <th className="border p-2 text-left">ISBN</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td className="border p-2">{book.title}</td>
                <td className="border p-2">{book.author}</td>
                <td className="border p-2">{book.isbn}</td>
                <td className="border p-2">
  {book.status === 'AVAILABLE' ? 'Verfügbar' : 'Ausgeliehen'}
</td>              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}