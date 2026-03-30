import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-detail',
  imports: [],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css'
})
export class BookDetail implements OnInit {
  route = inject(ActivatedRoute);
  bookId = '';

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id') || '';
  }
}