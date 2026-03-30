import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

export interface Book {
  id: string;
  title: string;
  authorNames: string[];
  firstPublishYear: number | null;
  coverId: number | null;
}

export interface AuthorRef {
  author: {
    key: string;
  };
}

export interface Author {
  id: string;
  name: string;
}

export interface BookDetail {
  id: string;
  title: string;
  description: string;
  subjects: string[];
  covers: number[];
  authors: Author[];
}

@Injectable({
  providedIn: 'root'
})
export class Data {
  http = inject(HttpClient);
  baseUrl = 'https://openlibrary.org';
  favoritesKey = 'favorite_books';
  readingListKey = 'reading_list_books';

  getBooks(search: string): Observable<Book[]> {
    return this.http
      .get<any>(`${this.baseUrl}/search.json?q=${encodeURIComponent(search)}&limit=12`)
      .pipe(
        map(response =>
          response.docs.map((item: any) => ({
            id: item.key ? item.key.replace('/works/', '') : '',
            title: item.title ?? 'Titre inconnu',
            authorNames: item.author_name ?? [],
            firstPublishYear: item.first_publish_year ?? null,
            coverId: item.cover_i ?? null
          }))
        )
      );
  }

  getBookById(id: string): Observable<BookDetail> {
    return this.http.get<any>(`${this.baseUrl}/works/${id}.json`).pipe(
      switchMap((item: any) => {
        const authorRequests: Observable<Author>[] =
          item.authors && item.authors.length > 0
            ? item.authors.map((a: AuthorRef) =>
                this.http.get<any>(`${this.baseUrl}${a.author.key}.json`).pipe(
                  map((author: any): Author => ({
                    id: a.author.key.replace('/authors/', ''),
                    name: author.name ?? 'Auteur inconnu'
                  }))
                )
              )
            : [];

        if (authorRequests.length === 0) {
          return of({
            id: id,
            title: item.title ?? 'Titre inconnu',
            description: this.getDescription(item.description),
            subjects: item.subjects ?? [],
            covers: item.covers ?? [],
            authors: []
          } as BookDetail);
        }

        return forkJoin(authorRequests).pipe(
          map((authors: Author[]): BookDetail => ({
            id: id,
            title: item.title ?? 'Titre inconnu',
            description: this.getDescription(item.description),
            subjects: item.subjects ?? [],
            covers: item.covers ?? [],
            authors: authors
          }))
        );
      })
    );
  }

  getAuthorById(id: string): Observable<Author> {
    return this.http.get<any>(`${this.baseUrl}/authors/${id}.json`).pipe(
      map((author: any): Author => ({
        id: id,
        name: author.name ?? 'Auteur inconnu'
      }))
    );
  }

  getDescription(description: any): string {
    if (!description) {
      return 'Pas de description';
    }

    if (typeof description === 'string') {
      return description;
    }

    if (description.value) {
      return description.value;
    }

    return 'Pas de description';
  }

  getFavorites(): Book[] {
    const data = localStorage.getItem(this.favoritesKey);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  }

  addToFavorites(book: Book): void {
    const favorites = this.getFavorites();
    const exists = favorites.find(fav => fav.id === book.id);

    if (!exists) {
      favorites.push(book);
      localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    }
  }

  removeFromFavorites(bookId: string): void {
    const favorites = this.getFavorites().filter(book => book.id !== bookId);
    localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
  }

  isFavorite(bookId: string): boolean {
    return this.getFavorites().some(book => book.id === bookId);
  }

  getReadingList(): Book[] {
    const data = localStorage.getItem(this.readingListKey);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  }

  addToReadingList(book: Book): void {
    const readingList = this.getReadingList();
    const exists = readingList.find(item => item.id === book.id);

    if (!exists) {
      readingList.push(book);
      localStorage.setItem(this.readingListKey, JSON.stringify(readingList));
    }
  }

  removeFromReadingList(bookId: string): void {
    const readingList = this.getReadingList().filter(book => book.id !== bookId);
    localStorage.setItem(this.readingListKey, JSON.stringify(readingList));
  }

  isInReadingList(bookId: string): boolean {
    return this.getReadingList().some(book => book.id === bookId);
  }
}