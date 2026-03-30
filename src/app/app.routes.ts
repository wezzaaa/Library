import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `<h1>Library works!</h1>`,
  standalone: true
})
class Home {}

export const routes: Routes = [
  { path: '', component: Home }
];