import { BookCategory } from './book-category';

export class Book {
  id!: number;
  title!: string;
  author!: string;
  status!: string;
  linkToCover!: string;
  categories: BookCategory[] = [];
  createdDate!: string;
  lastModifiedDate!: string;
}
