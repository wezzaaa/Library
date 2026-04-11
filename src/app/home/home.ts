import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BookCard } from '../book-card/book-card';
import { Book, BookService } from '../services/book.service';
import { StorageService } from '../services/storage.service';

interface Category {
  title: string;
  query: string;
  books: Book[];
}

interface DetectedCategory {
  label: string;
  query: string;
  keywords: string[];
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, BookCard],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private bookService = inject(BookService);
  private storageService = inject(StorageService);

  loading = false;

  continueReading: Book[] = [];
  smartRecommendations: Book[] = [];
  smartRecommendationReason = '';

  categories: Category[] = [
    { title: 'Tendances', query: 'popular', books: [] },
    { title: 'Science-fiction', query: 'science fiction', books: [] },
    { title: 'Fantasy', query: 'fantasy', books: [] },
    { title: 'Romance', query: 'romance', books: [] },
    { title: 'Policier et thriller', query: 'thriller', books: [] },
    { title: 'Horreur', query: 'horror', books: [] },
    { title: 'Classiques', query: 'classic novels', books: [] },
    { title: 'Philosophie', query: 'philosophy', books: [] },
    { title: 'Histoire', query: 'history', books: [] },
    { title: 'Business et économie', query: 'business', books: [] },
    { title: 'Développement personnel', query: 'self improvement', books: [] },
    { title: 'Littérature américaine', query: 'american literature', books: [] },
    { title: 'Littérature française', query: 'french literature', books: [] }
  ];

  detectedCategories: DetectedCategory[] = [
    {
      label: 'romance',
      query: 'romance',
      keywords: ['love', 'romance', 'heart', 'lover', 'passion', 'wedding']
    },
    {
      label: 'science-fiction',
      query: 'science fiction',
      keywords: ['space', 'robot', 'future', 'galaxy', 'alien', 'planet', 'sci-fi', 'science']
    },
    {
      label: 'fantasy',
      query: 'fantasy',
      keywords: ['magic', 'dragon', 'kingdom', 'sword', 'wizard', 'fantasy', 'throne']
    },
    {
      label: 'policier et thriller',
      query: 'thriller',
      keywords: ['crime', 'murder', 'killer', 'detective', 'thriller', 'mystery', 'police']
    },
    {
      label: 'horreur',
      query: 'horror',
      keywords: ['ghost', 'haunted', 'horror', 'dark', 'death', 'monster', 'fear']
    },
    {
      label: 'histoire',
      query: 'history',
      keywords: ['history', 'war', 'empire', 'revolution', 'historical', 'ancient']
    },
    {
      label: 'philosophie',
      query: 'philosophy',
      keywords: ['philosophy', 'ethics', 'mind', 'reason', 'thought']
    },
    {
      label: 'développement personnel',
      query: 'self improvement',
      keywords: ['habit', 'success', 'mindset', 'growth', 'self', 'confidence']
    }
  ];

  ngOnInit(): void {
    this.storageService.favorites$.subscribe(favorites => {
      this.updateSmartRecommendations(favorites, this.storageService.getReadingList());
    });

    this.storageService.readingList$.subscribe(readingList => {
      this.continueReading = readingList.slice(0, 10);
      this.updateSmartRecommendations(this.storageService.getFavorites(), readingList);
    });

    this.continueReading = this.storageService.getReadingList().slice(0, 10);
    this.updateSmartRecommendations(
      this.storageService.getFavorites(),
      this.storageService.getReadingList()
    );

    this.chargerCategories();
  }

  chargerCategories(): void {
    this.loading = true;
    let loadedCount = 0;

    this.categories.forEach((category, index) => {
      this.bookService.getBooks(category.query).subscribe({
        next: (response) => {
          this.categories[index].books = response.slice(0, 10);
          loadedCount++;

          if (loadedCount === this.categories.length) {
            this.loading = false;
          }
        },
        error: () => {
          this.categories[index].books = [];
          loadedCount++;

          if (loadedCount === this.categories.length) {
            this.loading = false;
          }
        }
      });
    });
  }

  private updateSmartRecommendations(favorites: Book[], readingList: Book[]): void {
    const userBooks = [...favorites, ...readingList];

    if (userBooks.length === 0) {
      this.smartRecommendations = [];
      this.smartRecommendationReason = '';
      return;
    }

    const latestBook = userBooks[userBooks.length - 1];
    const authorCount = new Map<string, number>();
    const categoryCount = new Map<string, number>();

    userBooks.forEach(book => {
      book.authorNames.forEach(author => {
        const cleanedAuthor = author.trim();
        if (cleanedAuthor) {
          authorCount.set(cleanedAuthor, (authorCount.get(cleanedAuthor) ?? 0) + 1);
        }
      });

      const searchableText = `${book.title} ${book.authorNames.join(' ')}`
        .toLowerCase();

      this.detectedCategories.forEach(category => {
        const matchesCategory = category.keywords.some(keyword =>
          searchableText.includes(keyword.toLowerCase())
        );

        if (matchesCategory) {
          categoryCount.set(category.label, (categoryCount.get(category.label) ?? 0) + 1);
        }
      });
    });

    const topAuthor = this.getTopEntry(authorCount);
    const topCategory = this.getTopEntry(categoryCount);

    if (topAuthor && topAuthor.count >= 2) {
      this.bookService.getBooks(topAuthor.value).subscribe({
        next: books => {
          this.smartRecommendations = books
            .filter(book => !userBooks.some(userBook => userBook.id === book.id))
            .slice(0, 10);

          this.smartRecommendationReason =
            `Parce que vous aimez souvent les livres de ${topAuthor.value}`;
        },
        error: () => {
          this.smartRecommendations = [];
          this.smartRecommendationReason = '';
        }
      });
      return;
    }

    if (topCategory && topCategory.count >= 2) {
      const matchedCategory = this.detectedCategories.find(
        category => category.label === topCategory.value
      );

      if (matchedCategory) {
        this.bookService.getBooks(matchedCategory.query).subscribe({
          next: books => {
            this.smartRecommendations = books
              .filter(book => !userBooks.some(userBook => userBook.id === book.id))
              .slice(0, 10);

            this.smartRecommendationReason =
              `Parce que vous lisez souvent des livres de ${matchedCategory.label}`;
          },
          error: () => {
            this.smartRecommendations = [];
            this.smartRecommendationReason = '';
          }
        });
        return;
      }
    }

    const fallbackQuery =
      latestBook.authorNames.length > 0 ? latestBook.authorNames[0] : latestBook.title;

    this.bookService.getBooks(fallbackQuery).subscribe({
      next: books => {
        this.smartRecommendations = books
          .filter(book => book.id !== latestBook.id)
          .slice(0, 10);

        this.smartRecommendationReason =
          `Parce que vous avez ajouté "${latestBook.title}"`;
      },
      error: () => {
        this.smartRecommendations = [];
        this.smartRecommendationReason = '';
      }
    });
  }

  private getTopEntry(map: Map<string, number>): { value: string; count: number } | null {
    let topValue = '';
    let topCount = 0;

    map.forEach((count, value) => {
      if (count > topCount) {
        topValue = value;
        topCount = count;
      }
    });

    if (!topValue) {
      return null;
    }

    return { value: topValue, count: topCount };
  }
}