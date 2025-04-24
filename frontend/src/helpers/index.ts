import {Book} from "@/src/interfaces/book";

export const isValidBook = (book: unknown): book is Book => {
    return (
        !!book &&
        typeof book === 'object' &&
        'id' in book &&
        typeof book.id === 'number' &&
        'title' in book &&
        typeof book.title === 'string' &&
        'author' in book &&
        typeof book.author === 'string' &&
        'available' in book &&
        typeof book.available === 'boolean'
    );
};

export const withAsync = async <T>(
    operation: () => Promise<T>,
    setIsLoading: (loading: boolean) => void,
    setError: (error: string | null) => void
): Promise<T | undefined> => {
    try {
        setIsLoading(true);
        setError(null);
        return await operation();
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Operation failed';
        console.error('Error:', err);
        setError(errorMessage);
        return undefined;
    } finally {
        setIsLoading(false);
    }
};