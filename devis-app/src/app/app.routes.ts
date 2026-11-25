import { Routes } from '@angular/router';
import { Home } from './pages/home';
import { QuoteEditor } from './pages/quote-editor';
import { Quotes } from './pages/quotes';

export const routes: Routes = [
  { path: '', component: Home, title: 'Accueil · Sky Alu Devis' },
  { path: 'devis', component: Quotes, title: 'Mes devis · Sky Alu Devis' },
  { path: 'devis/:id', component: QuoteEditor, title: 'Devis · Sky Alu Devis' },
  { path: '**', redirectTo: '' },
];
