export interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    available?: boolean;
    borrowedBy?: string;
    borrowedDate?: string;
    returnDate?: string;
}

export interface BookCreateRequest {
    title: string;
    author: string;
    description: string;
}

export interface BookUpdateRequest extends BookCreateRequest {
    id: number;
}