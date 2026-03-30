import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BookCard } from '../book-card/book-card';
import { Book, Data } from '../data';

@Component({
  selector: 'app-reading-list',
  imports: [CommonModule, BookCard],
  templateUrl: './reading-list.html',
  styleUrl: './reading-list.css'
})
export class ReadingList implements OnInit {
  data = inject(Data);

  books: Book[] = [];

  ngOnInit(): void {
    this.chargerListeALire();
  }

  chargerListeALire(): void {
    this.books = this.data.getReadingList();
  }
}