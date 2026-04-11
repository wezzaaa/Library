import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BookCard } from '../book-card/book-card';
import { Book } from '../services/book.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, BookCard],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private storageService = inject(StorageService);

  favorites: Book[] = [];
  readingList: Book[] = [];

  ngOnInit(): void {
    this.storageService.favorites$.subscribe(favorites => {
      this.favorites = favorites;
    });

    this.storageService.readingList$.subscribe(readingList => {
      this.readingList = readingList;
    });
  }
}