export interface Category {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  isAdmin?: boolean;
}

export interface UserRegister {
  name: string;
  username: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface LibraryItemBase {
  id: string;
  title: string;
  type: string;
  isBorrowable: boolean;
  categoryId: string;
  abbreviation: string;
  borrower?: string;
  borrowDate?: Date | string | null;
  categoryName?: string;
}

export interface Book extends LibraryItemBase {
  type: "book";
  author: string;
  nbrPages: number;
}

export interface ReferenceBook extends LibraryItemBase {
  type: "referencebook";
  author: string;
  nbrPages: number;
}

export interface DVD extends LibraryItemBase {
  type: "dvd";
  runTimeMinutes: number;
}

export interface Audiobook extends LibraryItemBase {
  type: "audiobook";
  runTimeMinutes: number;
}

export type LibraryItemType = Book | ReferenceBook | DVD | Audiobook;
