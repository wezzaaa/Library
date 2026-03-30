import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Data, Author } from '../data';

@Component({
  selector: 'app-author-detail',
  imports: [CommonModule],
  templateUrl: './author-detail.html',
  styleUrl: './author-detail.css'
})
export class AuthorDetail implements OnInit {
  route = inject(ActivatedRoute);
  data = inject(Data);

  authorId = '';
  author: Author | null = null;
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

    this.data.getAuthorById(this.authorId).subscribe({
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