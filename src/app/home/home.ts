import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BookCard } from '../book-card/book-card';
import { Book, BookService } from '../services/book.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, BookCard],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private bookService = inject(BookService);

  books: Book[] = [];
  loading = false;

  ngOnInit(): void {
    this.chargerAccueil();
  }

  chargerAccueil(): void {
    this.loading = true;

    this.bookService.getBooks('harry potter').subscribe({
      next: (response) => {
        this.books = response;
        this.loading = false;
      },
      error: () => {
        this.books = [];
        this.loading = false;
      }
    });
  }
}