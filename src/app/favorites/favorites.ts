import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BookCard } from '../book-card/book-card';
import { Book } from '../services/book.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, BookCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites implements OnInit {
  private storageService = inject(StorageService);

  books: Book[] = [];

  ngOnInit(): void {
    this.storageService.favorites$.subscribe(favorites => {
      this.books = favorites;
    });
  }
}