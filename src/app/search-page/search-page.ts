import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { BookCard } from '../book-card/book-card';
import { Book, BookService } from '../services/book.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-search-page',
  imports: [CommonModule, ReactiveFormsModule, BookCard],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css'
})
export class SearchPage implements OnInit {
  private bookService = inject(BookService);
  private storageService = inject(StorageService);

  books: Book[] = [];
  displayedBooks: Book[] = [];
  filteredBooks: Book[] = [];
  searchHistory: string[] = [];

  loading = false;
  hasSearched = false;
  message = '';

  itemsPerPage = 8;
  currentPage = 1;

  searchControl = new FormControl('', { nonNullable: true });
  authorFilterControl = new FormControl('', { nonNullable: true });
  yearFilterControl = new FormControl('all', { nonNullable: true });
  sortControl = new FormControl('default', { nonNullable: true });

  ngOnInit(): void {
    this.storageService.searchHistory$.subscribe(history => {
      this.searchHistory = history;
    });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value: string) => {
          const search = value.trim();

          if (search.length < 1) {
            this.books = [];
            this.filteredBooks = [];
            this.displayedBooks = [];
            this.hasSearched = false;
            this.loading = false;
            this.message = '';
            this.currentPage = 1;
            return of([]);
          }

          this.loading = true;
          this.hasSearched = true;
          this.message = '';
          this.currentPage = 1;

          return this.bookService.getBooks(search);
        })
      )
      .subscribe({
        next: (response) => {
          this.books = response;
          this.applyFilters();
          this.loading = false;

          const currentSearch = this.searchControl.value.trim();
          if (currentSearch) {
            this.storageService.addSearchToHistory(currentSearch);
          }

          if (this.hasSearched && this.filteredBooks.length === 0) {
            this.message = 'Aucun livre trouvé.';
          }
        },
        error: () => {
          this.books = [];
          this.filteredBooks = [];
          this.displayedBooks = [];
          this.loading = false;
          this.message = 'Erreur pendant la recherche.';
        }
      });

    this.authorFilterControl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });

    this.yearFilterControl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });

    this.sortControl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const authorFilter = this.authorFilterControl.value.trim().toLowerCase();
    const yearFilter = this.yearFilterControl.value;
    const sortValue = this.sortControl.value;

    let result = [...this.books];

    if (authorFilter) {
      result = result.filter(book =>
        book.authorNames.some(author =>
          author.toLowerCase().includes(authorFilter)
        )
      );
    }

    if (yearFilter !== 'all') {
      result = result.filter(book => {
        if (book.firstPublishYear === null) {
          return false;
        }

        if (yearFilter === 'before-1950') {
          return book.firstPublishYear < 1950;
        }

        if (yearFilter === '1950-1999') {
          return book.firstPublishYear >= 1950 && book.firstPublishYear <= 1999;
        }

        if (yearFilter === '2000-2009') {
          return book.firstPublishYear >= 2000 && book.firstPublishYear <= 2009;
        }

        if (yearFilter === '2010-2019') {
          return book.firstPublishYear >= 2010 && book.firstPublishYear <= 2019;
        }

        if (yearFilter === '2020-now') {
          return book.firstPublishYear >= 2020;
        }

        return true;
      });
    }

    if (sortValue === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === 'title-desc') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortValue === 'year-desc') {
      result.sort((a, b) => (b.firstPublishYear ?? 0) - (a.firstPublishYear ?? 0));
    } else if (sortValue === 'year-asc') {
      result.sort((a, b) => (a.firstPublishYear ?? 999999) - (b.firstPublishYear ?? 999999));
    }

    this.filteredBooks = result;
    this.updateDisplayedBooks();

    if (this.hasSearched && this.filteredBooks.length === 0) {
      this.message = 'Aucun livre ne correspond aux filtres.';
    } else {
      this.message = '';
    }
  }

  updateDisplayedBooks(): void {
    this.displayedBooks = this.filteredBooks.slice(0, this.currentPage * this.itemsPerPage);
  }

  voirPlus(): void {
    this.currentPage++;
    this.updateDisplayedBooks();
  }

  canShowMore(): boolean {
    return this.displayedBooks.length < this.filteredBooks.length;
  }

  useHistoryItem(item: string): void {
    this.searchControl.setValue(item);
  }

  clearHistory(): void {
    this.storageService.clearSearchHistory();
  }
}