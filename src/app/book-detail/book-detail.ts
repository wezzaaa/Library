import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Book, BookDetail as BookDetailModel, BookService } from '../services/book.service';
import { BookCard } from '../book-card/book-card';

@Component({
  selector: 'app-book-detail',
  imports: [CommonModule, RouterLink, BookCard],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css'
})
export class BookDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);

  bookId = '';
  book: BookDetailModel | null = null;
  recommendations: Book[] = [];
  recommendationReason = '';
  loading = false;

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id') || '';
    this.chargerLivre();
  }

  chargerLivre(): void {
    if (!this.bookId) {
      return;
    }

    this.loading = true;
    this.recommendations = [];
    this.recommendationReason = '';

    this.bookService.getBookById(this.bookId).subscribe({
      next: (response) => {
        this.book = response;
        this.loading = false;

        this.bookService.getRecommendations(response).subscribe({
          next: (books) => {
            this.recommendations = books;

            if (response.authors.length > 0) {
              this.recommendationReason = `Basé sur l’auteur : ${response.authors[0].name}`;
            } else if (response.subjects.length > 0) {
              this.recommendationReason = `Basé sur le sujet : ${response.subjects[0]}`;
            } else {
              this.recommendationReason = '';
            }
          },
          error: () => {
            this.recommendations = [];
            this.recommendationReason = '';
          }
        });
      },
      error: () => {
        this.book = null;
        this.recommendations = [];
        this.recommendationReason = '';
        this.loading = false;
      }
    });
  }

  getCoverUrl(): string {
    if (this.book && this.book.covers.length > 0) {
      return `https://covers.openlibrary.org/b/id/${this.book.covers[0]}-L.jpg`;
    }

    return 'https://via.placeholder.com/220x320?text=No+Cover';
  }
}