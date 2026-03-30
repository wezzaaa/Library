import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Book {
  id: string;
  title: string;
  authorNames: string[];
  firstPublishYear: number | null;
  coverId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class Data {
  http = inject(HttpClient);
  baseUrl = 'https://openlibrary.org';

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
}