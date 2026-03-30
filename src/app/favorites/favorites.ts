import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BookCard } from '../book-card/book-card';
import { Book, Data } from '../data';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, BookCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites implements OnInit {
  data = inject(Data);

  books: Book[] = [];

  ngOnInit(): void {
    this.chargerFavoris();
  }

  chargerFavoris(): void {
    this.books = this.data.getFavorites();
  }
}