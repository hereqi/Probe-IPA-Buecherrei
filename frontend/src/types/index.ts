export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    status: string;
  }
  
  export interface Loan {
    id: number;
    book: Book;
    userId: string;
    userName: string;
    loanDate: string;
    dueDate: string;
    returnDate?: string;
    status: string;
  }