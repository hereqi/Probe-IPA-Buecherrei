import axios from 'axios';
import type { Book, Loan } from '../types';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

export function setAuthToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const bookApi = {
  getAll: () => api.get<Book[]>('/books').then(res => res.data),
  getById: (id: number) => api.get<Book>(`/books/${id}`).then(res => res.data),
  create: (book: Partial<Book>) => api.post<Book>('/books', book).then(res => res.data),
  update: (id: number, book: Partial<Book>) => api.put<Book>(`/books/${id}`, book).then(res => res.data),
  delete: (id: number) => api.delete(`/books/${id}`),
};

export const loanApi = {
    getAll: () => api.get<Loan[]>('/loans').then(res => res.data),
    getMyLoans: () => api.get<Loan[]>('/loans/my').then(res => res.data),
    create: (bookId: number, userId: string, userName: string) => {
      const url = `/loans?bookId=${bookId}&userId=${userId}&userName=${userName}`;
      return api.post<Loan>(url).then(res => res.data);
    },
    returnBook: (id: number) => api.put<Loan>(`/loans/${id}/return`).then(res => res.data),
  };