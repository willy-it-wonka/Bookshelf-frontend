export class Book {
  id!: number;
  title!: string;
  author!: string;
  createdDate!: string;
  lastModifiedDate!: string;
  status: string = 'WAITING'; // Default status when creating a new book
  linkToCover!: string;
}
