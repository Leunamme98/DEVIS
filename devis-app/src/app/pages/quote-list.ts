import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FcfaPipe } from '../core/fcfa.pipe';
import { QuoteStore, grandTotal } from '../core/quote.store';

@Component({
  selector: 'app-quote-list',
  imports: [RouterLink, FcfaPipe],
  templateUrl: './quote-list.html',
  styleUrl: './quote-list.css',
})
export class QuoteList {
  protected readonly store = inject(QuoteStore);
  private readonly router = inject(Router);
  protected readonly total = grandTotal;

  create() {
    const q = this.store.create();
    this.router.navigate(['/devis', q.id]);
  }

  duplicate(id: string) {
    const q = this.store.duplicate(id);
    if (q) this.router.navigate(['/devis', q.id]);
  }

  remove(id: string) {
    if (confirm('Supprimer ce devis ?')) this.store.remove(id);
  }

  exportJson() {
    const blob = new Blob([this.store.exportJson()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `devis-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async importJson(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      this.store.importJson(await file.text());
    } catch {
      alert('Fichier invalide.');
    }
    (ev.target as HTMLInputElement).value = '';
  }
}
