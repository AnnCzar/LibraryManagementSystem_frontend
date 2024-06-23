export class BookDto {
  isbn?: string;
  title?: string;
  author?: string;
  publisher?: string;
  publishYear?: number;
  numberCopy?: number;
  id?: string;

  constructor(init?: Partial<BookDto>) {
    Object.assign(this, init);
  }
}

export class BookDetailsDto {
  genre?: string;
  summary?: string;
  coverImageURL?: string;

  constructor(init?: Partial<BookDetailsDto>) {
    Object.assign(this, init);
  }
}

export class BookResponseDto {
  id: number | undefined;
  isbn: string | undefined;
  title: string | undefined;
  author: string | undefined;
  publisher: string | undefined;
  publishYear: number | undefined;
  numberCopy: number | undefined;
  genre?: string;
  summary?: string;
  coverImageURL?: string;

  constructor(init?: Partial<BookResponseDto>) {
    Object.assign(this, init);
  }
}
