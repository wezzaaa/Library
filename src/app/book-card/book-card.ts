import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../data';

@Component({
  selector: 'app-book-card',
  imports: [RouterLink],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCard {
  @Input() book!: Book;

  getCoverUrl(): string {
    if (this.book.coverId) {
      return `https://covers.openlibrary.org/b/id/${this.book.coverId}-M.jpg`;
    }

    return 'https://via.placeholder.com/150x220?text=No+Cover';
  }
}