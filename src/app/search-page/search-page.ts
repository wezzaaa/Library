import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { BookCard } from '../book-card/book-card';
import { Book, BookService } from '../services/book.service';

@Component({
  selector: 'app-search-page',
  imports: [CommonModule, ReactiveFormsModule, BookCard],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css'
})
export class SearchPage implements OnInit {
  private bookService = inject(BookService);

  books: Book[] = [];
  loading = false;
  hasSearched = false;
  message = '';

  searchControl = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value: string) => {
          const search = value.trim();

          if (search.length < 1) {
            this.books = [];
            this.hasSearched = false;
            this.loading = false;
            this.message = '';
            return of([]);
          }

          this.loading = true;
          this.hasSearched = true;
          this.message = '';

          return this.bookService.getBooks(search);
        })
      )
      .subscribe({
        next: (response) => {
          this.books = response;
          this.loading = false;

          if (this.hasSearched && response.length === 0) {
            this.message = 'Aucun livre trouvé.';
          }
        },
        error: () => {
          this.books = [];
          this.loading = false;
          this.message = 'Erreur pendant la recherche.';
        }
      });
  }
}