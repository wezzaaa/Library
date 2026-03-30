import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book, Data } from '../data';

@Component({
  selector: 'app-book-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCard {
  @Input() book!: Book;

  data = inject(Data);

  getCoverUrl(): string {
    if (this.book.coverId) {
      return `https://covers.openlibrary.org/b/id/${this.book.coverId}-M.jpg`;
    }

    return 'https://via.placeholder.com/150x220?text=No+Cover';
  }

  ajouterAuxFavoris(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.data.addToFavorites(this.book);
  }

  retirerDesFavoris(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.data.removeFromFavorites(this.book.id);
  }

  estFavori(): boolean {
    return this.data.isFavorite(this.book.id);
  }
}