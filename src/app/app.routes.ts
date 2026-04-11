import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SearchPage } from './search-page/search-page';
import { BookDetail } from './book-detail/book-detail';
import { AuthorDetail } from './author-detail/author-detail';
import { Favorites } from './favorites/favorites';
import { ReadingList } from './reading-list/reading-list';
import { Profile } from './profile/profile';
import { About } from './about/about';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'search', component: SearchPage },
  { path: 'book/:id', component: BookDetail },
  { path: 'author/:id', component: AuthorDetail },
  { path: 'favorites', component: Favorites },
  { path: 'reading-list', component: ReadingList },
  { path: 'profile', component: Profile },
  { path: 'about', component: About },
  { path: '**', component: NotFound }
];