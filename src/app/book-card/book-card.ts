import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../services/book.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-book-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCard {
  @Input() book!: Book;

  private storageService = inject(StorageService);

  getCoverUrl(): string {
    if (this.book.coverId) {
      return `https://covers.openlibrary.org/b/id/${this.book.coverId}-M.jpg`;
    }

    return 'https://via.placeholder.com/150x220?text=No+Cover';
  }

  ajouterAuxFavoris(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.storageService.addToFavorites(this.book);
  }

  retirerDesFavoris(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.storageService.removeFromFavorites(this.book.id);
  }

  estFavori(): boolean {
    return this.storageService.isFavorite(this.book.id);
  }

  ajouterALire(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.storageService.addToReadingList(this.book);
  }

  retirerALire(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.storageService.removeFromReadingList(this.book.id);
  }

  estDansALire(): boolean {
    return this.storageService.isInReadingList(this.book.id);
  }
}