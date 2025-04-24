// @/src/services/book-service.ts
import axios from '../lib/axios';
import { BOOK_URLS } from '@/src/constants';
import { Book, BookCreateRequest, BookUpdateRequest } from '@/src/interfaces/book';
import {isValidBook} from "@/src/helpers";

const bookService = {
    getAllBooks: async (): Promise<Book[]> => {
        const response = await axios.get<Book[]>(BOOK_URLS.GET_ALL);
        console.log('getAllBooks response:', response.data);
        if (!Array.isArray(response.data) || !response.data.every(isValidBook)) {
            throw new Error('Invalid books data received');
        }
        return response.data;
    },

    getBookById: async (id: number): Promise<Book> => {
        const response = await axios.get<Book>(BOOK_URLS.GET_BY_ID(id));
        console.log('getBookById response:', response.data);
        if (!isValidBook(response.data)) {
            throw new Error('Invalid book data received');
        }
        return response.data;
    },

    createBook: async (book: BookCreateRequest): Promise<Book> => {
        const response = await axios.post<Book>(BOOK_URLS.CREATE, book);
        console.log('createBook response:', response.data);
        if (!isValidBook(response.data)) {
            throw new Error('Invalid book data received');
        }
        return response.data;
    },

    updateBook: async (book: BookUpdateRequest): Promise<Book> => {
        const response = await axios.put<Book>(BOOK_URLS.UPDATE(book.id), book);
        console.log('updateBook response:', response.data);
        if (!isValidBook(response.data)) {
            throw new Error('Invalid book data received');
        }
        return response.data;
    },

    deleteBook: async (id: number): Promise<boolean> => {
        console.log(
            BOOK_URLS.DELETE(id)
        )
        await axios.delete(BOOK_URLS.DELETE(id));
        console.log('deleteBook success for id:', id);
        return true;
    },

    borrowBook: async (id: number): Promise<Book> => {
        const response = await axios.post(BOOK_URLS.BORROW(id));
        console.log('borrowBook response:', response.data);
        if (typeof response.data === 'string') {
            console.warn('borrowBook returned string; fetching book data');
            return bookService.getBookById(id);
        }
        if (!isValidBook(response.data)) {
            throw new Error('Invalid book data received');
        }
        return response.data;
    },

    returnBook: async (id: number): Promise<Book> => {
        const response = await axios.post(BOOK_URLS.RETURN(id));
        console.log('returnBook response:', response.data);
        if (typeof response.data === 'string') {
            console.warn('returnBook returned string; fetching book data');
            return bookService.getBookById(id);
        }
        if (!isValidBook(response.data)) {
            throw new Error('Invalid book data received');
        }
        return response.data;
    },

    getBorrowedBooks: async (): Promise<Book[]> => {
        const response = await axios.get<Book[]>(BOOK_URLS.GET_BORROWED);
        console.log('getBorrowedBooks response:', response.data);
        if (!Array.isArray(response.data) || !response.data.every(isValidBook)) {
            throw new Error('Invalid borrowed  received');
        }
        return response.data;
    },
};

export default bookService;
