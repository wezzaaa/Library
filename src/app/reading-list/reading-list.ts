import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BookCard } from '../book-card/book-card';
import { Book } from '../services/book.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-reading-list',
  imports: [CommonModule, BookCard],
  templateUrl: './reading-list.html',
  styleUrl: './reading-list.css'
})
export class ReadingList implements OnInit {
  private storageService = inject(StorageService);

  books: Book[] = [];

  ngOnInit(): void {
    this.storageService.readingList$.subscribe(readingList => {
      this.books = readingList;
    });
  }
}