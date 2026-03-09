import { useEffect, useState } from 'react';
import { bookApi } from '../services/api';
import type { Book } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

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
    <Card>
      <CardHeader>
        <CardTitle>Bücher</CardTitle>
      </CardHeader>
      <CardContent>
        {books.length === 0 ? (
          <p>Keine Bücher vorhanden.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map(book => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>
                    {book.status === 'AVAILABLE' ? 'Verfügbar' : 'Ausgeliehen'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}