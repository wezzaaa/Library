import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookDetail as BookDetailModel, BookService } from '../services/book.service';

@Component({
  selector: 'app-book-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css'
})
export class BookDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);

  bookId = '';
  book: BookDetailModel | null = null;
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

    this.bookService.getBookById(this.bookId).subscribe({
      next: (response) => {
        this.book = response;
        this.loading = false;
      },
      error: () => {
        this.book = null;
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