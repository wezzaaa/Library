import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookCard } from '../book-card/book-card';
import { AuthorDetail as AuthorDetailModel, BookService } from '../services/book.service';

@Component({
  selector: 'app-author-detail',
  imports: [CommonModule, BookCard],
  templateUrl: './author-detail.html',
  styleUrl: './author-detail.css'
})
export class AuthorDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);

  authorId = '';
  author: AuthorDetailModel | null = null;
  loading = false;

  ngOnInit(): void {
    this.authorId = this.route.snapshot.paramMap.get('id') || '';
    this.chargerAuteur();
  }

  chargerAuteur(): void {
    if (!this.authorId) {
      return;
    }

    this.loading = true;

    this.bookService.getAuthorDetailById(this.authorId).subscribe({
      next: (response) => {
        this.author = response;
        this.loading = false;
      },
      error: () => {
        this.author = null;
        this.loading = false;
      }
    });
  }
}