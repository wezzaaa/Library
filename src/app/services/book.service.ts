import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, shareReplay, switchMap } from 'rxjs';

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

export interface AuthorDetail {
  id: string;
  name: string;
  bio: string;
  birthDate: string;
  deathDate: string;
  works: Book[];
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
export class BookService {
  private http = inject(HttpClient);
  private baseUrl = 'https://openlibrary.org';

  private searchCache = new Map<string, Observable<Book[]>>();
  private bookDetailCache = new Map<string, Observable<BookDetail>>();
  private authorCache = new Map<string, Observable<Author>>();
  private authorDetailCache = new Map<string, Observable<AuthorDetail>>();

  getBooks(search: string): Observable<Book[]> {
    const value = search.trim().toLowerCase();

    if (value.length < 1) {
      return of([]);
    }

    const cached = this.searchCache.get(value);
    if (cached) {
      return cached;
    }

    const query =
      value.length <= 3
        ? `${this.baseUrl}/search.json?title=${encodeURIComponent(value)}&limit=12`
        : `${this.baseUrl}/search.json?q=${encodeURIComponent(value)}&limit=12`;

    const request$ = this.http.get<any>(query).pipe(
      map(response =>
        (response.docs ?? []).map((item: any) => ({
          id: item.key ? item.key.replace('/works/', '') : '',
          title: item.title ?? 'Titre inconnu',
          authorNames: item.author_name ?? [],
          firstPublishYear: item.first_publish_year ?? null,
          coverId: item.cover_i ?? null
        }))
      ),
      shareReplay(1)
    );

    this.searchCache.set(value, request$);
    return request$;
  }

  getBookById(id: string): Observable<BookDetail> {
    const cached = this.bookDetailCache.get(id);
    if (cached) {
      return cached;
    }

    const request$ = this.http.get<any>(`${this.baseUrl}/works/${id}.json`).pipe(
      switchMap((item: any) => {
        const authorRequests: Observable<Author>[] =
          item.authors && item.authors.length > 0
            ? item.authors.map((a: AuthorRef) =>
                this.getAuthorById(a.author.key.replace('/authors/', ''))
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
      }),
      shareReplay(1)
    );

    this.bookDetailCache.set(id, request$);
    return request$;
  }

  getAuthorById(id: string): Observable<Author> {
    const cached = this.authorCache.get(id);
    if (cached) {
      return cached;
    }

    const request$ = this.http.get<any>(`${this.baseUrl}/authors/${id}.json`).pipe(
      map((author: any): Author => ({
        id: id,
        name: author.name ?? 'Auteur inconnu'
      })),
      shareReplay(1)
    );

    this.authorCache.set(id, request$);
    return request$;
  }

  getAuthorDetailById(id: string): Observable<AuthorDetail> {
    const cached = this.authorDetailCache.get(id);
    if (cached) {
      return cached;
    }

    const request$ = this.http.get<any>(`${this.baseUrl}/authors/${id}.json`).pipe(
      switchMap((author: any) =>
        this.http.get<any>(`${this.baseUrl}/authors/${id}/works.json?limit=12`).pipe(
          map((worksResponse: any): AuthorDetail => ({
            id: id,
            name: author.name ?? 'Auteur inconnu',
            bio: this.getBio(author.bio),
            birthDate: author.birth_date ?? 'Inconnue',
            deathDate: author.death_date ?? '---',
            works: (worksResponse.entries ?? []).map((work: any) => ({
              id: work.key ? work.key.replace('/works/', '') : '',
              title: work.title ?? 'Titre inconnu',
              authorNames: [author.name ?? 'Auteur inconnu'],
              firstPublishYear: work.first_publish_date
                ? Number(String(work.first_publish_date).slice(0, 4))
                : null,
              coverId: work.covers && work.covers.length > 0 ? work.covers[0] : null
            }))
          }))
        )
      ),
      shareReplay(1)
    );

    this.authorDetailCache.set(id, request$);
    return request$;
  }

  private getDescription(description: any): string {
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

  private getBio(bio: any): string {
    if (!bio) {
      return 'Pas de biographie.';
    }

    if (typeof bio === 'string') {
      return bio;
    }

    if (bio.value) {
      return bio.value;
    }

    return 'Pas de biographie.';
  }
}