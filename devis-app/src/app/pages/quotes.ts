import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Quote, QuoteStatus, STATUSES } from '../core/models';
import { QuoteStore, grandTotal } from '../core/quote.store';
import { Icon } from '../ui/icon';
import { ToastService } from '../ui/toast';
import { Tip } from '../ui/tooltip';
import { QuotesTable } from '../ui/quotes-table';
import { Ui } from '../ui/ui.service';

type Sort = 'recent' | 'amount' | 'client';

@Component({
  selector: 'app-quotes',
  imports: [FormsModule, Icon, QuotesTable, Tip],
  templateUrl: './quotes.html',
})
export class Quotes {
  protected readonly ui = inject(Ui);
  private readonly store = inject(QuoteStore);
  private readonly toast = inject(ToastService);

  protected readonly statuses = STATUSES;
  protected readonly q = signal('');
  protected readonly filter = signal<QuoteStatus | 'all'>('all');
  protected readonly sort = signal<Sort>('recent');
  protected readonly all = this.store.quotes;

  protected readonly counts = computed(() => {
    const c: Record<string, number> = { all: this.all().length };
    for (const s of STATUSES) c[s.value] = this.all().filter((x) => x.status === s.value).length;
    return c;
  });

  protected readonly list = computed<Quote[]>(() => {
    const t = this.q().trim().toLowerCase();
    const f = this.filter();
    let l = this.all().filter(
      (d) => (f === 'all' || d.status === f) && (!t || `${d.number} ${d.client} ${d.project}`.toLowerCase().includes(t)),
    );
    const s = this.sort();
    l = [...l].sort((a, b) =>
      s === 'amount' ? grandTotal(b) - grandTotal(a) : s === 'client' ? a.client.localeCompare(b.client) : b.updatedAt - a.updatedAt,
    );
    return l;
  });

  exportJson() {
    const blob = new Blob([this.store.exportJson()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `devis-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    this.toast.success('Sauvegarde téléchargée');
  }

  async importJson(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const ok = await this.ui.confirm({
      title: 'Importer une sauvegarde ?',
      message: 'Les devis actuellement affichés seront remplacés par ceux du fichier.',
      confirmLabel: 'Importer',
    });
    if (ok) {
      try {
        this.store.importJson(await file.text());
        this.toast.success('Sauvegarde importée');
      } catch {
        this.toast.error('Fichier invalide : import annulé.');
      }
    }
    input.value = '';
  }
}
