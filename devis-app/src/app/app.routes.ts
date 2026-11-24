import { Routes } from '@angular/router';
import { QuoteList } from './pages/quote-list';
import { QuoteEditor } from './pages/quote-editor';

export const routes: Routes = [
  { path: '', component: QuoteList },
  { path: 'devis/:id', component: QuoteEditor },
  { path: '**', redirectTo: '' },
];
