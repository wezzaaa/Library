import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from './book.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private favoritesKey = 'favorite_books';
  private readingListKey = 'reading_list_books';
  private searchHistoryKey = 'search_history';

  favorites$ = new BehaviorSubject<Book[]>(this.getFavorites());
  readingList$ = new BehaviorSubject<Book[]>(this.getReadingList());
  searchHistory$ = new BehaviorSubject<string[]>(this.getSearchHistory());

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
      this.favorites$.next(favorites);
    }
  }

  removeFromFavorites(bookId: string): void {
    const favorites = this.getFavorites().filter(book => book.id !== bookId);
    localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    this.favorites$.next(favorites);
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
      this.readingList$.next(readingList);
    }
  }

  removeFromReadingList(bookId: string): void {
    const readingList = this.getReadingList().filter(book => book.id !== bookId);
    localStorage.setItem(this.readingListKey, JSON.stringify(readingList));
    this.readingList$.next(readingList);
  }

  isInReadingList(bookId: string): boolean {
    return this.getReadingList().some(book => book.id === bookId);
  }

  getSearchHistory(): string[] {
    const data = localStorage.getItem(this.searchHistoryKey);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  }

  addSearchToHistory(search: string): void {
    const value = search.trim();

    if (!value) {
      return;
    }

    const history = this.getSearchHistory().filter(item => item.toLowerCase() !== value.toLowerCase());
    history.unshift(value);

    const limitedHistory = history.slice(0, 8);

    localStorage.setItem(this.searchHistoryKey, JSON.stringify(limitedHistory));
    this.searchHistory$.next(limitedHistory);
  }

  clearSearchHistory(): void {
    localStorage.removeItem(this.searchHistoryKey);
    this.searchHistory$.next([]);
  }
}