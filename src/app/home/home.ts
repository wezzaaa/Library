import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Data, Book } from '../data';
import { BookCard } from '../book-card/book-card';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, BookCard],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  data = inject(Data);

  books: Book[] = [];
  search = '';
  loading = false;

  ngOnInit(): void {
    this.chargerAccueil();
  }

  chargerAccueil(): void {
    this.loading = true;

    this.data.getBooks('bestseller').subscribe({
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

  chercher(): void {
    if (this.search.trim().length < 2) {
      this.chargerAccueil();
      return;
    }

    this.loading = true;
    this.books = [];

    this.data.getBooks(this.search).subscribe({
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