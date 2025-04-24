import bookService from '@/src/services/book-service';
import { Book, BookCreateRequest, BookUpdateRequest } from '@/src/interfaces/book';
import { useAuth } from '@/src/context/auth-context';
import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {withAsync} from "@/src/helpers";


interface BookContextType {
  books: Book[];
  borrowedBooks: Book[];
  isLoading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  fetchBorrowedBooks: () => Promise<void>;
  getBookById: (id: number) => Promise<Book | undefined>;
  createBook: (book: BookCreateRequest) => Promise<Book | undefined>;
  updateBook: (book: BookUpdateRequest) => Promise<Book | undefined>;
  deleteBook: (id: number) => Promise<boolean>;
  borrowBook: (id: number) => Promise<Book | undefined>;
  returnBook: (id: number) => Promise<Book | undefined>;
}

export const BookContext = createContext<BookContextType>({} as BookContextType);

interface BookProviderProps {
  children: React.ReactNode;
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { userToken } = useAuth();

  const fetchBooks = useCallback(async () => {
    if (!userToken) return;
    const data = await withAsync(() => bookService.getAllBooks(), setIsLoading, setError);
    if (data) setBooks(data);
  }, [userToken]);

  const fetchBorrowedBooks = useCallback(async () => {
    if (!userToken) return;
    const data = await withAsync(() => bookService.getBorrowedBooks(), setIsLoading, setError);
    if (data) setBorrowedBooks(data);
  }, [userToken]);

  const getBookById = async (id: number): Promise<Book | undefined> => {
    return withAsync(() => bookService.getBookById(id), setIsLoading, setError);
  };

  const createBook = async (book: BookCreateRequest): Promise<Book | undefined> => {
    const newBook = await withAsync(() => bookService.createBook(book), setIsLoading, setError);
    if (newBook) setBooks(prev => [...prev, newBook]);
    return newBook;
  };

  const updateBook = async (book: BookUpdateRequest): Promise<Book | undefined> => {
    const updatedBook = await withAsync(() => bookService.updateBook(book), setIsLoading, setError);
    if (updatedBook) {
      setBooks(prev => prev.map(b => (b.id === updatedBook.id ? updatedBook : b)));
      setBorrowedBooks(prev => prev.map(b => (b.id === updatedBook.id ? updatedBook : b)));
    }
    return updatedBook;
  };

  const deleteBook = async (id: number): Promise<boolean> => {
    const success = await withAsync(() => bookService.deleteBook(id), setIsLoading, setError);
    if (success) {
      setBooks(prev => prev.filter(b => b.id !== id));
      setBorrowedBooks(prev => prev.filter(b => b.id !== id));
    }
    return !!success;
  };

  const borrowBook = async (id: number): Promise<Book | undefined> => {
    const updatedBook = await withAsync(() => bookService.borrowBook(id), setIsLoading, setError);
    if (updatedBook) {
      const bookWithAvailability = { ...updatedBook, available: false };
      setBooks(prev => prev.filter(b => b.id !== id));
      setBorrowedBooks(prev => {
        const bookExists = prev.some(b => b.id === id);
        return bookExists
            ? prev.map(b => (b.id === id ? bookWithAvailability : b))
            : [...prev, bookWithAvailability];
      });
      return bookWithAvailability;
    }
    return undefined;
  };

  const returnBook = async (id: number): Promise<Book | undefined> => {
    const updatedBook = await withAsync(() => bookService.returnBook(id), setIsLoading, setError);
    if (updatedBook) {
      const bookWithAvailability = { ...updatedBook, available: true };
      setBooks(prev => {
        const bookExists = prev.some(b => b.id === id);
        return bookExists
            ? prev.map(b => (b.id === id ? bookWithAvailability : b))
            : [...prev, bookWithAvailability];
      });
      setBorrowedBooks(prev => prev.filter(b => b.id !== id));
      return bookWithAvailability;
    }
    return undefined;
  };

  useEffect(() => {
    if (userToken) {
      fetchBooks();
      fetchBorrowedBooks();
    } else {
      setBooks([]);
      setBorrowedBooks([]);
    }
  }, [userToken, fetchBooks, fetchBorrowedBooks]);

  return (
      <BookContext.Provider
          value={{
            books,
            borrowedBooks,
            isLoading,
            error,
            fetchBooks,
            fetchBorrowedBooks,
            getBookById,
            createBook,
            updateBook,
            deleteBook,
            borrowBook,
            returnBook,
          }}
      >
        {children}
      </BookContext.Provider>
  );
};

export const useBooks = () => useContext(BookContext);